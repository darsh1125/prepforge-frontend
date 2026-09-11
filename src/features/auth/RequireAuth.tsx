"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "./AuthProvider";

export function RequireAuth({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) router.replace("/login");
  }, [loading, router, user]);

  if (loading || !user) return <div className="flex min-h-[40vh] items-center justify-center" role="status"><p className="loading-dots text-sm font-medium text-slate-500">Checking your session</p></div>;
  return <>{children}</>;
}
