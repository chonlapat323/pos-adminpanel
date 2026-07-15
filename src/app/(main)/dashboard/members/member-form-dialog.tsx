"use client";

import { useState } from "react";

import { Button, buttonVariants, ErrorMessage, Input, Label, Modal, TextArea, TextField, toast } from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Pencil, Plus } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

import { createMember, type MemberInput, updateMember } from "./actions";

const memberSchema = z.object({
  name: z.string().min(1, "กรอกชื่อสมาชิก"),
  phone: z.string().min(1, "กรอกเบอร์โทร"),
  birthday: z.string().optional(),
  address: z.string().optional(),
  note: z.string().optional(),
});

interface MemberFormDialogProps {
  member?: {
    id: string;
    name: string;
    phone: string;
    birthday: string | null;
    address: string | null;
    note: string | null;
  };
}

export function MemberFormDialog({ member }: MemberFormDialogProps) {
  const isEdit = Boolean(member);
  const [open, setOpen] = useState(false);
  const form = useForm<z.infer<typeof memberSchema>>({
    resolver: zodResolver(memberSchema),
    defaultValues: {
      name: member?.name ?? "",
      phone: member?.phone ?? "",
      birthday: member?.birthday ? member.birthday.slice(0, 10) : "",
      address: member?.address ?? "",
      note: member?.note ?? "",
    },
  });

  async function onSubmit(data: z.infer<typeof memberSchema>) {
    const input: MemberInput = {
      name: data.name,
      phone: data.phone,
      birthday: data.birthday || undefined,
      address: data.address || undefined,
      note: data.note || undefined,
    };
    const result = member ? await updateMember(member.id, input) : await createMember(input);
    if (!result.success) {
      toast.danger(result.error);
      return;
    }
    toast.success(isEdit ? "แก้ไขสมาชิกแล้ว" : "เพิ่มสมาชิกแล้ว");
    if (!isEdit) form.reset();
    setOpen(false);
  }

  return (
    <Modal isOpen={open} onOpenChange={setOpen}>
      <Modal.Trigger
        aria-label={isEdit ? "แก้ไขสมาชิก" : "เพิ่มสมาชิก"}
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
            เพิ่มสมาชิก
          </span>
        )}
      </Modal.Trigger>
      <Modal.Backdrop>
        <Modal.Container size="lg">
          <Modal.Dialog>
            <form noValidate onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
              <Modal.Header>
                <Modal.Heading>{isEdit ? "แก้ไขสมาชิก" : "เพิ่มสมาชิก"}</Modal.Heading>
                <p className="text-muted text-sm">ข้อมูลสมาชิกสำหรับสะสม/แลก point และประวัติการใช้บริการ</p>
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
                        <Input placeholder="ชื่อสมาชิก" />
                        {fieldState.invalid && <ErrorMessage>{fieldState.error?.message}</ErrorMessage>}
                      </TextField>
                    )}
                  />
                  <Controller
                    control={form.control}
                    name="phone"
                    render={({ field, fieldState }) => (
                      <TextField
                        name={field.name}
                        value={field.value}
                        onChange={field.onChange}
                        onBlur={field.onBlur}
                        isInvalid={fieldState.invalid}
                        fullWidth
                      >
                        <Label>เบอร์โทร</Label>
                        <Input placeholder="08xxxxxxxx" />
                        {fieldState.invalid && <ErrorMessage>{fieldState.error?.message}</ErrorMessage>}
                      </TextField>
                    )}
                  />
                </div>
                <Controller
                  control={form.control}
                  name="birthday"
                  render={({ field }) => (
                    <TextField name={field.name} value={field.value} onChange={field.onChange} fullWidth>
                      <Label>วันเกิด (ไม่บังคับ)</Label>
                      <Input type="date" />
                    </TextField>
                  )}
                />
                <Controller
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <TextField name={field.name} value={field.value} onChange={field.onChange} fullWidth>
                      <Label>ที่อยู่ (ไม่บังคับ)</Label>
                      <Input placeholder="ที่อยู่สมาชิก" />
                    </TextField>
                  )}
                />
                <Controller
                  control={form.control}
                  name="note"
                  render={({ field }) => (
                    <TextField name={field.name} value={field.value} onChange={field.onChange} fullWidth>
                      <Label>หมายเหตุ (ไม่บังคับ)</Label>
                      <TextArea placeholder="เช่น แพ้ผลิตภัณฑ์บางชนิด, ชอบทำสีอะไรเป็นพิเศษ" />
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
