"use client";

import { useStats } from "@/hooks/simulations";
import RequireAuth from "@/components/require-auth";

export default function SimulationStatsPage() {
  const { data, isLoading, error } = useStats();

  return (
    <RequireAuth>
      <div className="mx-auto max-w-xl p-6 space-y-3">
        <h1 className="text-2xl font-semibold">Simulation Statistics</h1>
        {error && (
          <p className="text-red-600">{error instanceof Error ? error.message : String(error)}</p>
        )}
        {isLoading || !data ? (
          <p>Loading...</p>
        ) : (
          <ul className="rounded border p-4 text-sm space-y-1">
            <li>Total simulations: {data.total_simulations}</li>
            <li>Total property value: ${data.total_property_value.toLocaleString()}</li>
            <li>Average down payment %: {data.average_down_payment_percentage}%</li>
            <li>Average contract years: {data.average_contract_years}</li>
          </ul>
        )}
      </div>
    </RequireAuth>
  );
}
