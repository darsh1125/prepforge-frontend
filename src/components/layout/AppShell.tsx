import type { ReactNode } from "react";
import { Header } from "@/components/layout/Header";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-full flex-col bg-slate-50 text-slate-900">
      <Header />
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8">{children}</main>
      <footer className="border-t border-slate-200 bg-white">
        <p className="mx-auto max-w-5xl px-4 py-4 text-sm text-slate-600">
          PrepForge · interview preparation workspace
        </p>
      </footer>
    </div>
  );
}
