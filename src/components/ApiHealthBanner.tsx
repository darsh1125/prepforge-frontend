"use client";

import { useEffect, useState } from "react";
import { ApiClientError } from "@/lib/api/client";
import { getHealth } from "@/lib/api/health";

type Status = "checking" | "ok" | "down";

export function ApiHealthBanner() {
  const [status, setStatus] = useState<Status>("checking");
  const [detail, setDetail] = useState("Checking API…");

  useEffect(() => {
    let cancelled = false;

    getHealth()
      .then((response) => {
        if (cancelled) {
          return;
        }
        if (response.status === "ok") {
          setStatus("ok");
          setDetail("Backend health: ok");
        } else {
          setStatus("down");
          setDetail(`Backend health: ${response.status}`);
        }
      })
      .catch((error: unknown) => {
        if (cancelled) {
          return;
        }
        setStatus("down");
        if (error instanceof ApiClientError) {
          setDetail(`Backend unreachable (${error.code})`);
          return;
        }
        setDetail("Backend unreachable. Start prepforge-backend on port 5000.");
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const className =
    status === "ok"
      ? "border-emerald-200 bg-emerald-50 text-emerald-900"
      : status === "checking"
        ? "border-slate-200 bg-white text-slate-700"
        : "border-amber-200 bg-amber-50 text-amber-950";

  return (
    <p className={`rounded-md border px-3 py-2 text-sm ${className}`} role="status">
      {detail}
    </p>
  );
}
