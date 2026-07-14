"use client";

import { useState } from "react";

import { Button } from "@heroui/react";
import { Menu, X } from "lucide-react";

import { cn } from "@/lib/utils";

import { PlatformAccountMenu } from "./platform-account-menu";
import { PlatformSidebarNav } from "./platform-sidebar-nav";
import { ThemeToggle } from "./theme-toggle";

interface PlatformAppShellProps {
  admin: { name: string } | null;
  children: React.ReactNode;
}

export function PlatformAppShell({ admin, children }: PlatformAppShellProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex h-dvh w-full overflow-hidden bg-background">
      <aside className="hidden w-64 shrink-0 border-border border-r bg-surface lg:flex">
        <PlatformSidebarNav />
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <button
            type="button"
            aria-label="ปิดเมนู"
            className="absolute inset-0 bg-backdrop"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="relative flex w-64 flex-col bg-surface">
            <Button
              variant="ghost"
              isIconOnly
              size="sm"
              className="absolute top-3 right-3"
              onPress={() => setMobileOpen(false)}
            >
              <X className="size-4" />
            </Button>
            <PlatformSidebarNav />
          </aside>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-14 shrink-0 items-center justify-between border-border border-b bg-surface px-4">
          <Button variant="ghost" isIconOnly size="sm" className="lg:hidden" onPress={() => setMobileOpen(true)}>
            <Menu className="size-5" />
          </Button>
          <div className={cn("flex items-center gap-2", "ml-auto")}>
            <ThemeToggle />
            {admin && <PlatformAccountMenu admin={admin} />}
          </div>
        </header>
        <main className="min-h-0 flex-1 overflow-y-auto p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
