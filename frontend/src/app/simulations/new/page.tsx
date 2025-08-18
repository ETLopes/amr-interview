"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { calculate, type SimulationInput } from "@/lib/simulations";
import { useCreateSimulation } from "@/hooks/simulations";
import { useState } from "react";
import { useRouter } from "next/navigation";
import RequireAuth from "@/components/require-auth";
import { toast } from "react-hot-toast";

const schema = z.object({
  property_value: z.coerce.number().positive(),
  down_payment_percentage: z.coerce.number().min(0).max(100),
  contract_years: z.coerce.number().min(1).max(30),
  property_address: z.string().optional(),
  property_type: z.string().optional(),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

export default function NewSimulationPage() {
  const router = useRouter();
  const [calc, setCalc] = useState<{ down_payment_amount: number; financing_amount: number; total_to_save: number; monthly_savings: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    watch,
    formState: { isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { contract_years: 30, down_payment_percentage: 20 },
  });

  const values = watch();
  const createMutation = useCreateSimulation();

  const onCalculate = async () => {
    setError(null);
    try {
      const payload: SimulationInput = {
        ...values,
        property_value: Number(values.property_value),
        down_payment_percentage: Number(values.down_payment_percentage),
        contract_years: Number(values.contract_years),
      } as unknown as SimulationInput;
      const res = await calculate(payload);
      setCalc(res.calculated_values);
      toast.success("Calculated");
    } catch (e: unknown) {
      const err = e as { detail?: string; message?: string };
      setError(err?.detail || err?.message || "Calculation failed");
      toast.error("Calculation failed");
    }
  };

  const onSubmit = async (vals: FormValues) => {
    setError(null);
    try {
      const payload: SimulationInput = {
        ...vals,
        property_value: Number(vals.property_value),
        down_payment_percentage: Number(vals.down_payment_percentage),
        contract_years: Number(vals.contract_years),
      } as unknown as SimulationInput;
      const s = await createMutation.mutateAsync(payload);
      toast.success("Simulation created");
      router.push(`/simulations/${s.id}`);
    } catch (e: unknown) {
      const err = e as { detail?: string; message?: string };
      setError(err?.detail || err?.message || "Create failed");
      toast.error("Create failed");
    }
  };

  return (
    <RequireAuth>
      <div className="mx-auto max-w-xl p-6 space-y-4">
        <h1 className="text-2xl font-semibold">New Simulation</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm mb-1">Property value</label>
            <input type="number" step="0.01" className="w-full border rounded px-3 py-2" {...register("property_value", { valueAsNumber: true })} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-1">Down payment %</label>
              <input type="number" step="0.01" className="w-full border rounded px-3 py-2" {...register("down_payment_percentage", { valueAsNumber: true })} />
            </div>
            <div>
              <label className="block text-sm mb-1">Years</label>
              <input type="number" className="w-full border rounded px-3 py-2" {...register("contract_years", { valueAsNumber: true })} />
            </div>
          </div>
          <div>
            <label className="block text-sm mb-1">Address</label>
            <input className="w-full border rounded px-3 py-2" {...register("property_address")} />
          </div>
          <div>
            <label className="block text-sm mb-1">Type</label>
            <input className="w-full border rounded px-3 py-2" {...register("property_type")} />
          </div>
          <div>
            <label className="block text-sm mb-1">Notes</label>
            <textarea className="w-full border rounded px-3 py-2" {...register("notes")} />
          </div>
          {error && <p className="text-red-600 text-sm">{error}</p>}
          <div className="flex gap-3">
            <button type="button" onClick={onCalculate} className="bg-gray-200 px-4 py-2 rounded">Preview</button>
            <button disabled={isSubmitting} className="bg-black text-white px-4 py-2 rounded">Save</button>
          </div>
        </form>

        {calc && (
          <div className="rounded border p-4">
            <h2 className="font-medium mb-2">Calculated values</h2>
            <ul className="text-sm space-y-1">
              <li>Down payment amount: ${calc.down_payment_amount.toLocaleString()}</li>
              <li>Financing amount: ${calc.financing_amount.toLocaleString()}</li>
              <li>Total to save: ${calc.total_to_save.toLocaleString()}</li>
              <li>Monthly savings: ${calc.monthly_savings.toLocaleString()}</li>
            </ul>
          </div>
        )}
      </div>
    </RequireAuth>
  );
}
