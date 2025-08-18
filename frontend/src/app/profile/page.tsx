"use client";

import { useEffect, useState } from "react";
import { me, type CurrentUser } from "@/lib/auth";
import { apiFetch } from "@/lib/api";
import RequireAuth from "@/components/require-auth";

export default function ProfilePage() {
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [name, setName] = useState("");
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    me().then((u) => {
      setUser(u);
      setName(u.name || "");
    });
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    try {
      const updated = await apiFetch<CurrentUser>("/users/me", {
        method: "PATCH",
        body: JSON.stringify({ name }),
      });
      setUser(updated);
      setMsg("Profile updated");
    } catch (e: unknown) {
      const err = e as { detail?: string; message?: string };
      setMsg(err?.detail || err?.message || "Update failed");
    }
  }

  return (
    <RequireAuth>
      <div className="mx-auto max-w-md p-6 space-y-4">
        <h1 className="text-2xl font-semibold">Profile</h1>
        {!user ? (
          <p>Loading...</p>
        ) : (
          <form onSubmit={onSubmit} className="space-y-3">
            <div>
              <label className="block text-sm mb-1">Email</label>
              <input value={user.email} disabled className="w-full border rounded px-3 py-2 bg-gray-100" />
            </div>
            <div>
              <label className="block text-sm mb-1">Name</label>
              <input value={name} onChange={(e) => setName(e.target.value)} className="w-full border rounded px-3 py-2" />
            </div>
            {user && (
              <button className="bg-black text-white px-4 py-2 rounded">Save</button>
            )}
            {msg && <p className="text-sm">{msg}</p>}
          </form>
        )}
      </div>
    </RequireAuth>
  );
}
