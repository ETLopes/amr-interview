export const qk = {
  me: ["me"] as const,
  simulationsList: (params?: { skip?: number; limit?: number }) =>
    ["simulations", "list", params?.skip ?? 0, params?.limit ?? 20] as const,
  simulation: (id: number) => ["simulation", id] as const,
  stats: ["simulations", "stats"] as const,
};
