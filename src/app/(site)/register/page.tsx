import { AuthForm } from "@/features/auth/AuthForm";

export default function RegisterPage() { return <div className="mx-auto max-w-md space-y-6"><div><p className="text-sm font-medium text-slate-500">Start preparing</p><h1 className="mt-1 text-3xl font-semibold">Create your account</h1></div><AuthForm mode="register" /></div>; }
