"use client";

import { EntityComboBoxField } from "./entity-combo-box-field";

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
    <EntityComboBoxField
      items={shops}
      value={value}
      onChange={onChange}
      isInvalid={isInvalid}
      label={label}
      placeholder="พิมพ์เพื่อค้นหาร้าน"
    />
  );
}
