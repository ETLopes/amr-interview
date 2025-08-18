"use client";

import { useMemo } from "react";

export default function CreditScoreCard() {
  const score = useMemo(() => {
    // Mocked score for beta
    return 742;
  }, []);
  const band = score >= 750 ? "Excellent" : score >= 700 ? "Good" : score >= 650 ? "Fair" : "Needs improvement";

  return (
    <div className="rounded border p-4 space-y-2">
      <div className="text-xs uppercase tracking-wide text-gray-500">Beta</div>
      <h3 className="text-lg font-medium">Credit Score (Mock)</h3>
      <div className="text-3xl font-semibold">{score}</div>
      <div className="text-sm text-gray-600">{band}</div>
      <p className="text-xs text-gray-500">This is a mocked preview for beta evaluation only.</p>
    </div>
  );
}
