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
  TextArea,
  TextField,
  toast,
} from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronDown, Pencil, Plus } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

import { createService, updateService } from "./actions";

interface Category {
  id: string;
  name: string;
}

const serviceSchema = z.object({
  categoryId: z.string().min(1, "เลือกกลุ่มบริการ"),
  name: z.string().min(1, "กรอกชื่อบริการ"),
  description: z.string().optional(),
  price: z.coerce.number().min(0, "ราคาต้องไม่ติดลบ"),
  durationMinutes: z.coerce.number().int().min(1, "ระยะเวลาต้องมากกว่า 0"),
  status: z.enum(["ACTIVE", "INACTIVE", "PROMOTION"]),
});

interface ServiceFormDialogProps {
  categories: Category[];
  service?: {
    id: string;
    name: string;
    description: string | null;
    price: string | number;
    durationMinutes: number;
    status: "ACTIVE" | "INACTIVE" | "PROMOTION";
    category: Category;
  };
}

export function ServiceFormDialog({ categories, service }: ServiceFormDialogProps) {
  const isEdit = Boolean(service);
  const [open, setOpen] = useState(false);
  const form = useForm<z.input<typeof serviceSchema>, unknown, z.output<typeof serviceSchema>>({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      categoryId: service?.category.id ?? "",
      name: service?.name ?? "",
      description: service?.description ?? "",
      price: service ? Number(service.price) : 0,
      durationMinutes: service?.durationMinutes ?? 30,
      status: service?.status ?? "ACTIVE",
    },
  });

  async function onSubmit(data: z.output<typeof serviceSchema>) {
    const result = service ? await updateService(service.id, data) : await createService(data);
    if (!result.success) {
      toast.danger(result.error);
      return;
    }
    toast.success(isEdit ? "แก้ไขบริการแล้ว" : "เพิ่มบริการแล้ว");
    if (!isEdit) form.reset();
    setOpen(false);
  }

  function handleOpenChange(next: boolean) {
    if (next && categories.length === 0) {
      toast.danger("กรุณาเพิ่มกลุ่มบริการก่อน", { description: "ไปที่เมนู “กลุ่มบริการ” เพื่อเพิ่มก่อน" });
      return;
    }
    setOpen(next);
  }

  return (
    <Modal isOpen={open} onOpenChange={handleOpenChange}>
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
                <p className="text-muted text-sm">กรอกรายละเอียดบริการที่ร้านเปิดให้จอง</p>
              </Modal.Header>
              <Modal.Body className="flex flex-col gap-4">
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
                        fullWidth
                      >
                        <Select.Trigger>
                          <Select.Value>{(node) => node.selectedText || "เลือกกลุ่มบริการ"}</Select.Value>
                          <ChevronDown className="size-4" />
                        </Select.Trigger>
                        <Select.Popover>
                          <ListBox>
                            {categories.map((category) => (
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
