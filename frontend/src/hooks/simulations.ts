"use client";

import { useMutation, useQuery, useQueryClient, UseQueryResult } from "@tanstack/react-query";
import {
  listSimulations,
  getSimulation,
  createSimulation,
  updateSimulation,
  deleteSimulation,
  getStatistics,
  type Simulation,
  type SimulationInput,
  type SimulationsList,
} from "@/lib/simulations";
import { qk } from "@/lib/queryKeys";

export function useSimulationsList(params?: { skip?: number; limit?: number }): UseQueryResult<SimulationsList> {
  return useQuery({ queryKey: qk.simulationsList(params), queryFn: () => listSimulations(params) });
}

export function useSimulation(id: number): UseQueryResult<Simulation> {
  return useQuery({ queryKey: qk.simulation(id), queryFn: () => getSimulation(id) });
}

export function useStats() {
  return useQuery({ queryKey: qk.stats, queryFn: getStatistics, staleTime: 30_000 });
}

export function useCreateSimulation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: SimulationInput) => createSimulation(input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["simulations"] });
      qc.invalidateQueries({ queryKey: qk.stats });
    },
  });
}

export function useUpdateSimulation(id: number) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: Partial<SimulationInput>) => updateSimulation(id, input),
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: qk.simulation(id) });
      qc.invalidateQueries({ queryKey: ["simulations"] });
      qc.invalidateQueries({ queryKey: qk.stats });
      return data;
    },
  });
}

export function useDeleteSimulation(id: number) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => deleteSimulation(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["simulations"] });
      qc.invalidateQueries({ queryKey: qk.stats });
    },
  });
}
