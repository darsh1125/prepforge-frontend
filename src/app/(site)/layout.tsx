import type { ReactNode } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { AuthProvider } from "@/features/auth/AuthProvider";

export default function SiteLayout({ children }: { children: ReactNode }) {
  return <AuthProvider><AppShell>{children}</AppShell></AuthProvider>;
}
