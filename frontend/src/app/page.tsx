"use client";

import Link from "next/link";
import { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { calculate, type SimulationInput } from "@/lib/simulations";
import { isAuthenticated } from "@/lib/auth";

const quickSchema = z.object({
  property_value: z.coerce.number().positive(),
  down_payment_percentage: z.coerce.number().min(0).max(100),
  contract_years: z.coerce.number().min(1).max(30),
});

type QuickValues = z.infer<typeof quickSchema>;

export default function Home() {
  const authed = isAuthenticated();
  const [result, setResult] = useState<{
    down_payment_amount: number;
    financing_amount: number;
    total_to_save: number;
    monthly_savings: number;
  } | null>(null);

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm({
    resolver: zodResolver(quickSchema),
    defaultValues: { contract_years: 30, down_payment_percentage: 20 },
  });

  async function onQuickSubmit(values: QuickValues) {
    setResult(null);
    const res = await calculate(values as SimulationInput);
    setResult(res.calculated_values);
  }

  return (
    <div className="mx-auto max-w-5xl p-6 sm:p-10 space-y-10">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold">aMORA Real Estate Simulator</h1>
        <p className="text-gray-600">Plan your property purchase with clarity: estimate down payment, financing, and monthly savings.</p>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded border p-5 space-y-3">
          <h2 className="text-xl font-medium">Get Started</h2>
          {authed ? (
            <div className="flex flex-wrap gap-2">
              <Link href="/dashboard" className="px-4 py-2 rounded bg-black text-white">Dashboard</Link>
              <Link href="/simulations/new" className="px-4 py-2 rounded border">New Simulation</Link>
              <Link href="/simulations" className="px-4 py-2 rounded border">Your Simulations</Link>
              <Link href="/simulations/stats" className="px-4 py-2 rounded border">Statistics</Link>
              <Link href="/profile" className="px-4 py-2 rounded border">Profile</Link>
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              <Link href="/auth/login" className="px-4 py-2 rounded bg-black text-white">Login</Link>
              <Link href="/auth/register" className="px-4 py-2 rounded border">Create Account</Link>
            </div>
          )}
          <p className="text-sm text-gray-600">You can also try a quick calculation without signing in.</p>
        </div>

        <div className="rounded border p-5 space-y-3">
          <h2 className="text-xl font-medium">Quick Calculation</h2>
          <form onSubmit={handleSubmit(onQuickSubmit)} className="space-y-3">
            <div>
              <label className="block text-sm mb-1">Property value</label>
              <input type="number" step="0.01" className="w-full border rounded px-3 py-2" {...register("property_value")} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm mb-1">Down payment %</label>
                <input type="number" step="0.01" className="w-full border rounded px-3 py-2" {...register("down_payment_percentage")} />
              </div>
              <div>
                <label className="block text-sm mb-1">Years</label>
                <input type="number" className="w-full border rounded px-3 py-2" {...register("contract_years")} />
              </div>
            </div>
            <button disabled={isSubmitting} className="px-4 py-2 rounded bg-black text-white">
              {isSubmitting ? "Calculating..." : "Calculate"}
            </button>
          </form>
          {result && (
            <ul className="text-sm space-y-1 rounded border p-3">
              <li>Down payment amount: ${result.down_payment_amount.toLocaleString()}</li>
              <li>Financing amount: ${result.financing_amount.toLocaleString()}</li>
              <li>Total to save: ${result.total_to_save.toLocaleString()}</li>
              <li>Monthly savings: ${result.monthly_savings.toLocaleString()}</li>
            </ul>
          )}
        </div>
      </section>
    </div>
  );
}
