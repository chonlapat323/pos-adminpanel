"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { ListBox, Select } from "@heroui/react";
import { ChevronDown } from "lucide-react";

import { ShopFilterSelect } from "@/components/shop-filter-select";

interface ShopOption {
  id: string;
  name: string;
}

const PERIOD_LABELS: Record<string, string> = {
  today: "วันนี้",
  week: "สัปดาห์นี้",
  month: "เดือนนี้",
  all: "ทั้งหมด",
};

export function DashboardFilter({ shops }: { shops: ShopOption[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const period = searchParams.get("period") ?? "month";

  function handlePeriodChange(key: React.Key | null) {
    const params = new URLSearchParams(searchParams.toString());
    if (!key || key === "month") params.delete("period");
    else params.set("period", String(key));
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="flex items-center gap-2">
      <Select selectedKey={period} onSelectionChange={handlePeriodChange} className="w-40">
        <Select.Trigger>
          <Select.Value />
          <ChevronDown className="size-4" />
        </Select.Trigger>
        <Select.Popover>
          <ListBox>
            {Object.entries(PERIOD_LABELS).map(([value, label]) => (
              <ListBox.Item key={value} id={value} textValue={label}>
                {label}
              </ListBox.Item>
            ))}
          </ListBox>
        </Select.Popover>
      </Select>
      <ShopFilterSelect shops={shops} />
    </div>
  );
}
