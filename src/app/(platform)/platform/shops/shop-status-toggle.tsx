"use client";

import { useTransition } from "react";

import { Button, toast } from "@heroui/react";

import { updateShopStatus } from "./actions";

export function ShopStatusToggle({ shopId, isActive }: { shopId: string; isActive: boolean }) {
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    startTransition(async () => {
      const result = await updateShopStatus(shopId, !isActive);
      if (!result.success) {
        toast.danger(result.error);
        return;
      }
      toast.success(isActive ? "ระงับร้านแล้ว" : "เปิดใช้งานร้านแล้ว");
    });
  }

  return (
    <Button
      variant={isActive ? "danger-soft" : "secondary"}
      size="sm"
      isDisabled={isPending}
      onPress={handleClick}
    >
      {isActive ? "ระงับร้าน" : "เปิดใช้งาน"}
    </Button>
  );
}
