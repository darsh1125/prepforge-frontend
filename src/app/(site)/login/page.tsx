import { AuthForm } from "@/features/auth/AuthForm";

export default function LoginPage() { return <div className="mx-auto max-w-md space-y-6"><div className="text-center"><p className="text-sm font-semibold uppercase tracking-[0.14em] text-blue-600">Welcome back</p><h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">Log in to PrepForge</h1><p className="mt-2 text-sm text-slate-500">Continue building a sharper interview plan.</p></div><AuthForm mode="login" /></div>; }
