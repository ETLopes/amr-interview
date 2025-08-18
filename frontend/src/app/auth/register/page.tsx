"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { register as registerApi } from "@/lib/auth";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const {
    register: f,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = async (values: FormValues) => {
    setError(null);
    try {
      await registerApi(values);
      router.push("/auth/login");
    } catch (e: unknown) {
      const err = e as { detail?: string; message?: string };
      setError(err?.detail || err?.message || "Registration failed");
    }
  };

  return (
    <div className="mx-auto max-w-md p-6">
      <h1 className="text-2xl font-semibold mb-4">Register</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm mb-1">Email</label>
          <input className="w-full border rounded px-3 py-2" type="email" {...f("email")} />
        </div>
        <div>
          <label className="block text-sm mb-1">Password</label>
          <input className="w-full border rounded px-3 py-2" type="password" {...f("password")} />
        </div>
        <div>
          <label className="block text-sm mb-1">Name (optional)</label>
          <input className="w-full border rounded px-3 py-2" type="text" {...f("name")} />
        </div>
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <button disabled={isSubmitting} className="bg-black text-white px-4 py-2 rounded">
          {isSubmitting ? "Creating..." : "Create account"}
        </button>
      </form>
      <p className="text-sm mt-3">
        Already have an account? <Link className="underline" href="/auth/login">Login</Link>
      </p>
    </div>
  );
}
