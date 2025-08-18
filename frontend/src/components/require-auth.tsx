"use client";

import { ReactNode, useEffect } from "react";
import { isAuthenticated } from "@/lib/auth";
import { useRouter } from "next/navigation";

export default function RequireAuth({ children }: { children: ReactNode }) {
  const router = useRouter();
  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/auth/login");
    }
  }, [router]);
  return <>{children}</>;
}
