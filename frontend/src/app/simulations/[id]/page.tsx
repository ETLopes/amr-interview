"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import RequireAuth from "@/components/require-auth";
import { deleteSimulation } from "@/lib/simulations";
import { useSimulation } from "@/hooks/simulations";

export default function SimulationDetailPage() {
  const params = useParams<{ id: string }>();
  const id = Number(params.id);
  const router = useRouter();
  const { data, isLoading, error } = useSimulation(id);
  const [localError, setLocalError] = useState<string | null>(null);

  const onDelete = async () => {
    try {
      await deleteSimulation(id);
      router.push("/simulations");
    } catch (e: unknown) {
      const err = e as { detail?: string; message?: string };
      setLocalError(err?.detail || err?.message || "Delete failed");
    }
  };

  return (
    <RequireAuth>
      <div className="mx-auto max-w-2xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Simulation #{id}</h1>
          <div className="flex gap-3">
            <Link className="underline" href={`/simulations/${id}/edit`}>Edit</Link>
            <button
              onClick={() => {
                if (confirm("Delete this simulation?")) onDelete();
              }}
              className="text-red-600 underline"
            >
              Delete
            </button>
          </div>
        </div>
        {error && (
          <p className="text-red-600">{error instanceof Error ? error.message : String(error)}</p>
        )}
        {localError && <p className="text-red-600">{localError}</p>}
        {isLoading || !data ? (
          <p>Loading...</p>
        ) : (
          <pre className="text-sm whitespace-pre-wrap rounded border p-4">{JSON.stringify(data, null, 2)}</pre>
        )}
      </div>
    </RequireAuth>
  );
}
