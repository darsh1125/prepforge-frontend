"use client";

import { useState, type FormEvent } from "react";

export function NewKitForm() {
  const [message, setMessage] = useState<string | null>(null);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(
      "Kit creation is not available yet. Authentication and generation land in later prompts.",
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6 rounded-lg border border-slate-200 bg-white p-6">
      <div className="space-y-2">
        <label htmlFor="jd" className="block text-sm font-medium text-slate-800">
          Job description
        </label>
        <textarea
          id="jd"
          name="jd"
          rows={8}
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
          placeholder="Paste the job description"
        />
      </div>
      <div className="space-y-2">
        <label htmlFor="company_url" className="block text-sm font-medium text-slate-800">
          Company website URL
        </label>
        <input
          id="company_url"
          name="company_url"
          type="url"
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
          placeholder="https://example.com"
        />
      </div>
      <div className="space-y-2">
        <label htmlFor="days" className="block text-sm font-medium text-slate-800">
          Days until interview (1–60)
        </label>
        <input
          id="days"
          name="days"
          type="number"
          min={1}
          max={60}
          defaultValue={5}
          className="w-full max-w-xs rounded-md border border-slate-300 px-3 py-2 text-sm shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
        />
      </div>
      <button
        type="submit"
        className="inline-flex min-h-10 items-center rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
      >
        Create kit
      </button>
      {message ? (
        <p className="text-sm text-slate-700" role="status">
          {message}
        </p>
      ) : null}
    </form>
  );
}
