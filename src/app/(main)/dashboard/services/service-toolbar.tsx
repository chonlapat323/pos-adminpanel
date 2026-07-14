"use client";

import { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

import { createService } from "./actions";

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

export function ServiceToolbar({ categories }: { categories: Category[] }) {
  const [open, setOpen] = useState(false);
  const form = useForm<z.input<typeof serviceSchema>, unknown, z.output<typeof serviceSchema>>({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      categoryId: "",
      name: "",
      description: "",
      price: 0,
      durationMinutes: 30,
      status: "ACTIVE",
    },
  });

  async function onSubmit(data: z.output<typeof serviceSchema>) {
    const result = await createService(data);
    if (!result.success) {
      toast.error(result.error);
      return;
    }
    toast.success("เพิ่มบริการแล้ว");
    form.reset();
    setOpen(false);
  }

  function handleOpenChange(next: boolean) {
    if (next && categories.length === 0) {
      toast.error("กรุณาเพิ่มกลุ่มบริการก่อน", { description: "ไปที่เมนู “กลุ่มบริการ” เพื่อเพิ่มก่อน" });
      return;
    }
    setOpen(next);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button>
          <Plus /> เพิ่มบริการ
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>เพิ่มบริการ</DialogTitle>
          <DialogDescription>กรอกรายละเอียดบริการที่ร้านเปิดให้จอง</DialogDescription>
        </DialogHeader>
        <form noValidate onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <FieldGroup className="gap-4">
            <Controller
              control={form.control}
              name="categoryId"
              render={({ field, fieldState }) => (
                <Field className="gap-1.5" data-invalid={fieldState.invalid}>
                  <FieldLabel>กลุ่มบริการ</FieldLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger aria-invalid={fieldState.invalid}>
                      <SelectValue placeholder="เลือกกลุ่มบริการ" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            <Controller
              control={form.control}
              name="name"
              render={({ field, fieldState }) => (
                <Field className="gap-1.5" data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="service-name">ชื่อบริการ</FieldLabel>
                  <Input {...field} id="service-name" placeholder="เช่น ทาสีเล็บ" aria-invalid={fieldState.invalid} />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            <Controller
              control={form.control}
              name="description"
              render={({ field }) => (
                <Field className="gap-1.5">
                  <FieldLabel htmlFor="service-description">คำอธิบาย (ไม่บังคับ)</FieldLabel>
                  <Textarea {...field} id="service-description" placeholder="รายละเอียดบริการ" />
                </Field>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <Controller
                control={form.control}
                name="price"
                render={({ field, fieldState }) => (
                  <Field className="gap-1.5" data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="service-price">ราคา (บาท)</FieldLabel>
                    <Input
                      {...field}
                      value={field.value as number}
                      id="service-price"
                      type="number"
                      min={0}
                      aria-invalid={fieldState.invalid}
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
              <Controller
                control={form.control}
                name="durationMinutes"
                render={({ field, fieldState }) => (
                  <Field className="gap-1.5" data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="service-duration">ระยะเวลา (นาที)</FieldLabel>
                    <Input
                      {...field}
                      value={field.value as number}
                      id="service-duration"
                      type="number"
                      min={1}
                      aria-invalid={fieldState.invalid}
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
            </div>
            <Controller
              control={form.control}
              name="status"
              render={({ field }) => (
                <Field className="gap-1.5">
                  <FieldLabel>สถานะ</FieldLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ACTIVE">เปิดใช้งาน</SelectItem>
                      <SelectItem value="INACTIVE">ปิด</SelectItem>
                      <SelectItem value="PROMOTION">โปรโมชัน</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>
              )}
            />
          </FieldGroup>
          <DialogFooter>
            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? "กำลังบันทึก..." : "บันทึก"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
