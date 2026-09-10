"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ApiClientError } from "@/lib/api/client";
import { deleteKit, getKit } from "@/lib/api/kits";
import type { KitRecord } from "@/types/api";
import { RequireAuth } from "@/features/auth/RequireAuth";

function DetailContent() {
  const { id } = useParams<{ id: string }>();
  const [kit, setKit] = useState<KitRecord | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  useEffect(() => { getKit(id).then((response) => setKit(response.kit)).catch((value) => setError(value instanceof ApiClientError ? value.message : "Could not load this kit.")); }, [id]);
  if (error) return <div className="space-y-4"><p role="alert" className="text-red-700">{error}</p><Link href="/dashboard" className="underline">Back to dashboard</Link></div>;
  if (!kit) return <p className="text-sm text-slate-600">Loading kit...</p>;
  async function remove() { setDeleting(true); try { await deleteKit(kit!.id); window.location.href = "/dashboard"; } finally { setDeleting(false); } }
  return <div className="space-y-8"><div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between"><div><Link href="/dashboard" className="text-sm text-slate-600 underline">Back to dashboard</Link><h1 className="mt-3 text-3xl font-semibold">Interview kit</h1></div><button type="button" onClick={remove} disabled={deleting} className="rounded-md border border-red-300 px-3 py-2 text-sm text-red-700 disabled:opacity-60">{deleting ? "Deleting..." : "Delete kit"}</button></div><div className="grid gap-4 sm:grid-cols-3"><div className="rounded-lg border border-slate-200 bg-white p-4"><p className="text-xs uppercase tracking-wide text-slate-500">Status</p><p className="mt-2 font-medium capitalize">{kit.status}</p></div><div className="rounded-lg border border-slate-200 bg-white p-4"><p className="text-xs uppercase tracking-wide text-slate-500">Company</p><p className="mt-2 break-all font-medium">{kit.input.company_url}</p></div><div className="rounded-lg border border-slate-200 bg-white p-4"><p className="text-xs uppercase tracking-wide text-slate-500">Days available</p><p className="mt-2 font-medium">{kit.input.days}</p></div></div><section className="rounded-lg border border-slate-200 bg-white p-6"><h2 className="text-lg font-semibold">Job description</h2><p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-slate-700">{kit.input.jd}</p></section><section className="border-l-4 border-slate-300 pl-4"><h2 className="font-semibold">Generation not started</h2><p className="mt-1 text-sm text-slate-600">Your inputs are saved. AI generation will be added in a later phase.</p></section></div>;
}

export default function KitDetailPage() { return <RequireAuth><DetailContent /></RequireAuth>; }
