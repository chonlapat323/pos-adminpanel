import type { ReactNode } from "react";

import Link from "next/link";

import { ShieldCheck } from "lucide-react";

import { getCurrentPlatformAdmin } from "@/lib/platform-auth";

import { PlatformAccountMenu } from "./platform-account-menu";

export default async function PlatformShopsLayout({ children }: { children: ReactNode }) {
  const admin = await getCurrentPlatformAdmin();

  return (
    <div className="flex h-dvh w-full flex-col overflow-hidden bg-background">
      <header className="flex h-14 shrink-0 items-center justify-between border-border border-b bg-surface px-4 md:px-6">
        <Link href="/platform/shops" className="flex items-center gap-2 font-semibold">
          <ShieldCheck className="size-5" />
          Platform Admin
        </Link>
        {admin && <PlatformAccountMenu admin={admin} />}
      </header>
      <main className="min-h-0 flex-1 overflow-y-auto p-4 md:p-6">{children}</main>
    </div>
  );
}
