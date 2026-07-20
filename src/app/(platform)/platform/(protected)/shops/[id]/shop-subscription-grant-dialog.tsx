"use client";

import { useState } from "react";

import { Button, buttonVariants, ErrorMessage, Label, ListBox, Modal, Select, toast } from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarPlus, ChevronDown } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

import { grantShopSubscription } from "../actions";

interface PackageOption {
  id: string;
  name: string;
  priceThb: number;
}

const grantSchema = z.object({
  packageId: z.string().min(1, "เลือกแพ็กเกจ"),
});

export function ShopSubscriptionGrantDialog({ shopId, packages }: { shopId: string; packages: PackageOption[] }) {
  const [open, setOpen] = useState(false);
  const form = useForm<z.input<typeof grantSchema>, unknown, z.output<typeof grantSchema>>({
    resolver: zodResolver(grantSchema),
    defaultValues: { packageId: packages[0]?.id },
  });

  async function onSubmit(data: z.output<typeof grantSchema>) {
    const result = await grantShopSubscription(shopId, data.packageId);
    if (!result.success) {
      toast.danger(result.error);
      return;
    }
    toast.success("ให้/ต่ออายุแพ็กเกจแล้ว");
    setOpen(false);
  }

  return (
    <Modal isOpen={open} onOpenChange={setOpen}>
      <Modal.Trigger
        aria-label="ให้/ต่ออายุแพ็กเกจ"
        className={buttonVariants({
          variant: "secondary",
          size: "sm",
          className: "!inline-flex shrink-0 items-center justify-center",
        })}
      >
        <span className="inline-flex items-center gap-2 whitespace-nowrap">
          <CalendarPlus className="size-4" />
          ให้/ต่ออายุแพ็กเกจ
        </span>
      </Modal.Trigger>
      <Modal.Backdrop>
        <Modal.Container size="md">
          <Modal.Dialog>
            <form noValidate onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
              <Modal.Header>
                <Modal.Heading>ให้/ต่ออายุแพ็กเกจ</Modal.Heading>
              </Modal.Header>
              <Modal.Body className="flex flex-col gap-4">
                <Controller
                  control={form.control}
                  name="packageId"
                  render={({ field, fieldState }) => (
                    <div className="flex flex-col gap-1.5">
                      <Label>แพ็กเกจ</Label>
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
                            {packages.map((pkg) => (
                              <ListBox.Item key={pkg.id} id={pkg.id} textValue={pkg.name}>
                                {pkg.name} — ฿{pkg.priceThb.toLocaleString("th-TH")}
                              </ListBox.Item>
                            ))}
                          </ListBox>
                        </Select.Popover>
                      </Select>
                      {fieldState.invalid && <ErrorMessage>{fieldState.error?.message}</ErrorMessage>}
                    </div>
                  )}
                />
              </Modal.Body>
              <Modal.Footer>
                <Modal.CloseTrigger className={buttonVariants({ variant: "secondary" })}>ยกเลิก</Modal.CloseTrigger>
                <Button type="submit" isDisabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting ? "กำลังบันทึก..." : "ยืนยัน"}
                </Button>
              </Modal.Footer>
            </form>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
}
