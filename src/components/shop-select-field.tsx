"use client";

import { Label, ListBox, Select } from "@heroui/react";
import { ChevronDown } from "lucide-react";

interface ShopOption {
  id: string;
  name: string;
}

interface ShopSelectFieldProps {
  shops: ShopOption[];
  value: string;
  onChange: (value: string) => void;
  isInvalid?: boolean;
  label?: string;
}

export function ShopSelectField({ shops, value, onChange, isInvalid, label = "ร้าน" }: ShopSelectFieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label>{label}</Label>
      <Select
        selectedKey={value || null}
        onSelectionChange={(key) => onChange(String(key ?? ""))}
        isInvalid={isInvalid}
        fullWidth
      >
        <Select.Trigger>
          <Select.Value>{(node) => node.selectedText || "เลือกร้าน"}</Select.Value>
          <ChevronDown className="size-4" />
        </Select.Trigger>
        <Select.Popover>
          <ListBox>
            {shops.map((shop) => (
              <ListBox.Item key={shop.id} id={shop.id} textValue={shop.name}>
                {shop.name}
              </ListBox.Item>
            ))}
          </ListBox>
        </Select.Popover>
      </Select>
    </div>
  );
}
