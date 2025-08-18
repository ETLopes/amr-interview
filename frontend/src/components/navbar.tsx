"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/context/auth-context";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const authed = !!user;
  return (
    <nav className="w-full border-b bg-white/50 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="mx-auto max-w-5xl flex items-center justify-between p-3">
        <Link href="/" className="font-semibold">aMORA</Link>
        <div className="flex items-center gap-4 text-sm">
          {authed ? (
            <>
              <Link href="/dashboard" className={pathname === "/dashboard" ? "underline" : ""}>Dashboard</Link>
              <Link href="/simulations" className={pathname?.startsWith("/simulations") ? "underline" : ""}>Simulations</Link>
              <Link href="/simulations/new" className={pathname === "/simulations/new" ? "underline" : ""}>New</Link>
              <Link href="/simulations/stats" className={pathname === "/simulations/stats" ? "underline" : ""}>Stats</Link>
              <Link href="/profile" className={pathname === "/profile" ? "underline" : ""}>Profile</Link>
              <button
                className="underline"
                onClick={() => {
                  logout();
                  router.push("/auth/login");
                }}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/auth/login">Login</Link>
              <Link href="/auth/register">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
