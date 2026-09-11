import { AuthForm } from "@/features/auth/AuthForm";

export default function RegisterPage() { return <div className="mx-auto max-w-md space-y-6"><div className="text-center"><p className="text-sm font-semibold uppercase tracking-[0.14em] text-blue-600">Start preparing</p><h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">Create your account</h1><p className="mt-2 text-sm text-slate-500">Turn a job description into a focused preparation workspace.</p></div><AuthForm mode="register" /></div>; }
