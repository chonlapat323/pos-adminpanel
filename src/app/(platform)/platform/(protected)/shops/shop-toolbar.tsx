"use client";

import { useState } from "react";

import {
  Button,
  buttonVariants,
  ErrorMessage,
  Input,
  Label,
  ListBox,
  Modal,
  Select,
  TextField,
  toast,
} from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronDown, Plus } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

import { createShop } from "./actions";

const shopSchema = z.object({
  name: z.string().min(1, "กรอกชื่อร้าน"),
  slug: z
    .string()
    .min(1, "กรอก slug")
    .regex(/^[a-z0-9-]+$/, "ใช้ตัวพิมพ์เล็ก ตัวเลข และ - เท่านั้น"),
  shopType: z.enum(["NAIL", "HAIR", "WAX", "MULTI"]),
  address: z.string().optional(),
  phone: z.string().optional(),
  ownerName: z.string().min(1, "กรอกชื่อเจ้าของร้าน"),
  ownerEmail: z.email("กรอกอีเมลให้ถูกต้อง"),
  ownerPassword: z.string().min(6, "รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร"),
});

const SHOP_TYPE_LABELS: Record<string, string> = {
  NAIL: "ทำเล็บ",
  HAIR: "ตัดผม",
  WAX: "แว็กซ์ขน",
  MULTI: "รวมหลายบริการ",
};

export function ShopToolbar() {
  const [open, setOpen] = useState(false);
  const form = useForm<z.infer<typeof shopSchema>>({
    resolver: zodResolver(shopSchema),
    defaultValues: {
      name: "",
      slug: "",
      shopType: "MULTI",
      address: "",
      phone: "",
      ownerName: "",
      ownerEmail: "",
      ownerPassword: "",
    },
  });

  async function onSubmit(data: z.infer<typeof shopSchema>) {
    const result = await createShop(data);
    if (!result.success) {
      toast.danger(result.error);
      return;
    }
    toast.success("สร้างร้านแล้ว");
    form.reset();
    setOpen(false);
  }

  return (
    <Modal isOpen={open} onOpenChange={setOpen}>
      <Modal.Trigger
        className={buttonVariants({
          variant: "primary",
          className: "!inline-flex shrink-0 items-center justify-center",
        })}
      >
        <span className="inline-flex items-center gap-2 whitespace-nowrap">
          <Plus className="size-4" />
          เพิ่มร้าน
        </span>
      </Modal.Trigger>
      <Modal.Backdrop>
        <Modal.Container size="lg">
          <Modal.Dialog>
            <form noValidate onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
              <Modal.Header>
                <Modal.Heading>เพิ่มร้านใหม่</Modal.Heading>
                <p className="text-muted text-sm">สร้างร้านพร้อมบัญชีเจ้าของร้านคนแรก</p>
              </Modal.Header>
              <Modal.Body className="flex flex-col gap-4">
                <div className="grid grid-cols-2 gap-4">
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
                        <Input placeholder="เช่น Demo Nail Salon" />
                        {fieldState.invalid && <ErrorMessage>{fieldState.error?.message}</ErrorMessage>}
                      </TextField>
                    )}
                  />
                  <Controller
                    control={form.control}
                    name="slug"
                    render={({ field, fieldState }) => (
                      <TextField
                        name={field.name}
                        value={field.value}
                        onChange={field.onChange}
                        onBlur={field.onBlur}
                        isInvalid={fieldState.invalid}
                        fullWidth
                      >
                        <Label>Slug (สำหรับ URL)</Label>
                        <Input placeholder="เช่น demo-nail" />
                        {fieldState.invalid && <ErrorMessage>{fieldState.error?.message}</ErrorMessage>}
                      </TextField>
                    )}
                  />
                </div>
                <Controller
                  control={form.control}
                  name="shopType"
                  render={({ field }) => (
                    <div className="flex flex-col gap-1.5">
                      <Label>ประเภทร้าน</Label>
                      <Select
                        selectedKey={field.value}
                        onSelectionChange={(key) => field.onChange(String(key))}
                        fullWidth
                      >
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
                <div className="grid grid-cols-2 gap-4">
                  <Controller
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <TextField name={field.name} value={field.value} onChange={field.onChange} fullWidth>
                        <Label>ที่อยู่ (ไม่บังคับ)</Label>
                        <Input placeholder="ที่อยู่ร้าน" />
                      </TextField>
                    )}
                  />
                  <Controller
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <TextField name={field.name} value={field.value} onChange={field.onChange} fullWidth>
                        <Label>เบอร์โทร (ไม่บังคับ)</Label>
                        <Input placeholder="เบอร์โทรร้าน" />
                      </TextField>
                    )}
                  />
                </div>
                <div className="border-border border-t pt-4">
                  <p className="mb-3 font-medium text-sm">บัญชีเจ้าของร้าน</p>
                  <div className="flex flex-col gap-4">
                    <Controller
                      control={form.control}
                      name="ownerName"
                      render={({ field, fieldState }) => (
                        <TextField
                          name={field.name}
                          value={field.value}
                          onChange={field.onChange}
                          onBlur={field.onBlur}
                          isInvalid={fieldState.invalid}
                          fullWidth
                        >
                          <Label>ชื่อเจ้าของร้าน</Label>
                          <Input placeholder="ชื่อ-นามสกุล" />
                          {fieldState.invalid && <ErrorMessage>{fieldState.error?.message}</ErrorMessage>}
                        </TextField>
                      )}
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <Controller
                        control={form.control}
                        name="ownerEmail"
                        render={({ field, fieldState }) => (
                          <TextField
                            name={field.name}
                            value={field.value}
                            onChange={field.onChange}
                            onBlur={field.onBlur}
                            isInvalid={fieldState.invalid}
                            fullWidth
                          >
                            <Label>อีเมล</Label>
                            <Input type="email" placeholder="owner@example.com" />
                            {fieldState.invalid && <ErrorMessage>{fieldState.error?.message}</ErrorMessage>}
                          </TextField>
                        )}
                      />
                      <Controller
                        control={form.control}
                        name="ownerPassword"
                        render={({ field, fieldState }) => (
                          <TextField
                            name={field.name}
                            value={field.value}
                            onChange={field.onChange}
                            onBlur={field.onBlur}
                            isInvalid={fieldState.invalid}
                            fullWidth
                          >
                            <Label>รหัสผ่าน</Label>
                            <Input type="password" placeholder="••••••••" />
                            {fieldState.invalid && <ErrorMessage>{fieldState.error?.message}</ErrorMessage>}
                          </TextField>
                        )}
                      />
                    </div>
                  </div>
                </div>
              </Modal.Body>
              <Modal.Footer>
                <Modal.CloseTrigger className={buttonVariants({ variant: "secondary" })}>ยกเลิก</Modal.CloseTrigger>
                <Button type="submit" isDisabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting ? "กำลังบันทึก..." : "สร้างร้าน"}
                </Button>
              </Modal.Footer>
            </form>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
}
