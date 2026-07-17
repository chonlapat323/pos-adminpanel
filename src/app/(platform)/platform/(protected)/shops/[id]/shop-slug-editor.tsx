"use client";

import { useState } from "react";

import { Button, buttonVariants, ErrorMessage, Input, Label, Modal, TextField, toast } from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Pencil } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

import { updateShopSlug } from "../actions";

const slugSchema = z.object({
  slug: z
    .string()
    .min(1, "กรอก slug")
    .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "ใช้ได้แค่ตัวพิมพ์เล็ก ตัวเลข และขีดกลาง เช่น beautyup-siam"),
});

export function ShopSlugEditor({ shopId, slug }: { shopId: string; slug: string }) {
  const [open, setOpen] = useState(false);
  const form = useForm<z.infer<typeof slugSchema>>({
    resolver: zodResolver(slugSchema),
    defaultValues: { slug },
  });

  async function onSubmit(data: z.infer<typeof slugSchema>) {
    const result = await updateShopSlug(shopId, data.slug);
    if (!result.success) {
      toast.danger(result.error);
      return;
    }
    toast.success("แก้ไข slug แล้ว");
    setOpen(false);
  }

  return (
    <Modal isOpen={open} onOpenChange={setOpen}>
      <Modal.Trigger
        aria-label="แก้ไข slug"
        className={buttonVariants({
          variant: "secondary",
          size: "sm",
          className: "!inline-flex shrink-0 items-center justify-center",
        })}
      >
        <Pencil className="size-3.5" />
      </Modal.Trigger>
      <Modal.Backdrop>
        <Modal.Container size="md">
          <Modal.Dialog>
            <form noValidate onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
              <Modal.Header>
                <Modal.Heading>แก้ไข slug ร้าน</Modal.Heading>
              </Modal.Header>
              <Modal.Body className="flex flex-col gap-3">
                <p className="text-muted text-sm">
                  slug คือเส้นทางที่ใช้เข้าเว็บลูกค้าของร้านนี้ (เช่น ลิงก์/QR ที่แจกลูกค้า) — ถ้าเปลี่ยน ลิงก์เก่าที่แจกไปแล้วจะใช้ไม่ได้อีก
                </p>
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
                      <Label>slug</Label>
                      <Input placeholder="beautyup-siam" />
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
