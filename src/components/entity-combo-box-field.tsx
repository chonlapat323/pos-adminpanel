"use client";

import { ComboBox, Input, Label, ListBox } from "@heroui/react";

interface EntityOption {
  id: string;
  name: string;
}

interface EntityComboBoxFieldProps {
  items: EntityOption[];
  value: string;
  onChange: (value: string) => void;
  isInvalid?: boolean;
  isDisabled?: boolean;
  label: string;
  placeholder: string;
}

export function EntityComboBoxField({
  items,
  value,
  onChange,
  isInvalid,
  isDisabled,
  label,
  placeholder,
}: EntityComboBoxFieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label>{label}</Label>
      <ComboBox
        selectedKey={value || null}
        onSelectionChange={(key) => onChange(String(key ?? ""))}
        isInvalid={isInvalid}
        isDisabled={isDisabled}
        fullWidth
      >
        <ComboBox.InputGroup>
          <Input aria-label={label} placeholder={placeholder} />
          <ComboBox.Trigger />
        </ComboBox.InputGroup>
        <ComboBox.Popover>
          <ListBox>
            {items.map((item) => (
              <ListBox.Item key={item.id} id={item.id} textValue={item.name}>
                {item.name}
              </ListBox.Item>
            ))}
          </ListBox>
        </ComboBox.Popover>
      </ComboBox>
    </div>
  );
}
