"use client";

import { Button, ErrorMessage, Input, Label, TextField, toast } from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

import { updatePlatformSetting } from "./actions";

const schema = z.object({
  omisePublicKey: z.string().min(1, "กรอกคีย์ Omise public key"),
});

export function SettingsForm({ omisePublicKey }: { omisePublicKey: string | null }) {
  const form = useForm<z.input<typeof schema>, unknown, z.output<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { omisePublicKey: omisePublicKey ?? "" },
  });

  async function onSubmit(data: z.output<typeof schema>) {
    const result = await updatePlatformSetting("OMISE_PUBLIC_KEY", data.omisePublicKey);
    if (!result.success) {
      toast.danger(result.error);
      return;
    }
    toast.success("บันทึกแล้ว");
  }

  return (
    <form noValidate onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <Controller
        control={form.control}
        name="omisePublicKey"
        render={({ field, fieldState }) => (
          <TextField
            name={field.name}
            value={field.value}
            onChange={field.onChange}
            onBlur={field.onBlur}
            isInvalid={fieldState.invalid}
            fullWidth
          >
            <Label>Omise Public Key</Label>
            <Input placeholder="pkey_live_... หรือ pkey_test_..." />
            {fieldState.invalid && <ErrorMessage>{fieldState.error?.message}</ErrorMessage>}
          </TextField>
        )}
      />
      <p className="text-muted text-sm">แอปมือถือจะดึงค่านี้ไปใช้ตอนเปิดแอปเลย ไม่ต้อง build/ส่งขึ้น Play Store ใหม่เวลาเปลี่ยนคีย์</p>
      <div>
        <Button type="submit" isDisabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? "กำลังบันทึก..." : "บันทึก"}
        </Button>
      </div>
    </form>
  );
}
