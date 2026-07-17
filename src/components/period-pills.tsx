"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { cn } from "@/lib/utils";

const PERIODS: { value: string; label: string }[] = [
  { value: "today", label: "วันนี้" },
  { value: "week", label: "สัปดาห์นี้" },
  { value: "month", label: "เดือนนี้" },
  { value: "all", label: "ทั้งหมด" },
];

export function PeriodPills() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const period = searchParams.get("period") ?? "month";

  function handleChange(value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "month") params.delete("period");
    else params.set("period", value);
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="flex items-center gap-0.5 rounded-[10px] bg-default p-[3px]">
      {PERIODS.map((p) => {
        const active = period === p.value;
        return (
          <button
            key={p.value}
            type="button"
            onClick={() => handleChange(p.value)}
            className={cn(
              "rounded-lg px-3.5 py-1.5 text-[13px] transition-all",
              active ? "bg-surface font-semibold text-foreground shadow-xs" : "font-medium text-muted",
            )}
          >
            {p.label}
          </button>
        );
      })}
    </div>
  );
}
