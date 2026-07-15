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
import { ChevronDown, Pencil, Plus } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

import { ImageUploadField } from "@/components/image-upload-field";

import { createServiceCategory, updateServiceCategory } from "./actions";

const categorySchema = z.object({
  name: z.string().min(1, "กรอกชื่อกลุ่มบริการ"),
  isHidden: z.enum(["true", "false"]),
  imageUrl: z.string(),
});

interface CategoryFormDialogProps {
  category?: { id: string; name: string; isHidden: boolean; imageUrl: string | null };
}

export function CategoryFormDialog({ category }: CategoryFormDialogProps) {
  const isEdit = Boolean(category);
  const [open, setOpen] = useState(false);
  const form = useForm<z.infer<typeof categorySchema>>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: category?.name ?? "",
      isHidden: category?.isHidden ? "true" : "false",
      imageUrl: category?.imageUrl ?? "",
    },
  });

  async function onSubmit(data: z.infer<typeof categorySchema>) {
    const input = { name: data.name, isHidden: data.isHidden === "true", imageUrl: data.imageUrl || undefined };
    const result = category ? await updateServiceCategory(category.id, input) : await createServiceCategory(input);
    if (!result.success) {
      toast.danger(result.error);
      return;
    }
    toast.success(isEdit ? "แก้ไขกลุ่มบริการแล้ว" : "เพิ่มกลุ่มบริการแล้ว");
    if (!isEdit) form.reset();
    setOpen(false);
  }

  return (
    <Modal isOpen={open} onOpenChange={setOpen}>
      <Modal.Trigger
        aria-label={isEdit ? "แก้ไขกลุ่มบริการ" : "เพิ่มกลุ่มบริการ"}
        className={buttonVariants({
          variant: isEdit ? "secondary" : "primary",
          size: isEdit ? "sm" : "md",
          isIconOnly: isEdit,
          className: "!inline-flex shrink-0 items-center justify-center",
        })}
      >
        {isEdit ? (
          <Pencil className="size-4" />
        ) : (
          <span className="inline-flex items-center gap-2 whitespace-nowrap">
            <Plus className="size-4" />
            เพิ่มกลุ่มบริการ
          </span>
        )}
      </Modal.Trigger>
      <Modal.Backdrop>
        <Modal.Container size="md">
          <Modal.Dialog>
            <form noValidate onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
              <Modal.Header>
                <Modal.Heading>{isEdit ? "แก้ไขกลุ่มบริการ" : "เพิ่มกลุ่มบริการ"}</Modal.Heading>
                <p className="text-muted text-sm">ตั้งชื่อกลุ่มบริการ เช่น &quot;บริการเล็บ&quot; หรือ &quot;บริการผม&quot;</p>
              </Modal.Header>
              <Modal.Body className="flex flex-col gap-4">
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
                <Controller
                  control={form.control}
                  name="imageUrl"
                  render={({ field }) => <ImageUploadField value={field.value} onChange={field.onChange} />}
                />
                <Controller
                  control={form.control}
                  name="isHidden"
                  render={({ field }) => (
                    <div className="flex flex-col gap-1.5">
                      <Label>สถานะ</Label>
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
                            <ListBox.Item id="false" textValue="แสดง">
                              แสดง
                            </ListBox.Item>
                            <ListBox.Item id="true" textValue="ซ่อน">
                              ซ่อน
                            </ListBox.Item>
                          </ListBox>
                        </Select.Popover>
                      </Select>
                    </div>
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
