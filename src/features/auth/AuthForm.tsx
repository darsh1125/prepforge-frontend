"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { ApiClientError } from "@/lib/api/client";
import { useAuth } from "./AuthProvider";

export function AuthForm({ mode }: { mode: "login" | "register" }) {
  const { login, register } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const isRegister = mode === "register";

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    if (!email.trim() || !email.includes("@")) { setError("Enter a valid email address."); return; }
    if (password.length < (isRegister ? 8 : 1)) { setError(isRegister ? "Password must be at least 8 characters." : "Enter your password."); return; }
    setSubmitting(true);
    try { if (isRegister) await register(email, password); else await login(email, password); router.replace("/dashboard"); }
    catch (value) { setError(value instanceof ApiClientError ? value.message : "Something went wrong. Please try again."); }
    finally { setSubmitting(false); }
  }

  return <form onSubmit={submit} className="space-y-5 rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
    <div className="space-y-2"><label htmlFor="email" className="block text-sm font-medium">Email</label><input id="email" type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} className="w-full rounded-md border border-slate-300 px-3 py-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-slate-900" required /></div>
    <div className="space-y-2"><label htmlFor="password" className="block text-sm font-medium">Password</label><input id="password" type="password" autoComplete={isRegister ? "new-password" : "current-password"} value={password} onChange={(event) => setPassword(event.target.value)} className="w-full rounded-md border border-slate-300 px-3 py-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-slate-900" required /></div>
    {error ? <p role="alert" className="text-sm text-red-700">{error}</p> : null}
    <button type="submit" disabled={submitting} className="inline-flex min-h-10 w-full items-center justify-center rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-60">{submitting ? "Working..." : isRegister ? "Create account" : "Log in"}</button>
    <p className="text-center text-sm text-slate-600">{isRegister ? "Already have an account?" : "New to PrepForge?"} <Link className="font-medium text-slate-900 underline" href={isRegister ? "/login" : "/register"}>{isRegister ? "Log in" : "Create an account"}</Link></p>
  </form>;
}
