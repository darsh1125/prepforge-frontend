"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/features/auth/AuthProvider";

export default function HomePage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  useEffect(() => { if (!loading) router.replace(user ? "/dashboard" : "/login"); }, [loading, router, user]);
  return <div className="flex min-h-[50vh] items-center justify-center" role="status"><p className="loading-dots text-sm font-medium text-slate-500">Opening your workspace</p></div>;
}
