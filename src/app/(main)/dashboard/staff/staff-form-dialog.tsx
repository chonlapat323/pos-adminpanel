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

import { createStaff, updateStaff } from "./actions";

function buildStaffSchema(isEdit: boolean) {
  return z.object({
    name: z.string().min(1, "กรอกชื่อพนักงาน"),
    email: z.email("กรอกอีเมลให้ถูกต้อง"),
    phone: z.string().optional(),
    password: isEdit
      ? z.union([z.literal(""), z.string().min(6, "รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร")])
      : z.string().min(6, "รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร"),
    role: z.enum(["OWNER", "STAFF"]),
    isActive: z.enum(["true", "false"]),
  });
}

interface StaffFormDialogProps {
  staff?: {
    id: string;
    name: string;
    email: string;
    phone: string | null;
    role: "OWNER" | "STAFF";
    isActive: boolean;
  };
}

export function StaffFormDialog({ staff }: StaffFormDialogProps) {
  const isEdit = Boolean(staff);
  const [open, setOpen] = useState(false);
  const staffSchema = buildStaffSchema(isEdit);
  const form = useForm<z.infer<typeof staffSchema>>({
    resolver: zodResolver(staffSchema),
    defaultValues: {
      name: staff?.name ?? "",
      email: staff?.email ?? "",
      phone: staff?.phone ?? "",
      password: "",
      role: staff?.role ?? "STAFF",
      isActive: staff ? (staff.isActive ? "true" : "false") : "true",
    },
  });

  async function onSubmit(data: z.infer<typeof staffSchema>) {
    const result = staff
      ? await updateStaff(staff.id, {
          name: data.name,
          email: data.email,
          phone: data.phone || undefined,
          password: data.password || undefined,
          role: data.role,
          isActive: data.isActive === "true",
        })
      : await createStaff({
          name: data.name,
          email: data.email,
          phone: data.phone || undefined,
          password: data.password,
          role: data.role,
        });
    if (!result.success) {
      toast.danger(result.error);
      return;
    }
    toast.success(isEdit ? "แก้ไขพนักงานแล้ว" : "เพิ่มพนักงานแล้ว");
    if (!isEdit) form.reset();
    setOpen(false);
  }

  return (
    <Modal isOpen={open} onOpenChange={setOpen}>
      <Modal.Trigger
        aria-label={isEdit ? "แก้ไขพนักงาน" : "เพิ่มพนักงาน"}
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
            เพิ่มพนักงาน
          </span>
        )}
      </Modal.Trigger>
      <Modal.Backdrop>
        <Modal.Container size="lg">
          <Modal.Dialog>
            <form noValidate onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
              <Modal.Header>
                <Modal.Heading>{isEdit ? "แก้ไขพนักงาน" : "เพิ่มพนักงาน"}</Modal.Heading>
                <p className="text-muted text-sm">บัญชีสำหรับพนักงานเข้าใช้งาน POS หน้าร้าน</p>
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
                        <Label>ชื่อ-นามสกุล</Label>
                        <Input placeholder="ชื่อพนักงาน" />
                        {fieldState.invalid && <ErrorMessage>{fieldState.error?.message}</ErrorMessage>}
                      </TextField>
                    )}
                  />
                  <Controller
                    control={form.control}
                    name="email"
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
                        <Input type="email" placeholder="staff@example.com" />
                        {fieldState.invalid && <ErrorMessage>{fieldState.error?.message}</ErrorMessage>}
                      </TextField>
                    )}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Controller
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <TextField name={field.name} value={field.value} onChange={field.onChange} fullWidth>
                        <Label>เบอร์โทร (ไม่บังคับ)</Label>
                        <Input placeholder="08xxxxxxxx" />
                      </TextField>
                    )}
                  />
                  <Controller
                    control={form.control}
                    name="password"
                    render={({ field, fieldState }) => (
                      <TextField
                        name={field.name}
                        value={field.value}
                        onChange={field.onChange}
                        onBlur={field.onBlur}
                        isInvalid={fieldState.invalid}
                        fullWidth
                      >
                        <Label>{isEdit ? "รหัสผ่านใหม่ (ไม่บังคับ)" : "รหัสผ่าน"}</Label>
                        <Input type="password" placeholder="••••••••" />
                        {fieldState.invalid && <ErrorMessage>{fieldState.error?.message}</ErrorMessage>}
                      </TextField>
                    )}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Controller
                    control={form.control}
                    name="role"
                    render={({ field }) => (
                      <div className="flex flex-col gap-1.5">
                        <Label>บทบาท</Label>
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
                              <ListBox.Item id="STAFF" textValue="พนักงาน">
                                พนักงาน
                              </ListBox.Item>
                              <ListBox.Item id="OWNER" textValue="เจ้าของร้าน">
                                เจ้าของร้าน
                              </ListBox.Item>
                            </ListBox>
                          </Select.Popover>
                        </Select>
                      </div>
                    )}
                  />
                  {isEdit && (
                    <Controller
                      control={form.control}
                      name="isActive"
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
                                <ListBox.Item id="true" textValue="ใช้งานอยู่">
                                  ใช้งานอยู่
                                </ListBox.Item>
                                <ListBox.Item id="false" textValue="ปิดใช้งาน">
                                  ปิดใช้งาน
                                </ListBox.Item>
                              </ListBox>
                            </Select.Popover>
                          </Select>
                        </div>
                      )}
                    />
                  )}
                </div>
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
