"use client";

import { Button, ErrorMessage, Input, Label, ListBox, Select, TextField, toast } from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronDown } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

import { ImageUploadField } from "@/components/image-upload-field";

import { updateShopSettings } from "./actions";

const SHOP_TYPE_LABELS: Record<string, string> = {
  NAIL: "ทำเล็บ",
  HAIR: "ตัดผม",
  WAX: "แว็กซ์ขน",
  MULTI: "รวมหลายบริการ",
};

const settingsSchema = z.object({
  name: z.string().min(1, "กรอกชื่อร้าน"),
  shopType: z.enum(["NAIL", "HAIR", "WAX", "MULTI"]),
  logoUrl: z.string(),
  address: z.string().optional(),
  phone: z.string().optional(),
  openTime: z.string().optional(),
  closeTime: z.string().optional(),
  bahtPerPoint: z.coerce.number().int().min(1, "ต้องมากกว่า 0"),
  signupBonusPoints: z.coerce.number().int().min(0, "ต้องไม่ติดลบ"),
});

interface ShopSettingsFormProps {
  shop: {
    name: string;
    shopType: "NAIL" | "HAIR" | "WAX" | "MULTI";
    logoUrl: string | null;
    address: string | null;
    phone: string | null;
    openTime: string | null;
    closeTime: string | null;
    bahtPerPoint: number;
    signupBonusPoints: number;
  };
}

export function ShopSettingsForm({ shop }: ShopSettingsFormProps) {
  const form = useForm<z.input<typeof settingsSchema>, unknown, z.output<typeof settingsSchema>>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      name: shop.name,
      shopType: shop.shopType,
      logoUrl: shop.logoUrl ?? "",
      address: shop.address ?? "",
      phone: shop.phone ?? "",
      openTime: shop.openTime ?? "",
      closeTime: shop.closeTime ?? "",
      bahtPerPoint: shop.bahtPerPoint,
      signupBonusPoints: shop.signupBonusPoints,
    },
  });

  async function onSubmit(data: z.output<typeof settingsSchema>) {
    const result = await updateShopSettings({
      name: data.name,
      shopType: data.shopType,
      logoUrl: data.logoUrl || undefined,
      address: data.address || undefined,
      phone: data.phone || undefined,
      openTime: data.openTime || undefined,
      closeTime: data.closeTime || undefined,
      bahtPerPoint: data.bahtPerPoint,
      signupBonusPoints: data.signupBonusPoints,
    });
    if (!result.success) {
      toast.danger(result.error);
      return;
    }
    toast.success("บันทึกข้อมูลร้านแล้ว");
  }

  return (
    <form noValidate onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <Controller
        control={form.control}
        name="logoUrl"
        render={({ field }) => <ImageUploadField label="โลโก้ร้าน" value={field.value} onChange={field.onChange} />}
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <Controller
          control={form.control}
          name="name"
          render={({ field, fieldState }) => (
            <TextField
              name={field.name}
              value={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
              isInvalid={fieldState.invalid}
              fullWidth
            >
              <Label>ชื่อร้าน</Label>
              <Input placeholder="ชื่อร้าน" />
              {fieldState.invalid && <ErrorMessage>{fieldState.error?.message}</ErrorMessage>}
            </TextField>
          )}
        />
        <Controller
          control={form.control}
          name="shopType"
          render={({ field }) => (
            <div className="flex flex-col gap-1.5">
              <Label>ประเภทร้าน</Label>
              <Select selectedKey={field.value} onSelectionChange={(key) => field.onChange(String(key))} fullWidth>
                <Select.Trigger>
                  <Select.Value />
                  <ChevronDown className="size-4" />
                </Select.Trigger>
                <Select.Popover>
                  <ListBox>
                    {Object.entries(SHOP_TYPE_LABELS).map(([value, label]) => (
                      <ListBox.Item key={value} id={value} textValue={label}>
                        {label}
                      </ListBox.Item>
                    ))}
                  </ListBox>
                </Select.Popover>
              </Select>
            </div>
          )}
        />
        <Controller
          control={form.control}
          name="address"
          render={({ field }) => (
            <TextField name={field.name} value={field.value} onChange={field.onChange} fullWidth>
              <Label>ที่อยู่</Label>
              <Input placeholder="ที่อยู่ร้าน" />
            </TextField>
          )}
        />
        <Controller
          control={form.control}
          name="phone"
          render={({ field }) => (
            <TextField name={field.name} value={field.value} onChange={field.onChange} fullWidth>
              <Label>เบอร์โทร</Label>
              <Input placeholder="เบอร์โทรร้าน" />
            </TextField>
          )}
        />
        <Controller
          control={form.control}
          name="openTime"
          render={({ field }) => (
            <TextField name={field.name} fullWidth>
              <Label>เวลาเปิด</Label>
              <Input type="time" value={field.value} onChange={(e) => field.onChange(e.target.value)} />
            </TextField>
          )}
        />
        <Controller
          control={form.control}
          name="closeTime"
          render={({ field }) => (
            <TextField name={field.name} fullWidth>
              <Label>เวลาปิด</Label>
              <Input type="time" value={field.value} onChange={(e) => field.onChange(e.target.value)} />
            </TextField>
          )}
        />
        <Controller
          control={form.control}
          name="bahtPerPoint"
          render={({ field, fieldState }) => (
            <TextField
              name={field.name}
              value={field.value as unknown as string}
              onChange={field.onChange}
              onBlur={field.onBlur}
              isInvalid={fieldState.invalid}
              fullWidth
            >
              <Label>อัตราสะสม point (บาทต่อ 1 point)</Label>
              <Input type="number" min={1} />
              {fieldState.invalid && <ErrorMessage>{fieldState.error?.message}</ErrorMessage>}
            </TextField>
          )}
        />
        <Controller
          control={form.control}
          name="signupBonusPoints"
          render={({ field, fieldState }) => (
            <TextField
              name={field.name}
              value={field.value as unknown as string}
              onChange={field.onChange}
              onBlur={field.onBlur}
              isInvalid={fieldState.invalid}
              fullWidth
            >
              <Label>คะแนนโบนัสสมัครสมาชิกใหม่</Label>
              <Input type="number" min={0} />
              {fieldState.invalid && <ErrorMessage>{fieldState.error?.message}</ErrorMessage>}
            </TextField>
          )}
        />
      </div>
      <div>
        <Button type="submit" isDisabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? "กำลังบันทึก..." : "บันทึกการเปลี่ยนแปลง"}
        </Button>
      </div>
    </form>
  );
}
