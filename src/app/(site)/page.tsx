import Link from "next/link";
import { ApiHealthBanner } from "@/components/ApiHealthBanner";

export default function HomePage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-semibold tracking-tight">PrepForge</h1>
      <p className="max-w-2xl text-base leading-7 text-slate-700">
        Build interview-preparation kits from a job description, company website, and the number of
        days you have to prepare. This frontend talks to the PrepForge API over HTTP.
      </p>
      <ApiHealthBanner />
      <div className="flex flex-wrap gap-3">
        <Link
          href="/dashboard"
          className="inline-flex min-h-10 items-center rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
        >
          Open dashboard
        </Link>
        <Link
          href="/kits/new"
          className="inline-flex min-h-10 items-center rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-900 hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
        >
          New kit
        </Link>
      </div>
    </div>
  );
}
