"use client";

import { useEffect, useState } from "react";

import {
  Button,
  buttonVariants,
  ErrorMessage,
  Input,
  Label,
  ListBox,
  Modal,
  Select,
  TextArea,
  TextField,
  toast,
} from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronDown, Pencil, Plus } from "lucide-react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { z } from "zod";

import { ShopSelectField } from "@/components/shop-select-field";

import { createPlatformService, updatePlatformService } from "./actions";

interface ShopOption {
  id: string;
  name: string;
}

interface CategoryOption {
  id: string;
  name: string;
  shopId: string;
}

const serviceSchema = z.object({
  shopId: z.string().min(1, "เลือกร้าน"),
  categoryId: z.string().min(1, "เลือกกลุ่มบริการ"),
  name: z.string().min(1, "กรอกชื่อบริการ"),
  description: z.string().optional(),
  price: z.coerce.number().min(0, "ราคาต้องไม่ติดลบ"),
  durationMinutes: z.coerce.number().int().min(1, "ระยะเวลาต้องมากกว่า 0"),
  status: z.enum(["ACTIVE", "INACTIVE", "PROMOTION"]),
});

interface ServiceFormDialogProps {
  shops: ShopOption[];
  categories: CategoryOption[];
  service?: {
    id: string;
    name: string;
    description: string | null;
    price: string | number;
    durationMinutes: number;
    status: "ACTIVE" | "INACTIVE" | "PROMOTION";
    shop: ShopOption;
    category: { id: string; name: string };
  };
}

export function ServiceFormDialog({ shops, categories, service }: ServiceFormDialogProps) {
  const isEdit = Boolean(service);
  const [open, setOpen] = useState(false);
  const form = useForm<z.input<typeof serviceSchema>, unknown, z.output<typeof serviceSchema>>({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      shopId: service?.shop.id ?? "",
      categoryId: service?.category.id ?? "",
      name: service?.name ?? "",
      description: service?.description ?? "",
      price: service ? Number(service.price) : 0,
      durationMinutes: service?.durationMinutes ?? 30,
      status: service?.status ?? "ACTIVE",
    },
  });

  const shopId = useWatch({ control: form.control, name: "shopId" });
  const filteredCategories = categories.filter((c) => c.shopId === shopId);

  // biome-ignore lint/correctness/useExhaustiveDependencies: only re-run when the selected shop changes, to drop a category that no longer belongs to it
  useEffect(() => {
    if (isEdit) return;
    const current = form.getValues("categoryId");
    if (current && !filteredCategories.some((c) => c.id === current)) {
      form.setValue("categoryId", "");
    }
  }, [shopId]);

  async function onSubmit(data: z.output<typeof serviceSchema>) {
    const result = service
      ? await updatePlatformService(service.id, {
          categoryId: data.categoryId,
          name: data.name,
          description: data.description,
          price: data.price,
          durationMinutes: data.durationMinutes,
          status: data.status,
        })
      : await createPlatformService(data);
    if (!result.success) {
      toast.danger(result.error);
      return;
    }
    toast.success(isEdit ? "แก้ไขบริการแล้ว" : "เพิ่มบริการแล้ว");
    if (!isEdit) form.reset();
    setOpen(false);
  }

  return (
    <Modal isOpen={open} onOpenChange={setOpen}>
      <Modal.Trigger
        aria-label={isEdit ? "แก้ไขบริการ" : "เพิ่มบริการ"}
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
            เพิ่มบริการ
          </span>
        )}
      </Modal.Trigger>
      <Modal.Backdrop>
        <Modal.Container size="lg">
          <Modal.Dialog>
            <form noValidate onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
              <Modal.Header>
                <Modal.Heading>{isEdit ? "แก้ไขบริการ" : "เพิ่มบริการ"}</Modal.Heading>
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
                  name="categoryId"
                  render={({ field, fieldState }) => (
                    <div className="flex flex-col gap-1.5">
                      <Label>กลุ่มบริการ</Label>
                      <Select
                        selectedKey={field.value || null}
                        onSelectionChange={(key) => field.onChange(String(key ?? ""))}
                        isInvalid={fieldState.invalid}
                        isDisabled={!shopId}
                        fullWidth
                      >
                        <Select.Trigger>
                          <Select.Value>
                            {(node) => node.selectedText || (shopId ? "เลือกกลุ่มบริการ" : "เลือกร้านก่อน")}
                          </Select.Value>
                          <ChevronDown className="size-4" />
                        </Select.Trigger>
                        <Select.Popover>
                          <ListBox>
                            {filteredCategories.map((category) => (
                              <ListBox.Item key={category.id} id={category.id} textValue={category.name}>
                                {category.name}
                              </ListBox.Item>
                            ))}
                          </ListBox>
                        </Select.Popover>
                      </Select>
                      {fieldState.invalid && <ErrorMessage>{fieldState.error?.message}</ErrorMessage>}
                    </div>
                  )}
                />
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
                      <Label>ชื่อบริการ</Label>
                      <Input placeholder="เช่น ทาสีเล็บ" />
                      {fieldState.invalid && <ErrorMessage>{fieldState.error?.message}</ErrorMessage>}
                    </TextField>
                  )}
                />
                <Controller
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <TextField
                      name={field.name}
                      value={field.value}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                      fullWidth
                    >
                      <Label>คำอธิบาย (ไม่บังคับ)</Label>
                      <TextArea placeholder="รายละเอียดบริการ" />
                    </TextField>
                  )}
                />
                <div className="grid grid-cols-2 gap-4">
                  <Controller
                    control={form.control}
                    name="price"
                    render={({ field, fieldState }) => (
                      <TextField
                        name={field.name}
                        value={field.value as unknown as string}
                        onChange={field.onChange}
                        onBlur={field.onBlur}
                        isInvalid={fieldState.invalid}
                        fullWidth
                      >
                        <Label>ราคา (บาท)</Label>
                        <Input type="number" min={0} />
                        {fieldState.invalid && <ErrorMessage>{fieldState.error?.message}</ErrorMessage>}
                      </TextField>
                    )}
                  />
                  <Controller
                    control={form.control}
                    name="durationMinutes"
                    render={({ field, fieldState }) => (
                      <TextField
                        name={field.name}
                        value={field.value as unknown as string}
                        onChange={field.onChange}
                        onBlur={field.onBlur}
                        isInvalid={fieldState.invalid}
                        fullWidth
                      >
                        <Label>ระยะเวลา (นาที)</Label>
                        <Input type="number" min={1} />
                        {fieldState.invalid && <ErrorMessage>{fieldState.error?.message}</ErrorMessage>}
                      </TextField>
                    )}
                  />
                </div>
                <Controller
                  control={form.control}
                  name="status"
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
                            <ListBox.Item id="ACTIVE" textValue="เปิดใช้งาน">
                              เปิดใช้งาน
                            </ListBox.Item>
                            <ListBox.Item id="INACTIVE" textValue="ปิด">
                              ปิด
                            </ListBox.Item>
                            <ListBox.Item id="PROMOTION" textValue="โปรโมชัน">
                              โปรโมชัน
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
