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
    <header className="border-b border-slate-200 bg-white/95 shadow-[0_1px_3px_rgb(15_23_42/4%)]">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div>
          <Link
            href="/"
            className="text-lg font-bold tracking-tight text-slate-950 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
          >
            PrepForge
          </Link>
          <p className="mt-0.5 text-sm text-slate-500">Your focused interview preparation workspace</p>
        </div>
        <nav aria-label="Primary">
          <ul className="flex flex-wrap gap-1 sm:gap-2">
            {nav.filter((item) => item.href === "/" || user).map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="inline-flex min-h-10 items-center rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-blue-50 hover:text-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
                >
                  {item.label}
                </Link>
              </li>
            ))}
            {!loading && user ? <li><button type="button" onClick={onLogout} disabled={loggingOut} className="ui-button ui-button-secondary">{loggingOut ? <span className="loading-dots">Signing out</span> : "Log out"}</button></li> : null}
          </ul>
        </nav>
      </div>
    </header>
  );
}
