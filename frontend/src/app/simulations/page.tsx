"use client";

import Link from "next/link";
import { } from "react";
import RequireAuth from "@/components/require-auth";
import { useSimulationsList } from "@/hooks/simulations";

export default function SimulationsListPage() {
  const { data, isLoading, error } = useSimulationsList({ limit: 20 });

  return (
    <RequireAuth>
      <div className="mx-auto max-w-3xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Your Simulations</h1>
          <Link className="underline" href="/simulations/new">New Simulation</Link>
        </div>
        {error && (
          <p className="text-red-600">{error instanceof Error ? error.message : String(error)}</p>
        )}
        {isLoading ? (
          <p>Loading...</p>
        ) : !data || data.simulations.length === 0 ? (
          <p>No simulations yet.</p>
        ) : (
          <ul className="divide-y border rounded">
            {data.simulations.map((s) => (
              <li key={s.id} className="p-4">
                <Link className="underline" href={`/simulations/${s.id}`}>
                  Simulation #{s.id} — ${s.property_value.toLocaleString()}
                </Link>
                <div className="text-sm text-gray-600">
                  Down payment: {s.down_payment_percentage}% • Years: {s.contract_years}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </RequireAuth>
  );
}
