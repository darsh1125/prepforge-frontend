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
    if (!jd.trim()) { setError("Paste a job description to continue."); return; }
    try { const parsedUrl = new URL(companyUrl); if (!["http:", "https:"].includes(parsedUrl.protocol)) throw new Error(); } catch { setError("Enter a valid company website URL."); return; }
    if (!Number.isInteger(dayCount) || dayCount < 1 || dayCount > 60) { setError("Days until interview must be a whole number from 1 to 60."); return; }
    setSubmitting(true);
    try { const response = await createKit({ jd, company_url: companyUrl, days: dayCount }); router.push(`/kits/${response.kit.id}`); }
    catch (value) { setError(value instanceof ApiClientError ? value.message : "Could not create the kit."); }
    finally { setSubmitting(false); }
  }
  return <form onSubmit={submit} className="ui-panel space-y-6 p-6 sm:p-7"><div className="space-y-2"><label htmlFor="jd" className="block text-sm font-semibold">Job description</label><p className="text-xs text-slate-500">A short description is okay. Paste the role details you have.</p><textarea id="jd" name="jd" rows={12} value={jd} onChange={(event) => setJd(event.target.value)} className="ui-input min-h-56 resize-y text-sm" placeholder="Paste the role details here" required /><p className="text-right text-xs text-slate-500">{jd.length.toLocaleString()} characters</p></div><div className="space-y-2"><label htmlFor="company_url" className="block text-sm font-semibold">Company website</label><p className="text-xs text-slate-500">PrepForge uses the site for company context when it is available.</p><input id="company_url" name="company_url" type="url" value={companyUrl} onChange={(event) => setCompanyUrl(event.target.value)} className="ui-input" placeholder="https://company.com" required /></div><div className="space-y-2"><label htmlFor="days" className="block text-sm font-semibold">Days until interview</label><input id="days" name="days" type="number" min={1} max={60} value={days} onChange={(event) => setDays(event.target.value)} className="ui-input max-w-xs" required /><p className="text-xs text-slate-500">Choose between 1 and 60 days.</p></div>{error ? <p role="alert" className="rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-700">{error}</p> : null}<button type="submit" disabled={submitting} className="ui-button ui-button-primary">{submitting ? <span className="loading-dots">Creating your kit</span> : "Create interview kit"}</button></form>;
}
