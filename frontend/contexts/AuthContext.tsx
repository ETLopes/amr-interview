'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getApiService, User, Simulation, SimulationCreate } from '../services/api';
import { toast } from 'sonner';

interface AuthContextType {
  user: User | null;
  simulations: Simulation[];
  isLoading: boolean;
  betaFeaturesEnabled: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, nome: string, senha: string) => Promise<void>;
  logout: () => void;
  addSimulation: (simulation: SimulationCreate) => Promise<void>;
  updateSimulation: (id: number, simulation: Partial<SimulationCreate>) => Promise<void>;
  deleteSimulation: (id: number) => Promise<void>;
  loadSimulations: () => Promise<void>;
  toggleBetaFeatures: () => void;
  calculateCreditScore: () => {
    score: number;
    level: 'baixo' | 'médio' | 'alto' | 'excelente';
    factors: {
      averageDownPayment: number;
      contractStability: number;
      simulationCount: number;
      planningConsistency: number;
    };
    recommendations: string[];
  };
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [simulations, setSimulations] = useState<Simulation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [betaFeaturesEnabled, setBetaFeaturesEnabled] = useState(false);

  // Initialize auth state and beta features flag
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Test API connection first
        const apiService = getApiService();
        const connectionTest = await apiService.testConnection();
        console.log('API Connection Test:', connectionTest);

        if (!connectionTest.connected && !connectionTest.offlineMode) {
          console.log('API not available, enabling offline mode');
          apiService.setOfflineMode(true);
        }

        const token = localStorage.getItem('access_token');
        if (token) {
          try {
            // Try to get current user
            const currentUser = await apiService.getCurrentUser();
            setUser(currentUser);

            // Load simulations for the user
            await loadSimulations();
          } catch (userError) {
            console.error('Failed to get current user:', userError);
            // Clear invalid token
            localStorage.removeItem('access_token');
            apiService.clearToken();
          }
        }
      } catch (error) {
        console.error('Failed to initialize auth:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
    // Load beta flag from localStorage on client
    try {
      if (typeof window !== 'undefined') {
        setBetaFeaturesEnabled(localStorage.getItem('betaFeatures') === 'true');
      }
    } catch { }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const apiService = getApiService();
      const { user: loggedInUser } = await apiService.login(email, password);
      setUser(loggedInUser);

      // Load user's simulations
      await loadSimulations();

      const isOffline = apiService.isOffline();
      toast.success(
        `Bem-vindo, ${loggedInUser.nome || loggedInUser.email}!${isOffline ? ' (Modo Demo)' : ''}`
      );
    } catch (error) {
      console.error('Login failed:', error);

      if (error instanceof Error) {
        if (error.message === 'AUTH_FAILED') {
          toast.error(
            'Não foi possível conectar com o servidor. Deseja usar o modo demo?',
            {
              action: {
                label: 'Modo Demo',
                onClick: async () => {
                  getApiService().setOfflineMode(true);
                  try {
                    const { user: demoUser } = await getApiService().login(email, password);
                    setUser(demoUser);
                    await loadSimulations();
                    toast.success(`Bem-vindo ao modo demo, ${demoUser.nome || demoUser.email}!`);
                  } catch (demoError) {
                    toast.error('Erro ao iniciar modo demo');
                  }
                }
              }
            }
          );
        } else {
          toast.error(error.message);
        }
      } else {
        toast.error('Erro ao fazer login');
      }

      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, nome: string, senha: string) => {
    try {
      setIsLoading(true);
      const apiService = getApiService();
      await apiService.register({ email, nome, senha });

      // After registration, automatically log in
      await login(email, senha);

      toast.success('Conta criada com sucesso!');
    } catch (error) {
      console.error('Registration failed:', error);
      const message = error instanceof Error ? error.message : 'Erro ao criar conta';
      toast.error(message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setSimulations([]);
    const apiService = getApiService();
    apiService.clearToken();
    toast.success('Logout realizado com sucesso!');
  };

  const loadSimulations = async () => {
    try {
      const apiService = getApiService();
      const { simulations: userSimulations } = await apiService.getSimulations();
      setSimulations(userSimulations);
    } catch (error) {
      console.error('Failed to load simulations:', error);
      toast.error('Erro ao carregar simulações');
    }
  };

  const addSimulation = async (simulationData: SimulationCreate) => {
    try {
      const apiService = getApiService();
      const newSimulation = await apiService.createSimulation(simulationData);
      setSimulations(prev => [newSimulation, ...prev]);
      toast.success('Simulação criada com sucesso!');
    } catch (error) {
      console.error('Failed to create simulation:', error);
      const message = error instanceof Error ? error.message : 'Erro ao criar simulação';
      toast.error(message);
      throw error;
    }
  };

  const updateSimulation = async (id: number, simulationData: Partial<SimulationCreate>) => {
    try {
      const apiService = getApiService();
      const updatedSimulation = await apiService.updateSimulation(id, simulationData);
      setSimulations(prev =>
        prev.map(sim => sim.id === id ? updatedSimulation : sim)
      );
      toast.success('Simulação atualizada com sucesso!');
    } catch (error) {
      console.error('Failed to update simulation:', error);
      const message = error instanceof Error ? error.message : 'Erro ao atualizar simulação';
      toast.error(message);
      throw error;
    }
  };

  const deleteSimulation = async (id: number) => {
    try {
      const apiService = getApiService();
      await apiService.deleteSimulation(id);
      setSimulations(prev => prev.filter(sim => sim.id !== id));
      toast.success('Simulação removida com sucesso!');
    } catch (error) {
      console.error('Failed to delete simulation:', error);
      const message = error instanceof Error ? error.message : 'Erro ao remover simulação';
      toast.error(message);
      throw error;
    }
  };

  const toggleBetaFeatures = () => {
    const newState = !betaFeaturesEnabled;
    setBetaFeaturesEnabled(newState);
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem('betaFeatures', newState.toString());
      }
    } catch { }

    if (newState) {
      toast.success('Recursos Beta ativados!');
    } else {
      toast.success('Recursos Beta desativados!');
    }
  };

  const calculateCreditScore = () => {
    if (simulations.length === 0) {
      return {
        score: 0,
        level: 'baixo' as const,
        factors: {
          averageDownPayment: 0,
          contractStability: 0,
          simulationCount: 0,
          planningConsistency: 0,
        },
        recommendations: [
          'Crie sua primeira simulação para começar a avaliar seu perfil',
          'Explore diferentes cenários de financiamento',
          'Considere diferentes valores de entrada',
        ],
      };
    }

    // Calculate factors
    const avgDownPayment = simulations.reduce((sum, sim) => sum + sim.percentualEntrada, 0) / simulations.length;
    const avgContractYears = simulations.reduce((sum, sim) => sum + sim.anosContrato, 0) / simulations.length;

    // Factor 1: Average down payment (0-25 points)
    const downPaymentScore = Math.min(25, (avgDownPayment / 30) * 25);

    // Factor 2: Contract stability - prefer moderate contract lengths (0-25 points)
    const optimalYears = 20;
    const stabilityScore = Math.max(0, 25 - Math.abs(avgContractYears - optimalYears) * 2);

    // Factor 3: Number of simulations (0-25 points)
    const simulationScore = Math.min(25, simulations.length * 5);

    // Factor 4: Planning consistency - variance in down payment (0-25 points)
    const downPaymentVariance = simulations.reduce((sum, sim) =>
      sum + Math.pow(sim.percentualEntrada - avgDownPayment, 2), 0) / simulations.length;
    const consistencyScore = Math.max(0, 25 - downPaymentVariance);

    const totalScore = Math.round(downPaymentScore + stabilityScore + simulationScore + consistencyScore);

    // Determine level
    let level: 'baixo' | 'médio' | 'alto' | 'excelente';
    if (totalScore >= 80) level = 'excelente';
    else if (totalScore >= 60) level = 'alto';
    else if (totalScore >= 40) level = 'médio';
    else level = 'baixo';

    // Generate recommendations
    const recommendations: string[] = [];

    if (downPaymentScore < 15) {
      recommendations.push('Considere aumentar o percentual de entrada para melhorar as condições do financiamento');
    }
    if (simulationScore < 15) {
      recommendations.push('Crie mais simulações para explorar diferentes cenários');
    }
    if (stabilityScore < 15) {
      recommendations.push('Avalie prazos de financiamento entre 15-25 anos para melhor equilíbrio');
    }
    if (consistencyScore < 15) {
      recommendations.push('Mantenha consistência nos valores de entrada para demonstrar planejamento');
    }
    if (recommendations.length === 0) {
      recommendations.push('Excelente planejamento! Continue monitorando o mercado imobiliário');
    }

    return {
      score: totalScore,
      level,
      factors: {
        averageDownPayment: Math.round(downPaymentScore),
        contractStability: Math.round(stabilityScore),
        simulationCount: Math.round(simulationScore),
        planningConsistency: Math.round(consistencyScore),
      },
      recommendations,
    };
  };

  const value = {
    user,
    simulations,
    isLoading,
    betaFeaturesEnabled,
    login,
    register,
    logout,
    addSimulation,
    updateSimulation,
    deleteSimulation,
    loadSimulations,
    toggleBetaFeatures,
    calculateCreditScore,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}