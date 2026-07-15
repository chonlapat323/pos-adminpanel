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
import { Controller, useForm, useWatch } from "react-hook-form";
import { z } from "zod";

import { ImageUploadField } from "@/components/image-upload-field";
import { ShopSelectField } from "@/components/shop-select-field";
import { uploadPlatformImage } from "@/lib/upload";

import { createPlatformCategory, updatePlatformCategory } from "./actions";

interface ShopOption {
  id: string;
  name: string;
}

const categorySchema = z.object({
  shopId: z.string().min(1, "เลือกร้าน"),
  name: z.string().min(1, "กรอกชื่อกลุ่มบริการ"),
  isHidden: z.enum(["true", "false"]),
  imageUrl: z.string(),
});

interface CategoryFormDialogProps {
  shops: ShopOption[];
  category?: { id: string; name: string; isHidden: boolean; imageUrl: string | null; shop: ShopOption };
}

export function CategoryFormDialog({ shops, category }: CategoryFormDialogProps) {
  const isEdit = Boolean(category);
  const [open, setOpen] = useState(false);
  const form = useForm<z.infer<typeof categorySchema>>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      shopId: category?.shop.id ?? "",
      name: category?.name ?? "",
      isHidden: category?.isHidden ? "true" : "false",
      imageUrl: category?.imageUrl ?? "",
    },
  });

  const shopId = useWatch({ control: form.control, name: "shopId" });

  async function onSubmit(data: z.infer<typeof categorySchema>) {
    const imageUrl = data.imageUrl || undefined;
    const result = category
      ? await updatePlatformCategory(category.id, { name: data.name, isHidden: data.isHidden === "true", imageUrl })
      : await createPlatformCategory({
          shopId: data.shopId,
          name: data.name,
          isHidden: data.isHidden === "true",
          imageUrl,
        });
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
              </Modal.Header>
              <Modal.Body className="flex flex-col gap-4">
                {!isEdit && (
                  <Controller
                    control={form.control}
                    name="shopId"
                    render={({ field, fieldState }) => (
                      <ShopSelectField
                        shops={shops}
                        value={field.value}
                        onChange={field.onChange}
                        isInvalid={fieldState.invalid}
                      />
                    )}
                  />
                )}
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
                  render={({ field }) => (
                    <ImageUploadField
                      value={field.value}
                      onChange={field.onChange}
                      upload={(formData) => uploadPlatformImage(formData, shopId)}
                      isDisabled={!shopId}
                    />
                  )}
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
