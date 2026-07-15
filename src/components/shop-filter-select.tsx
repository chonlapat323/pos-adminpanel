"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { ListBox, Select } from "@heroui/react";
import { ChevronDown } from "lucide-react";

interface ShopOption {
  id: string;
  name: string;
}

export function ShopFilterSelect({ shops }: { shops: ShopOption[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const current = searchParams.get("shopId") ?? "__all__";

  function handleChange(key: React.Key | null) {
    const params = new URLSearchParams(searchParams.toString());
    if (!key || key === "__all__") params.delete("shopId");
    else params.set("shopId", String(key));
    params.delete("page");
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <Select selectedKey={current} onSelectionChange={handleChange} className="w-56">
      <Select.Trigger>
        <Select.Value />
        <ChevronDown className="size-4" />
      </Select.Trigger>
      <Select.Popover>
        <ListBox>
          <ListBox.Item id="__all__" textValue="ทุกร้าน">
            ทุกร้าน
          </ListBox.Item>
          {shops.map((shop) => (
            <ListBox.Item key={shop.id} id={shop.id} textValue={shop.name}>
              {shop.name}
            </ListBox.Item>
          ))}
        </ListBox>
      </Select.Popover>
    </Select>
  );
}
