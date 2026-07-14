"use client";

import { useEffect, useState } from "react";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Category {
  id: string;
  name: string;
}

const ALL = "__all__";

export function ServicesFilter({ categories }: { categories: Category[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("search") ?? "");

  function updateParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value && value !== ALL) params.set(key, value);
    else params.delete(key);
    params.delete("page");
    router.push(`${pathname}?${params.toString()}`);
  }

  // biome-ignore lint/correctness/useExhaustiveDependencies: only re-run the debounce when the search text itself changes
  useEffect(() => {
    const current = searchParams.get("search") ?? "";
    if (search === current) return;

    const timeout = setTimeout(() => updateParam("search", search), 400);
    return () => clearTimeout(timeout);
  }, [search]);

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Input placeholder="ค้นหาชื่อบริการ" value={search} onChange={(e) => setSearch(e.target.value)} className="w-48" />
      <Select value={searchParams.get("categoryId") ?? ALL} onValueChange={(value) => updateParam("categoryId", value)}>
        <SelectTrigger className="w-44">
          <SelectValue placeholder="ทุกกลุ่มบริการ" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL}>ทุกกลุ่มบริการ</SelectItem>
          {categories.map((category) => (
            <SelectItem key={category.id} value={category.id}>
              {category.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select value={searchParams.get("status") ?? ALL} onValueChange={(value) => updateParam("status", value)}>
        <SelectTrigger className="w-36">
          <SelectValue placeholder="ทุกสถานะ" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL}>ทุกสถานะ</SelectItem>
          <SelectItem value="ACTIVE">เปิดใช้งาน</SelectItem>
          <SelectItem value="INACTIVE">ปิด</SelectItem>
          <SelectItem value="PROMOTION">โปรโมชัน</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
