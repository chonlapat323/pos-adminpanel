"use client";

import { useEffect, useState } from "react";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { Input, ListBox, Select } from "@heroui/react";
import { ChevronDown } from "lucide-react";

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

  function updateParam(key: string, value: React.Key | null) {
    const params = new URLSearchParams(searchParams.toString());
    if (value && value !== ALL) params.set(key, String(value));
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

      <Select
        selectedKey={searchParams.get("categoryId") ?? ALL}
        onSelectionChange={(key) => updateParam("categoryId", key)}
      >
        <Select.Trigger className="w-44">
          <Select.Value />
          <ChevronDown className="size-4" />
        </Select.Trigger>
        <Select.Popover>
          <ListBox>
            <ListBox.Item id={ALL}>ทุกกลุ่มบริการ</ListBox.Item>
            {categories.map((category) => (
              <ListBox.Item key={category.id} id={category.id}>
                {category.name}
              </ListBox.Item>
            ))}
          </ListBox>
        </Select.Popover>
      </Select>

      <Select selectedKey={searchParams.get("status") ?? ALL} onSelectionChange={(key) => updateParam("status", key)}>
        <Select.Trigger className="w-36">
          <Select.Value />
          <ChevronDown className="size-4" />
        </Select.Trigger>
        <Select.Popover>
          <ListBox>
            <ListBox.Item id={ALL}>ทุกสถานะ</ListBox.Item>
            <ListBox.Item id="ACTIVE">เปิดใช้งาน</ListBox.Item>
            <ListBox.Item id="INACTIVE">ปิด</ListBox.Item>
            <ListBox.Item id="PROMOTION">โปรโมชัน</ListBox.Item>
          </ListBox>
        </Select.Popover>
      </Select>
    </div>
  );
}
