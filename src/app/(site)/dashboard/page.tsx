"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ApiClientError } from "@/lib/api/client";
import { listKits } from "@/lib/api/kits";
import type { KitRecord } from "@/types/api";
import { RequireAuth } from "@/features/auth/RequireAuth";

function DashboardContent() {
  const [kits, setKits] = useState<KitRecord[]>([]); const [loading, setLoading] = useState(true); const [error, setError] = useState<string | null>(null);
  const load = () => { setLoading(true); setError(null); listKits().then((response) => setKits(response.kits)).catch((value) => setError(value instanceof ApiClientError ? value.message : "Could not load your kits.")).finally(() => setLoading(false)); };
  useEffect(load, []);
  return <div className="space-y-8"><div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-sm font-medium text-slate-500">Your workspace</p><h1 className="mt-1 text-3xl font-semibold">Interview kits</h1></div><Link href="/kits/new" className="inline-flex min-h-10 items-center justify-center rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800">Create Kit</Link></div>
    {loading ? <p className="text-sm text-slate-600">Loading your kits...</p> : error ? <div className="space-y-3"><p role="alert" className="text-sm text-red-700">{error}</p><button type="button" onClick={load} className="rounded-md border border-slate-300 px-3 py-2 text-sm">Retry</button></div> : kits.length === 0 ? <div className="rounded-lg border border-dashed border-slate-300 bg-white p-8"><h2 className="text-lg font-semibold">No interview prep kits yet</h2><p className="mt-2 max-w-lg text-sm text-slate-600">Create your first kit with a job description, company website, and interview date.</p><Link href="/kits/new" className="mt-5 inline-flex min-h-10 items-center rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white">Create Kit</Link></div> : <div className="grid gap-4 sm:grid-cols-2">{kits.map((kit) => <Link key={kit.id} href={`/kits/${kit.id}`} className="rounded-lg border border-slate-200 bg-white p-5 hover:border-slate-400"><div className="flex items-start justify-between gap-4"><h2 className="font-semibold">{new URL(kit.input.company_url).hostname}</h2><span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-medium capitalize">{kit.status}</span></div><p className="mt-3 text-sm text-slate-600">Interview in {kit.input.days} day{kit.input.days === 1 ? "" : "s"}</p><p className="mt-2 text-xs text-slate-500">Updated {new Date(kit.updatedAt).toLocaleDateString()}</p></Link>)}</div>}
  </div>;
}

export default function DashboardPage() { return <RequireAuth><DashboardContent /></RequireAuth>; }
