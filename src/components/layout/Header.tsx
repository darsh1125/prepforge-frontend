"use client";

import Link from "next/link";
import { useAuth } from "@/features/auth/AuthProvider";
import { useRouter } from "next/navigation";
import { useState } from "react";

const nav = [
  { href: "/", label: "Home" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/kits/new", label: "New kit" },
];

export function Header() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);
  async function onLogout() { setLoggingOut(true); try { await logout(); router.replace("/login"); } finally { setLoggingOut(false); } }
  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-5xl flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Link
            href="/"
            className="text-lg font-semibold text-slate-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
          >
            PrepForge
          </Link>
          <p className="text-sm text-slate-600">AI-powered interview preparation</p>
        </div>
        <nav aria-label="Primary">
          <ul className="flex flex-wrap gap-2">
            {nav.filter((item) => item.href === "/" || user).map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="inline-flex min-h-10 items-center rounded-md px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
                >
                  {item.label}
                </Link>
              </li>
            ))}
            {!loading && user ? <li><button type="button" onClick={onLogout} disabled={loggingOut} className="inline-flex min-h-10 items-center rounded-md border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 disabled:opacity-60">{loggingOut ? "Signing out..." : "Logout"}</button></li> : null}
          </ul>
        </nav>
      </div>
    </header>
  );
}
