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

import { ShopSelectField } from "@/components/shop-select-field";

import { createPlatformReward, updatePlatformReward } from "./actions";

interface ShopOption {
  id: string;
  name: string;
}

const rewardSchema = z.object({
  shopId: z.string().min(1, "เลือกร้าน"),
  name: z.string().min(1, "กรอกชื่อรางวัล"),
  description: z.string().optional(),
  pointCost: z.coerce.number().int().min(1, "ต้องใช้อย่างน้อย 1 point"),
  isActive: z.enum(["true", "false"]),
});

interface RewardFormDialogProps {
  shops: ShopOption[];
  reward?: {
    id: string;
    name: string;
    description: string | null;
    pointCost: number;
    isActive: boolean;
    shop: ShopOption;
  };
}

export function RewardFormDialog({ shops, reward }: RewardFormDialogProps) {
  const isEdit = Boolean(reward);
  const [open, setOpen] = useState(false);
  const form = useForm<z.input<typeof rewardSchema>, unknown, z.output<typeof rewardSchema>>({
    resolver: zodResolver(rewardSchema),
    defaultValues: {
      shopId: reward?.shop.id ?? "",
      name: reward?.name ?? "",
      description: reward?.description ?? "",
      pointCost: reward?.pointCost ?? 1,
      isActive: reward ? (reward.isActive ? "true" : "false") : "true",
    },
  });

  async function onSubmit(data: z.output<typeof rewardSchema>) {
    const payload = {
      name: data.name,
      description: data.description || undefined,
      pointCost: data.pointCost,
      isActive: data.isActive === "true",
    };
    const result = reward
      ? await updatePlatformReward(reward.id, payload)
      : await createPlatformReward({ shopId: data.shopId, ...payload });
    if (!result.success) {
      toast.danger(result.error);
      return;
    }
    toast.success(isEdit ? "แก้ไขรางวัลแล้ว" : "เพิ่มรางวัลแล้ว");
    if (!isEdit) form.reset();
    setOpen(false);
  }

  return (
    <Modal isOpen={open} onOpenChange={setOpen}>
      <Modal.Trigger
        aria-label={isEdit ? "แก้ไขรางวัล" : "เพิ่มรางวัล"}
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
            เพิ่มรางวัล
          </span>
        )}
      </Modal.Trigger>
      <Modal.Backdrop>
        <Modal.Container size="lg">
          <Modal.Dialog>
            <form noValidate onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
              <Modal.Header>
                <Modal.Heading>{isEdit ? "แก้ไขรางวัล" : "เพิ่มรางวัล"}</Modal.Heading>
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
                      <Label>ชื่อรางวัล</Label>
                      <Input placeholder="เช่น สระผมฟรี" />
                      {fieldState.invalid && <ErrorMessage>{fieldState.error?.message}</ErrorMessage>}
                    </TextField>
                  )}
                />
                <Controller
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <TextField name={field.name} value={field.value} onChange={field.onChange} fullWidth>
                      <Label>คำอธิบาย (ไม่บังคับ)</Label>
                      <TextArea placeholder="รายละเอียดรางวัล" />
                    </TextField>
                  )}
                />
                <div className="grid grid-cols-2 gap-4">
                  <Controller
                    control={form.control}
                    name="pointCost"
                    render={({ field, fieldState }) => (
                      <TextField
                        name={field.name}
                        value={field.value as unknown as string}
                        onChange={field.onChange}
                        onBlur={field.onBlur}
                        isInvalid={fieldState.invalid}
                        fullWidth
                      >
                        <Label>ใช้ point</Label>
                        <Input type="number" min={1} />
                        {fieldState.invalid && <ErrorMessage>{fieldState.error?.message}</ErrorMessage>}
                      </TextField>
                    )}
                  />
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
                              <ListBox.Item id="true" textValue="เปิดใช้งาน">
                                เปิดใช้งาน
                              </ListBox.Item>
                              <ListBox.Item id="false" textValue="ปิด">
                                ปิด
                              </ListBox.Item>
                            </ListBox>
                          </Select.Popover>
                        </Select>
                      </div>
                    )}
                  />
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
