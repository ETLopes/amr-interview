"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { login as apiLogin, logout as apiLogout, me as fetchMe, CurrentUser, getToken } from "@/lib/auth";
import {
  createSimulation as apiCreateSimulation,
  updateSimulation as apiUpdateSimulation,
  deleteSimulation as apiDeleteSimulation,
  listSimulations as apiListSimulations,
  type Simulation as ApiSimulation,
  type SimulationInput as ApiSimulationInput,
} from "@/lib/simulations";

export type Simulation = {
  id: string;
  nome: string;
  valorImovel: number;
  percentualEntrada: number;
  anosContrato: number;
  valorEntrada: number;
  valorFinanciar: number;
  totalGuardar: number;
  valorMensalPoupanca: number;
  dataCriacao: string;
};

type CreditScore = {
  score: number;
  level: "excelente" | "alto" | "médio" | "baixo";
  factors: {
    averageDownPayment: number;
    contractStability: number;
    simulationCount: number;
    planningConsistency: number;
  };
  recommendations: string[];
};

type AuthContextValue = {
  user: { nome?: string | null } & CurrentUser | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  simulations: Simulation[];
  addSimulation: (sim: Omit<Simulation, "id" | "valorEntrada" | "valorFinanciar" | "totalGuardar" | "valorMensalPoupanca" | "dataCriacao">) => Promise<void>;
  updateSimulation: (id: string, sim: Omit<Simulation, "id" | "dataCriacao">) => Promise<void>;
  deleteSimulation: (id: string) => Promise<void>;
  betaFeaturesEnabled: boolean;
  toggleBetaFeatures: () => void;
  calculateCreditScore: () => CreditScore;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function mapApiToUi(sim: ApiSimulation): Simulation {
  return {
    id: String(sim.id),
    nome: sim.property_type ? `${sim.property_type}` : `Simulação #${sim.id}`,
    valorImovel: sim.property_value,
    percentualEntrada: sim.down_payment_percentage,
    anosContrato: sim.contract_years,
    valorEntrada: sim.down_payment_amount,
    valorFinanciar: sim.financing_amount,
    totalGuardar: sim.total_to_save,
    valorMensalPoupanca: sim.monthly_savings,
    dataCriacao: sim.created_at,
  };
}

function mapUiToApiInput(sim: { valorImovel: number; percentualEntrada: number; anosContrato: number }): ApiSimulationInput {
  return {
    property_value: sim.valorImovel,
    down_payment_percentage: sim.percentualEntrada,
    contract_years: sim.anosContrato,
  };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<(CurrentUser & { nome?: string | null }) | null>(null);
  const [simulations, setSimulations] = useState<Simulation[]>([]);
  const [betaFeaturesEnabled, setBetaFeaturesEnabled] = useState(() => {
    try {
      return localStorage.getItem("betaFeatures") === "true";
    } catch {
      return false;
    }
  });
  const queryClient = useQueryClient();

  const meQuery = useQuery({
    queryKey: ["me"],
    queryFn: async () => fetchMe(),
    enabled: !!getToken(),
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    if (meQuery.data) {
      setUser({ ...meQuery.data, nome: meQuery.data.name });
    } else if (!getToken()) {
      setUser(null);
    }
  }, [meQuery.data]);

  const simsQuery = useQuery({
    queryKey: ["simulations"],
    queryFn: async () => {
      const list = await apiListSimulations();
      return list.simulations;
    },
    enabled: !!getToken(),
  });

  useEffect(() => {
    if (simsQuery.data) {
      setSimulations(simsQuery.data.map(mapApiToUi));
    } else if (!getToken()) {
      setSimulations([]);
    }
  }, [simsQuery.data]);

  const loginMutation = useMutation({
    mutationFn: async ({ email, password }: { email: string; password: string }) =>
      apiLogin({ username: email, password }),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["me"] }),
        queryClient.invalidateQueries({ queryKey: ["simulations"] }),
      ]);
    },
  });

  const login = async (email: string, password: string) => {
    try {
      await loginMutation.mutateAsync({ email, password });
      return true;
    } catch {
      return false;
    }
  };

  const logout = () => {
    apiLogout();
    queryClient.removeQueries({ queryKey: ["me"] });
    queryClient.removeQueries({ queryKey: ["simulations"] });
    setUser(null);
    setSimulations([]);
  };

  const addSimulationMutation = useMutation({
    mutationFn: async (sim: ApiSimulationInput) => apiCreateSimulation(sim),
    onSuccess: (created) => {
      queryClient.setQueryData<ApiSimulation[] | undefined>(["simulations"], (prev) => {
        const current = prev ?? [];
        return [created, ...current];
      });
    },
  });

  const updateSimulationMutation = useMutation({
    mutationFn: async ({ id, input }: { id: number; input: ApiSimulationInput }) =>
      apiUpdateSimulation(id, input),
    onSuccess: (updated) => {
      queryClient.setQueryData<ApiSimulation[] | undefined>(["simulations"], (prev) => {
        if (!prev) return [updated];
        return prev.map((s) => (s.id === updated.id ? updated : s));
      });
    },
  });

  const deleteSimulationMutation = useMutation({
    mutationFn: async (id: number) => apiDeleteSimulation(id),
    onSuccess: (_, id) => {
      queryClient.setQueryData<ApiSimulation[] | undefined>(["simulations"], (prev) => {
        if (!prev) return prev;
        return prev.filter((s) => s.id !== id);
      });
    },
  });

  const addSimulation: AuthContextValue["addSimulation"] = async (sim) => {
    const input = mapUiToApiInput(sim);
    await addSimulationMutation.mutateAsync(input);
  };

  const updateSimulationFn: AuthContextValue["updateSimulation"] = async (id, sim) => {
    const numericId = Number(id);
    const input = mapUiToApiInput(sim);
    await updateSimulationMutation.mutateAsync({ id: numericId, input });
  };

  const deleteSimulationFn: AuthContextValue["deleteSimulation"] = async (id) => {
    const numericId = Number(id);
    await deleteSimulationMutation.mutateAsync(numericId);
  };

  const toggleBetaFeatures = () => {
    setBetaFeaturesEnabled((v) => {
      const next = !v;
      try {
        localStorage.setItem("betaFeatures", String(next));
      } catch { }
      return next;
    });
  };

  const calculateCreditScore = (): CreditScore => {
    if (simulations.length === 0) {
      return {
        score: 50,
        level: "médio",
        factors: {
          averageDownPayment: 10,
          contractStability: 10,
          simulationCount: 10,
          planningConsistency: 20,
        },
        recommendations: [
          "Crie sua primeira simulação",
          "Ajuste o percentual de entrada para 20% ou mais",
          "Defina um prazo de contrato confortável",
        ],
      };
    }

    const avgDownPct =
      simulations.reduce((sum, s) => sum + s.percentualEntrada, 0) / simulations.length;
    const avgYears = simulations.reduce((sum, s) => sum + s.anosContrato, 0) / simulations.length;
    const factorDown = Math.min(25, Math.round((avgDownPct / 40) * 25));
    const factorYears = Math.min(25, Math.round(((35 - Math.abs(25 - avgYears)) / 35) * 25));
    const factorCount = Math.min(25, Math.round((simulations.length / 10) * 25));
    const factorPlanning = Math.min(25, Math.round((simulations.filter((s) => s.totalGuardar > 0).length / simulations.length) * 25));

    const score = factorDown + factorYears + factorCount + factorPlanning;
    const level = score >= 85 ? "excelente" : score >= 70 ? "alto" : score >= 50 ? "médio" : "baixo" as const;

    const recommendations: string[] = [];
    if (avgDownPct < 20) recommendations.push("Aumente a entrada para pelo menos 20%.");
    if (avgYears > 25) recommendations.push("Considere reduzir o prazo para diminuir juros.");
    if (simulations.length < 3) recommendations.push("Crie mais simulações para comparar cenários.");
    if (factorPlanning < 20) recommendations.push("Defina um plano de poupança mensal consistente.");

    return {
      score,
      level,
      factors: {
        averageDownPayment: factorDown,
        contractStability: factorYears,
        simulationCount: factorCount,
        planningConsistency: factorPlanning,
      },
      recommendations,
    };
  };

  const isLoading = meQuery.isFetching || simsQuery.isFetching || loginMutation.isPending;

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isLoading,
      login,
      logout,
      simulations,
      addSimulation,
      updateSimulation: updateSimulationFn,
      deleteSimulation: deleteSimulationFn,
      betaFeaturesEnabled,
      toggleBetaFeatures,
      calculateCreditScore,
    }),
    [user, isLoading, simulations, betaFeaturesEnabled],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}



