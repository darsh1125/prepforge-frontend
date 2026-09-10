import { AuthForm } from "@/features/auth/AuthForm";

export default function LoginPage() { return <div className="mx-auto max-w-md space-y-6"><div><p className="text-sm font-medium text-slate-500">Welcome back</p><h1 className="mt-1 text-3xl font-semibold">Log in to PrepForge</h1></div><AuthForm mode="login" /></div>; }
