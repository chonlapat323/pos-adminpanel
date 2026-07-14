"use client";

import { useState } from "react";

import { Button, buttonVariants, ErrorMessage, Input, Label, Modal, TextField, toast } from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

import { createServiceCategory } from "./actions";

const categorySchema = z.object({
  name: z.string().min(1, "กรอกชื่อกลุ่มบริการ"),
});

export function CategoryToolbar() {
  const [open, setOpen] = useState(false);
  const form = useForm<z.infer<typeof categorySchema>>({
    resolver: zodResolver(categorySchema),
    defaultValues: { name: "" },
  });

  async function onSubmit(data: z.infer<typeof categorySchema>) {
    const result = await createServiceCategory(data);
    if (!result.success) {
      toast.danger(result.error);
      return;
    }
    toast.success("เพิ่มกลุ่มบริการแล้ว");
    form.reset();
    setOpen(false);
  }

  return (
    <Modal isOpen={open} onOpenChange={setOpen}>
      <Modal.Trigger className={buttonVariants({ variant: "primary", className: "shrink-0" })}>
        <span className="inline-flex items-center gap-2 whitespace-nowrap">
          <Plus className="size-4" />
          เพิ่มกลุ่มบริการ
        </span>
      </Modal.Trigger>
      <Modal.Backdrop>
        <Modal.Container size="md">
          <Modal.Dialog>
            <form noValidate onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
              <Modal.Header>
                <Modal.Heading>เพิ่มกลุ่มบริการ</Modal.Heading>
                <p className="text-muted text-sm">ตั้งชื่อกลุ่มบริการ เช่น &quot;บริการเล็บ&quot; หรือ &quot;บริการผม&quot;</p>
              </Modal.Header>
              <Modal.Body>
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
                      <Label>ชื่อกลุ่มบริการ</Label>
                      <Input placeholder="เช่น บริการเล็บ" />
                      {fieldState.invalid && <ErrorMessage>{fieldState.error?.message}</ErrorMessage>}
                    </TextField>
                  )}
                />
              </Modal.Body>
              <Modal.Footer>
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
