"use client";

import { useEffect, useState } from "react";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { Input, ListBox, Select } from "@heroui/react";
import { ChevronDown } from "lucide-react";

const EVENT_TYPE_OPTIONS = [
  { id: "", label: "ทุกเหตุการณ์" },
  { id: "TRIAL_STARTED", label: "เริ่มทดลองใช้ฟรี" },
  { id: "PURCHASED", label: "ซื้อแพ็กเกจ (Omise)" },
  { id: "ADMIN_GRANTED", label: "แอดมินให้/ต่ออายุ" },
];

export function SubscriptionEventsFilter() {
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

  function updateParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    params.delete("page");
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Input
        aria-label="ค้นหาชื่อร้าน"
        placeholder="ค้นหาชื่อร้าน"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-56"
      />
      <Select
        aria-label="กรองตามเหตุการณ์"
        selectedKey={searchParams.get("eventType") ?? ""}
        onSelectionChange={(key) => updateParam("eventType", String(key))}
        className="w-48"
      >
        <Select.Trigger>
          <Select.Value />
          <ChevronDown className="size-4" />
        </Select.Trigger>
        <Select.Popover>
          <ListBox>
            {EVENT_TYPE_OPTIONS.map((option) => (
              <ListBox.Item key={option.id} id={option.id} textValue={option.label}>
                {option.label}
              </ListBox.Item>
            ))}
          </ListBox>
        </Select.Popover>
      </Select>
      <Input
        aria-label="ตั้งแต่วันที่"
        type="date"
        value={searchParams.get("dateFrom") ?? ""}
        onChange={(e) => updateParam("dateFrom", e.target.value)}
        className="w-40"
      />
      <Input
        aria-label="ถึงวันที่"
        type="date"
        value={searchParams.get("dateTo") ?? ""}
        onChange={(e) => updateParam("dateTo", e.target.value)}
        className="w-40"
      />
    </div>
  );
}
