"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ApiClientError } from "@/lib/api/client";
import { deleteKit, extractKit, getKit, researchInterview } from "@/lib/api/kits";
import type { KitRecord } from "@/types/api";
import { RequireAuth } from "@/features/auth/RequireAuth";

function DetailContent() {
  const { id } = useParams<{ id: string }>();
  const [kit, setKit] = useState<KitRecord | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState<"extract" | "research" | "delete" | null>(null);

  useEffect(() => {
    getKit(id).then((response) => setKit(response.kit)).catch((value) => setError(value instanceof ApiClientError ? value.message : "Could not load this kit."));
  }, [id]);

  if (error) return <div className="space-y-4"><p role="alert" className="text-red-700">{error}</p><Link href="/dashboard" className="underline">Back to dashboard</Link></div>;
  if (!kit) return <p className="text-sm text-slate-600">Loading kit...</p>;

  const kitId = kit.id;
  async function remove() { setBusy("delete"); try { await deleteKit(kitId); window.location.href = "/dashboard"; } finally { setBusy(null); } }
  async function analyze() { setBusy("extract"); setError(null); try { const response = await extractKit(kitId); setKit((current) => current ? { ...current, extraction: response.extraction, status: "extracting_requirements" } : current); } catch (value) { setError(value instanceof ApiClientError ? value.message : "Could not analyze this job description."); } finally { setBusy(null); } }
  async function research() { setBusy("research"); setError(null); try { const response = await researchInterview(kitId); setKit((current) => current ? { ...current, research: { ...(current.research ?? {}), interview: response.research } } : current); } catch (value) { setError(value instanceof ApiClientError ? value.message : "Could not run interview research."); } finally { setBusy(null); } }

  const role = kit.extraction?.role;
  const interview = kit.research?.interview;
  return <div className="space-y-8">
    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between"><div><Link href="/dashboard" className="text-sm text-slate-600 underline">Back to dashboard</Link><h1 className="mt-3 text-3xl font-semibold">Interview kit</h1></div><button type="button" onClick={remove} disabled={busy !== null} className="rounded-md border border-red-300 px-3 py-2 text-sm text-red-700 disabled:opacity-60">{busy === "delete" ? "Deleting..." : "Delete kit"}</button></div>
    <div className="grid gap-4 sm:grid-cols-3"><div className="rounded-lg border border-slate-200 bg-white p-4"><p className="text-xs uppercase tracking-wide text-slate-500">Status</p><p className="mt-2 font-medium capitalize">{kit.status}</p></div><div className="rounded-lg border border-slate-200 bg-white p-4"><p className="text-xs uppercase tracking-wide text-slate-500">Company</p><p className="mt-2 break-all font-medium">{kit.input.company_url}</p></div><div className="rounded-lg border border-slate-200 bg-white p-4"><p className="text-xs uppercase tracking-wide text-slate-500">Days available</p><p className="mt-2 font-medium">{kit.input.days}</p></div></div>
    <section className="rounded-lg border border-slate-200 bg-white p-6"><h2 className="text-lg font-semibold">Job description</h2><p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-slate-700">{kit.input.jd}</p></section>
    <section className="rounded-lg border border-slate-200 bg-white p-6"><div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between"><div><h2 className="text-lg font-semibold">Role analysis</h2><p className="mt-1 text-sm text-slate-600">Requirements come from the pasted job description only.</p></div><button type="button" onClick={analyze} disabled={busy !== null} className="rounded-md bg-slate-900 px-3 py-2 text-sm font-medium text-white disabled:opacity-60">{busy === "extract" ? "Analyzing..." : "Analyze job description"}</button></div>{role ? <div className="mt-5 space-y-5"><div className="grid gap-4 sm:grid-cols-3"><div><p className="text-xs uppercase tracking-wide text-slate-500">Title</p><p className="mt-1 font-medium">{role.title || "Not specified"}</p></div><div><p className="text-xs uppercase tracking-wide text-slate-500">Seniority</p><p className="mt-1 font-medium">{role.seniority || "Not specified"}</p></div><div><p className="text-xs uppercase tracking-wide text-slate-500">Location</p><p className="mt-1 font-medium">{role.location || "Not specified"}</p></div></div>{role.responsibilities.length ? <div><h3 className="font-medium">Responsibilities</h3><ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700">{role.responsibilities.map((item) => <li key={item}>{item}</li>)}</ul></div> : null}<div><h3 className="font-medium">Requirements</h3>{role.requirements.length ? <ul className="mt-2 space-y-2">{role.requirements.map((requirement) => <li key={requirement.id} className="flex flex-wrap items-center gap-2 text-sm"><span className="font-mono text-xs text-slate-500">{requirement.id}</span><span>{requirement.text}</span><span className="rounded-full bg-slate-100 px-2 py-1 text-xs capitalize">{requirement.kind}</span><span className="rounded-full bg-slate-100 px-2 py-1 text-xs">{requirement.priority}</span></li>)}</ul> : <p className="mt-2 text-sm text-slate-600">No explicit requirements were found. The prep kit will stay focused on the information provided.</p>}</div>{kit.extraction?.warnings.length ? <div className="space-y-1 text-sm text-amber-800">{kit.extraction.warnings.map((warning) => <p key={warning.code}>{warning.message}</p>)}</div> : null}</div> : <p className="mt-5 text-sm text-slate-600">No role analysis has been run for this kit yet.</p>}</section>
    <section className="rounded-lg border border-slate-200 bg-white p-6"><div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between"><div><h2 className="text-lg font-semibold">Public interview research</h2><p className="mt-1 text-sm text-slate-600">Public evidence is not treated as company policy.</p></div><button type="button" onClick={research} disabled={busy !== null} className="rounded-md bg-slate-900 px-3 py-2 text-sm font-medium text-white disabled:opacity-60">{busy === "research" ? "Researching..." : "Research interviews"}</button></div>{interview ? <div className="mt-5 space-y-4"><p className="text-sm text-slate-700">{interview.metadata.sourceCount} source{interview.metadata.sourceCount === 1 ? "" : "s"} found.</p>{interview.sources.length ? <ul className="space-y-2">{interview.sources.map((source) => <li key={source.sourceId}><a href={source.url} target="_blank" rel="noopener noreferrer" className="font-medium text-slate-900 underline">{source.title}</a><span className="ml-2 text-xs text-slate-500">{source.domain} · {source.authority}</span></li>)}</ul> : <p className="text-sm text-slate-600">No public interview discussion was found. PrepForge can still build a kit from the job description and company website.</p>}{interview.warnings.length ? <div className="space-y-1 text-sm text-amber-800">{interview.warnings.map((warning) => <p key={`${warning.code}-${warning.url ?? ""}`}>{warning.message}</p>)}</div> : null}</div> : <p className="mt-5 text-sm text-slate-600">No public interview research has been run for this kit yet.</p>}</section>
    <section className="border-l-4 border-slate-300 pl-4"><h2 className="font-semibold">Generation not started</h2><p className="mt-1 text-sm text-slate-600">AI question generation will be added in a later phase.</p></section>
  </div>;
}

export default function KitDetailPage() { return <RequireAuth><DetailContent /></RequireAuth>; }
