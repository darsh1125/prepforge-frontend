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

  return <form onSubmit={submit} className="ui-panel space-y-5 p-6 sm:p-7">
    <div className="space-y-2"><label htmlFor="email" className="block text-sm font-semibold text-slate-800">Email address</label><input id="email" type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} className="ui-input" placeholder="you@example.com" required /></div>
    <div className="space-y-2"><label htmlFor="password" className="block text-sm font-semibold text-slate-800">Password</label><input id="password" type="password" autoComplete={isRegister ? "new-password" : "current-password"} value={password} onChange={(event) => setPassword(event.target.value)} className="ui-input" placeholder={isRegister ? "At least 8 characters" : "Enter your password"} required /></div>
    {error ? <p role="alert" className="rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-700">{error}</p> : null}
    <button type="submit" disabled={submitting} className="ui-button ui-button-primary w-full">{submitting ? <span className="loading-dots">Signing you in</span> : isRegister ? "Create account" : "Log in"}</button>
    <p className="text-center text-sm text-slate-500">{isRegister ? "Already have an account?" : "New to PrepForge?"} <Link className="font-semibold text-blue-700 hover:text-blue-800 hover:underline" href={isRegister ? "/login" : "/register"}>{isRegister ? "Log in" : "Create an account"}</Link></p>
  </form>;
}
