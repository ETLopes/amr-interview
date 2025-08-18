"use client";

import Link from "next/link";
import { isAuthenticated, logout } from "@/lib/auth";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const router = useRouter();
  const authed = isAuthenticated();
  return (
    <nav className="w-full border-b bg-white/50 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="mx-auto max-w-5xl flex items-center justify-between p-3">
        <Link href="/" className="font-semibold">aMORA</Link>
        <div className="flex items-center gap-4 text-sm">
          {authed ? (
            <>
              <Link href="/dashboard">Dashboard</Link>
              <Link href="/simulations">Simulations</Link>
              <Link href="/simulations/new">New</Link>
              <Link href="/profile">Profile</Link>
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
