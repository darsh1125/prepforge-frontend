"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ApiClientError } from "@/lib/api/client";
import { listKits } from "@/lib/api/kits";
import type { KitRecord } from "@/types/api";
import { RequireAuth } from "@/features/auth/RequireAuth";
import { humanStatus } from "@/lib/uiCopy";

function DashboardContent() {
  const [kits, setKits] = useState<KitRecord[]>([]); const [loading, setLoading] = useState(true); const [error, setError] = useState<string | null>(null);
  const load = () => { setLoading(true); setError(null); listKits().then((response) => setKits(response.kits)).catch((value) => setError(value instanceof ApiClientError ? value.message : "Could not load your kits.")).finally(() => setLoading(false)); };
  useEffect(() => { queueMicrotask(load); }, []);
  return <div className="space-y-8"><div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-sm font-semibold uppercase tracking-[0.14em] text-blue-600">Your workspace</p><h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">Interview kits</h1><p className="mt-2 max-w-xl text-sm text-slate-600">Build, review, and practice from one focused prep workspace.</p></div><Link href="/kits/new" className="ui-button ui-button-primary">Create kit</Link></div>
    {loading ? <div className="ui-panel p-6 text-sm text-slate-600" role="status"><span className="loading-dots">Loading your kits</span></div> : error ? <div className="space-y-3 rounded-xl border border-red-200 bg-red-50 p-6"><p role="alert" className="text-sm text-red-800">{error}</p><button type="button" onClick={load} className="ui-button ui-button-secondary">Try again</button></div> : kits.length === 0 ? <div className="ui-panel border-dashed p-8"><h2 className="text-lg font-semibold">No prep kits yet</h2><p className="mt-2 max-w-lg text-sm text-slate-600">Start with a job description and company website. PrepForge will organize the role, questions, coverage, flashcards, and schedule.</p><Link href="/kits/new" className="ui-button ui-button-primary mt-5">Create your first prep kit</Link></div> : <div className="grid gap-4 sm:grid-cols-2">{kits.map((kit) => { let company = kit.input.company_url; try { company = new URL(kit.input.company_url).hostname; } catch { /* keep the submitted value */ } return <Link key={kit.id} href={`/kits/${kit.id}`} className="ui-panel p-5 hover:border-blue-300 hover:shadow-md"><div className="flex items-start justify-between gap-4"><div><h2 className="font-semibold text-slate-950">{company}</h2><p className="mt-1 text-sm text-slate-600">{kit.extraction?.role.title ?? kit.kit?.role.title ?? "Role analysis pending"}</p></div><span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700">{humanStatus(kit.status)}</span></div><p className="mt-4 text-sm text-slate-600">Interview in {kit.input.days} day{kit.input.days === 1 ? "" : "s"}</p><p className="mt-2 text-xs text-slate-500">Updated {new Date(kit.updatedAt).toLocaleDateString()}</p></Link>; })}</div>}
  </div>;
}

export default function DashboardPage() { return <RequireAuth><DashboardContent /></RequireAuth>; }
