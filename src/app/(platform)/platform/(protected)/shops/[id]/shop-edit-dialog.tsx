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
import { ChevronDown, Pencil } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

import { updateShop } from "../actions";

const SHOP_TYPE_LABELS: Record<string, string> = {
  NAIL: "ทำเล็บ",
  HAIR: "ตัดผม",
  WAX: "แว็กซ์ขน",
  MULTI: "รวมหลายบริการ",
};

const shopEditSchema = z.object({
  name: z.string().min(1, "กรอกชื่อร้าน"),
  shopType: z.enum(["NAIL", "HAIR", "WAX", "MULTI"]),
  address: z.string().optional(),
  phone: z.string().optional(),
  bahtPerPoint: z.coerce.number().int().min(1, "ต้องมากกว่า 0"),
});

interface ShopEditDialogProps {
  shop: {
    id: string;
    name: string;
    shopType: "NAIL" | "HAIR" | "WAX" | "MULTI";
    address: string | null;
    phone: string | null;
    bahtPerPoint: number;
  };
}

export function ShopEditDialog({ shop }: ShopEditDialogProps) {
  const [open, setOpen] = useState(false);
  const form = useForm<z.input<typeof shopEditSchema>, unknown, z.output<typeof shopEditSchema>>({
    resolver: zodResolver(shopEditSchema),
    defaultValues: {
      name: shop.name,
      shopType: shop.shopType,
      address: shop.address ?? "",
      phone: shop.phone ?? "",
      bahtPerPoint: shop.bahtPerPoint,
    },
  });

  async function onSubmit(data: z.output<typeof shopEditSchema>) {
    const result = await updateShop(shop.id, {
      name: data.name,
      shopType: data.shopType,
      address: data.address || undefined,
      phone: data.phone || undefined,
      bahtPerPoint: data.bahtPerPoint,
    });
    if (!result.success) {
      toast.danger(result.error);
      return;
    }
    toast.success("แก้ไขข้อมูลร้านแล้ว");
    setOpen(false);
  }

  return (
    <Modal isOpen={open} onOpenChange={setOpen}>
      <Modal.Trigger
        aria-label="แก้ไขข้อมูลร้าน"
        className={buttonVariants({
          variant: "secondary",
          size: "sm",
          className: "!inline-flex shrink-0 items-center justify-center",
        })}
      >
        <span className="inline-flex items-center gap-2 whitespace-nowrap">
          <Pencil className="size-4" />
          แก้ไขข้อมูลร้าน
        </span>
      </Modal.Trigger>
      <Modal.Backdrop>
        <Modal.Container size="lg">
          <Modal.Dialog>
            <form noValidate onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
              <Modal.Header>
                <Modal.Heading>แก้ไขข้อมูลร้าน</Modal.Heading>
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
                </div>
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
              </Modal.Body>
              <Modal.Footer>
                <Modal.CloseTrigger className={buttonVariants({ variant: "secondary" })}>ยกเลิก</Modal.CloseTrigger>
                <Button type="submit" isDisabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting ? "กำลังบันทึก..." : "บันทึก"}
                </Button>
              </Modal.Footer>
            </form>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
}
