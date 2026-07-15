"use client";

import { useState } from "react";

import { Button, buttonVariants, Checkbox, ErrorMessage, Input, Label, Modal, TextField, toast } from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Pencil, Plus } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

import { createRole, updateRole } from "./actions";

interface PermissionOption {
  key: string;
  label: string;
}

const roleSchema = z.object({
  name: z.string().min(1, "กรอกชื่อ role"),
  permissions: z.array(z.string()),
});

interface RoleFormDialogProps {
  catalog: PermissionOption[];
  role?: { id: string; name: string; permissions: string[] };
}

export function RoleFormDialog({ catalog, role }: RoleFormDialogProps) {
  const isEdit = Boolean(role);
  const [open, setOpen] = useState(false);
  const form = useForm<z.infer<typeof roleSchema>>({
    resolver: zodResolver(roleSchema),
    defaultValues: {
      name: role?.name ?? "",
      permissions: role?.permissions ?? [],
    },
  });

  async function onSubmit(data: z.infer<typeof roleSchema>) {
    const result = role ? await updateRole(role.id, data) : await createRole(data);
    if (!result.success) {
      toast.danger(result.error);
      return;
    }
    toast.success(isEdit ? "แก้ไข role แล้ว" : "เพิ่ม role แล้ว");
    if (!isEdit) form.reset();
    setOpen(false);
  }

  return (
    <Modal isOpen={open} onOpenChange={setOpen}>
      <Modal.Trigger
        aria-label={isEdit ? "แก้ไข role" : "เพิ่ม role"}
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
            เพิ่ม Role
          </span>
        )}
      </Modal.Trigger>
      <Modal.Backdrop>
        <Modal.Container size="md">
          <Modal.Dialog>
            <form noValidate onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
              <Modal.Header>
                <Modal.Heading>{isEdit ? "แก้ไข Role" : "เพิ่ม Role"}</Modal.Heading>
                <p className="text-muted text-sm">กำหนดชื่อและสิทธิ์การใช้งานของพนักงานที่ได้รับ role นี้</p>
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
                      <Label>ชื่อ Role</Label>
                      <Input placeholder="เช่น พนักงานแคชเชียร์" />
                      {fieldState.invalid && <ErrorMessage>{fieldState.error?.message}</ErrorMessage>}
                    </TextField>
                  )}
                />
                <Controller
                  control={form.control}
                  name="permissions"
                  render={({ field }) => (
                    <div className="flex flex-col gap-1">
                      <Label>สิทธิ์การใช้งาน</Label>
                      <div className="flex flex-col gap-2 rounded-lg border border-border p-3">
                        {catalog.map((perm) => (
                          <Checkbox
                            key={perm.key}
                            isSelected={field.value.includes(perm.key)}
                            onChange={(checked) => {
                              const next = checked
                                ? [...field.value, perm.key]
                                : field.value.filter((k) => k !== perm.key);
                              field.onChange(next);
                            }}
                          >
                            <Checkbox.Content>
                              <Checkbox.Control>
                                <Checkbox.Indicator />
                              </Checkbox.Control>
                              {perm.label}
                            </Checkbox.Content>
                          </Checkbox>
                        ))}
                      </div>
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
