"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { ApiClientError } from "@/lib/api/client";
import { createKit } from "@/lib/api/kits";

export function NewKitForm() {
  const router = useRouter();
  const [jd, setJd] = useState("");
  const [companyUrl, setCompanyUrl] = useState("");
  const [days, setDays] = useState("5");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setError(null); const dayCount = Number(days);
    if (!jd.trim() || !companyUrl.trim() || !Number.isInteger(dayCount) || dayCount < 1 || dayCount > 60) { setError("Add a job description, valid company URL, and 1 to 60 days."); return; }
    setSubmitting(true);
    try { const response = await createKit({ jd, company_url: companyUrl, days: dayCount }); router.push(`/kits/${response.kit.id}`); }
    catch (value) { setError(value instanceof ApiClientError ? value.message : "Could not create the kit."); }
    finally { setSubmitting(false); }
  }
  return <form onSubmit={submit} className="space-y-6 rounded-lg border border-slate-200 bg-white p-6 shadow-sm"><div className="space-y-2"><label htmlFor="jd" className="block text-sm font-medium">Job description</label><textarea id="jd" name="jd" rows={12} value={jd} onChange={(event) => setJd(event.target.value)} className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-slate-900" placeholder="Paste the job description" required /></div><div className="space-y-2"><label htmlFor="company_url" className="block text-sm font-medium">Company website</label><input id="company_url" name="company_url" type="url" value={companyUrl} onChange={(event) => setCompanyUrl(event.target.value)} className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-slate-900" placeholder="https://example.com" required /></div><div className="space-y-2"><label htmlFor="days" className="block text-sm font-medium">Days until interview</label><input id="days" name="days" type="number" min={1} max={60} value={days} onChange={(event) => setDays(event.target.value)} className="w-full max-w-xs rounded-md border border-slate-300 px-3 py-2 text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-slate-900" required /></div>{error ? <p role="alert" className="text-sm text-red-700">{error}</p> : null}<button type="submit" disabled={submitting} className="inline-flex min-h-10 items-center rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-60">{submitting ? "Creating..." : "Create Interview Kit"}</button></form>;
}
