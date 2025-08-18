"use client";

import { useEffect, useState } from "react";
import { me, CurrentUser } from "@/lib/auth";
import RequireAuth from "@/components/require-auth";
import CreditScoreCard from "@/components/CreditScoreCard";
import PropertyImporter from "@/components/PropertyImporter";
import Link from "next/link";

export default function DashboardPage() {
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    me()
      .then(setUser)
      .catch((e: unknown) => {
        const err = e as { detail?: string; message?: string };
        setError(err?.detail || err?.message || "Not authenticated");
      });
  }, []);

  if (error) {
    return (
      <div className="mx-auto max-w-md p-6">
        <p className="text-red-600">{error}</p>
        <p className="mt-2">
          Please <Link className="underline" href="/auth/login">login</Link>.
        </p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="mx-auto max-w-md p-6">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <RequireAuth>
      <div className="mx-auto max-w-5xl p-6 space-y-6">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <CreditScoreCard />
          <PropertyImporter />
        </div>
        <div className="rounded border p-4">
          <h2 className="font-medium">Current user</h2>
          <pre className="text-sm whitespace-pre-wrap">{JSON.stringify(user, null, 2)}</pre>
        </div>
      </div>
    </RequireAuth>
  );
}
