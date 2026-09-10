"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { ApiClientError } from "@/lib/api/client";
import { getKit, getPracticeSession, updatePracticeConfidence } from "@/lib/api/kits";
import type { KitRecord, PracticeCard, PracticeSession } from "@/types/api";

const confidenceLabels = { 1: "Needs work", 2: "Getting there", 3: "Confident" } as const;

export default function PracticePage() {
  const { id } = useParams<{ id: string }>();
  const [kit, setKit] = useState<KitRecord | null>(null);
  const [session, setSession] = useState<PracticeSession | null>(null);
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => { Promise.all([getKit(id), getPracticeSession(id)]).then(([kitResponse, practiceResponse]) => { setKit(kitResponse.kit); setSession(practiceResponse); }).catch((value) => setError(value instanceof ApiClientError ? value.message : "Could not load practice mode.")); }, [id]);
  const card: PracticeCard | undefined = session?.cards[index];
  const requirements = kit?.extraction?.role.requirements ?? kit?.kit?.role.requirements ?? [];

  const rate = useCallback(async (confidence: 1 | 2 | 3) => {
    if (!card || busy) return; setBusy(true); setError(null);
    try {
      const response = await updatePracticeConfidence(id, card.internalId, confidence);
      const updated = { ...card, ...response.practice };
      setSession((current) => current ? { ...current, cards: current.cards.map((item, itemIndex) => itemIndex === index ? updated : item), stats: { ...current.stats, practiced: current.stats.practiced + (card.confidence === null ? 1 : 0), unpracticed: Math.max(0, current.stats.unpracticed - (card.confidence === null ? 1 : 0)), lowConfidence: current.stats.lowConfidence + (confidence === 1 ? 1 : 0) - (card.confidence === 1 ? 1 : 0), mediumConfidence: current.stats.mediumConfidence + (confidence === 2 ? 1 : 0) - (card.confidence === 2 ? 1 : 0), highConfidence: current.stats.highConfidence + (confidence === 3 ? 1 : 0) - (card.confidence === 3 ? 1 : 0) } } : current);
      setRevealed(false); setIndex((current) => current + 1);
    } catch (value) { setError(value instanceof ApiClientError ? value.message : "Could not save confidence. Try again."); }
    finally { setBusy(false); }
  }, [busy, card, id, index]);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      const target = event.target as HTMLElement;
      if (["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName)) return;
      if ((event.key === " " || event.key === "Enter") && card && !revealed) { event.preventDefault(); setRevealed(true); }
      if (revealed && card && ["1", "2", "3"].includes(event.key)) { void rate(Number(event.key) as 1 | 2 | 3); }
    }
    window.addEventListener("keydown", onKeyDown); return () => window.removeEventListener("keydown", onKeyDown);
  }, [card, rate, revealed]);

  if (error && !session) return <div className="space-y-4"><p role="alert" className="text-red-700">{error}</p><Link href={`/kits/${id}`} className="underline">Back to kit</Link></div>;
  if (!session || !kit) return <p className="text-sm text-slate-600">Loading practice mode...</p>;
  if (session.cards.length === 0) return <div className="space-y-5"><Link href={`/kits/${id}`} className="text-sm underline">Back to kit</Link><h1 className="text-3xl font-semibold">Practice flashcards</h1><p className="text-slate-700">No flashcards are available for this kit yet.</p></div>;
  if (!card) return <div className="space-y-5"><Link href={`/kits/${id}`} className="text-sm underline">Back to kit</Link><h1 className="text-3xl font-semibold">Session complete</h1><p className="text-slate-700">{session.cards.length} cards reviewed.</p><div className="grid max-w-xl gap-3 sm:grid-cols-4"><Stat label="Practiced" value={session.stats.practiced} /><Stat label="Not practiced" value={session.stats.unpracticed} /><Stat label="Needs work" value={session.stats.lowConfidence} /><Stat label="Confident" value={session.stats.highConfidence} /></div><Link href={`/kits/${id}/practice`} className="inline-block rounded-md bg-slate-900 px-4 py-2 text-sm text-white">Practice again</Link></div>;
  return <div className="mx-auto max-w-3xl space-y-6"><div className="flex items-center justify-between gap-3"><Link href={`/kits/${id}`} className="text-sm underline">Back to kit</Link><span className="text-sm text-slate-600">Card {index + 1} of {session.cards.length}</span></div><div className="h-2 overflow-hidden rounded-full bg-slate-200"><div className="h-full bg-slate-900 transition-all" style={{ width: `${((index + 1) / session.cards.length) * 100}%` }} /></div><div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm sm:p-10"><p className="text-xs uppercase tracking-wide text-slate-500">Flashcard</p><h1 className="mt-4 text-2xl font-semibold leading-tight">{card.front}</h1>{card.requirement_ids.length ? <div className="mt-4 flex flex-wrap gap-2">{card.requirement_ids.map((requirementId) => <span key={requirementId} className="rounded bg-slate-100 px-2 py-1 text-xs text-slate-700">{requirementId} {requirements.find((requirement) => requirement.id === requirementId)?.text ?? ""}</span>)}</div> : null}{revealed ? <div className="mt-8 border-t border-slate-200 pt-6"><p className="whitespace-pre-wrap leading-7 text-slate-700">{card.back}</p></div> : <button type="button" onClick={() => setRevealed(true)} className="mt-8 rounded-md bg-slate-900 px-4 py-2 text-sm text-white">Reveal answer</button>}{revealed ? <div className="mt-8 border-t border-slate-200 pt-6"><p className="text-sm font-medium">How confident are you?</p><div className="mt-3 flex flex-wrap gap-2">{([1, 2, 3] as const).map((confidence) => <button key={confidence} type="button" onClick={() => void rate(confidence)} disabled={busy} className="rounded-md border border-slate-300 px-3 py-2 text-sm disabled:opacity-60"><span className="font-medium">{confidenceLabels[confidence]}</span><span className="ml-2 text-xs text-slate-500">{confidence}</span></button>)}</div><p className="mt-3 text-xs text-slate-500">Keys 1, 2, and 3 rate this card after reveal.</p></div> : <p className="mt-4 text-xs text-slate-500">Press Space or Enter to reveal.</p>}{error ? <p role="alert" className="mt-4 text-sm text-red-700">{error}</p> : null}</div></div>;
}

function Stat({ label, value }: { label: string; value: number }) { return <div className="rounded-md border border-slate-200 p-3"><p className="text-xs text-slate-500">{label}</p><p className="mt-1 text-xl font-semibold">{value}</p></div>; }
