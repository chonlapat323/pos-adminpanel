"use client";

import { useEffect, useState } from "react";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { Input } from "@heroui/react";

export function RewardFilter() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("search") ?? "");

  // biome-ignore lint/correctness/useExhaustiveDependencies: only re-run the debounce when the search text itself changes
  useEffect(() => {
    const current = searchParams.get("search") ?? "";
    if (search === current) return;

    const timeout = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (search) params.set("search", search);
      else params.delete("search");
      params.delete("page");
      router.push(`${pathname}?${params.toString()}`);
    }, 400);

    return () => clearTimeout(timeout);
  }, [search]);

  return (
    <Input
      aria-label="ค้นหาชื่อรางวัล"
      placeholder="ค้นหาชื่อรางวัล"
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      className="w-56"
    />
  );
}
