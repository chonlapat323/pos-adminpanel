"use client";

import { useState } from "react";

import {
  Button,
  buttonVariants,
  Checkbox,
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

import { createPlatformAdminAccount, updatePlatformAdminAccount } from "./actions";

interface RoleOption {
  id: string;
  name: string;
}

function buildAdminSchema(isEdit: boolean) {
  return z.object({
    name: z.string().min(1, "กรอกชื่อ"),
    email: z.email("กรอกอีเมลให้ถูกต้อง"),
    password: isEdit
      ? z.union([z.literal(""), z.string().min(6, "รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร")])
      : z.string().min(6, "รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร"),
    roleId: z.string(),
    isSuperAdmin: z.boolean(),
  });
}

interface AdminFormDialogProps {
  roles: RoleOption[];
  admin?: {
    id: string;
    name: string;
    email: string;
    roleId: string | null;
    isSuperAdmin: boolean;
  };
}

export function AdminFormDialog({ roles, admin }: AdminFormDialogProps) {
  const isEdit = Boolean(admin);
  const [open, setOpen] = useState(false);
  const adminSchema = buildAdminSchema(isEdit);
  const form = useForm<z.infer<typeof adminSchema>>({
    resolver: zodResolver(adminSchema),
    defaultValues: {
      name: admin?.name ?? "",
      email: admin?.email ?? "",
      password: "",
      roleId: admin?.roleId ?? "__none__",
      isSuperAdmin: admin?.isSuperAdmin ?? false,
    },
  });

  async function onSubmit(data: z.infer<typeof adminSchema>) {
    const roleId = data.roleId === "__none__" ? null : data.roleId;
    const result = admin
      ? await updatePlatformAdminAccount(admin.id, {
          name: data.name,
          email: data.email,
          password: data.password || undefined,
          roleId,
          isSuperAdmin: data.isSuperAdmin,
        })
      : await createPlatformAdminAccount({
          name: data.name,
          email: data.email,
          password: data.password,
          roleId,
          isSuperAdmin: data.isSuperAdmin,
        });
    if (!result.success) {
      toast.danger(result.error);
      return;
    }
    toast.success(isEdit ? "แก้ไข admin แล้ว" : "เพิ่ม admin แล้ว");
    if (!isEdit) form.reset();
    setOpen(false);
  }

  return (
    <Modal isOpen={open} onOpenChange={setOpen}>
      <Modal.Trigger
        aria-label={isEdit ? "แก้ไข admin" : "เพิ่ม admin"}
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
            เพิ่ม Admin
          </span>
        )}
      </Modal.Trigger>
      <Modal.Backdrop>
        <Modal.Container size="lg">
          <Modal.Dialog>
            <form noValidate onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
              <Modal.Header>
                <Modal.Heading>{isEdit ? "แก้ไข Platform Admin" : "เพิ่ม Platform Admin"}</Modal.Heading>
                <p className="text-muted text-sm">บัญชีสำหรับทีมงานกลางเข้าจัดการแพลตฟอร์ม</p>
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
                        <Label>ชื่อ</Label>
                        <Input placeholder="ชื่อ admin" />
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
                        <Input type="email" placeholder="admin@example.com" />
                        {fieldState.invalid && <ErrorMessage>{fieldState.error?.message}</ErrorMessage>}
                      </TextField>
                    )}
                  />
                </div>
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
                <Controller
                  control={form.control}
                  name="roleId"
                  render={({ field }) => (
                    <div className="flex flex-col gap-1.5">
                      <Label>Role (สิทธิ์การใช้งาน)</Label>
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
                            <ListBox.Item id="__none__" textValue="ไม่มี">
                              ไม่มี
                            </ListBox.Item>
                            {roles.map((role) => (
                              <ListBox.Item key={role.id} id={role.id} textValue={role.name}>
                                {role.name}
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
                  name="isSuperAdmin"
                  render={({ field }) => (
                    <Checkbox isSelected={field.value} onChange={field.onChange}>
                      <Checkbox.Content>
                        <Checkbox.Control>
                          <Checkbox.Indicator />
                        </Checkbox.Control>
                        Super-admin (มีสิทธิ์เต็มทุกอย่าง ไม่ขึ้นกับ role)
                      </Checkbox.Content>
                    </Checkbox>
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
