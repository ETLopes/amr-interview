"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import RequireAuth from "@/components/require-auth";
import { updateSimulation, type Simulation, type SimulationInput } from "@/lib/simulations";
import { useSimulation, useUpdateSimulation } from "@/hooks/simulations";

export default function EditSimulationPage() {
  const params = useParams<{ id: string }>();
  const id = Number(params.id);
  const router = useRouter();
  const { data, isLoading, error } = useSimulation(id);
  const [localError, setLocalError] = useState<string | null>(null);
  const mutation = useUpdateSimulation(id);

  const onSubmit = async (formData: FormData) => {
    try {
      const payload: Partial<SimulationInput> = {
        property_value: formData.get("property_value") ? Number(formData.get("property_value")) : undefined,
        down_payment_percentage: formData.get("down_payment_percentage") ? Number(formData.get("down_payment_percentage")) : undefined,
        contract_years: formData.get("contract_years") ? Number(formData.get("contract_years")) : undefined,
        property_address: (formData.get("property_address") as string) || undefined,
        property_type: (formData.get("property_type") as string) || undefined,
        notes: (formData.get("notes") as string) || undefined,
      };
      const updated = await mutation.mutateAsync(payload);
      router.push(`/simulations/${updated.id}`);
    } catch (e: unknown) {
      const err = e as { detail?: string; message?: string };
      setLocalError(err?.detail || err?.message || "Update failed");
    }
  };

  if (isLoading || !data) return <div className="mx-auto max-w-xl p-6">Loading...</div>;

  return (
    <RequireAuth>
      <div className="mx-auto max-w-xl p-6 space-y-4">
        <h1 className="text-2xl font-semibold">Edit Simulation #{id}</h1>
        {error && (
          <p className="text-red-600">{error instanceof Error ? error.message : String(error)}</p>
        )}
        {localError && <p className="text-red-600">{localError}</p>}
        <form action={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm mb-1">Property value</label>
            <input name="property_value" type="number" step="0.01" defaultValue={data.property_value} className="w-full border rounded px-3 py-2" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-1">Down payment %</label>
              <input name="down_payment_percentage" type="number" step="0.01" defaultValue={data.down_payment_percentage} className="w-full border rounded px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm mb-1">Years</label>
              <input name="contract_years" type="number" defaultValue={data.contract_years} className="w-full border rounded px-3 py-2" />
            </div>
          </div>
          <div>
            <label className="block text-sm mb-1">Address</label>
            <input name="property_address" defaultValue={data.property_address || ""} className="w-full border rounded px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm mb-1">Type</label>
            <input name="property_type" defaultValue={data.property_type || ""} className="w-full border rounded px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm mb-1">Notes</label>
            <textarea name="notes" defaultValue={data.notes || ""} className="w-full border rounded px-3 py-2" />
          </div>
          <button className="bg-black text-white px-4 py-2 rounded">Save changes</button>
        </form>
      </div>
    </RequireAuth>
  );
}
