"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { Scissors } from "lucide-react";

import { APP_CONFIG } from "@/config/app-config";
import { cn } from "@/lib/utils";
import { sidebarItems } from "@/navigation/sidebar/sidebar-items";

export function SidebarNav() {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col">
      <Link href="/dashboard" className="flex items-center gap-2 px-4 py-4 font-semibold text-lg">
        <Scissors className="size-5" />
        {APP_CONFIG.name}
      </Link>
      <nav className="flex flex-1 flex-col gap-6 overflow-y-auto px-3 pb-4">
        {sidebarItems.map((group) => (
          <div key={group.id} className="flex flex-col gap-1">
            <p className="px-3 pb-1 font-medium text-muted text-xs uppercase tracking-wide">{group.label}</p>
            {group.items.map((item) => {
              const isActive =
                pathname === item.url || (item.url !== "/dashboard" && pathname?.startsWith(`${item.url}/`));
              const Icon = item.icon;
              return (
                <Link
                  key={item.id}
                  href={item.url}
                  className={cn(
                    "flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors",
                    isActive ? "bg-accent text-accent-foreground font-medium" : "text-foreground/80 hover:bg-default",
                  )}
                >
                  <Icon className="size-4" />
                  {item.title}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>
    </div>
  );
}
