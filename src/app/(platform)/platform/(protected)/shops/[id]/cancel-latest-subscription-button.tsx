"use client";

import { useState, useTransition } from "react";

import { AlertDialog, Button, buttonVariants, toast } from "@heroui/react";
import { Undo2 } from "lucide-react";

import { cancelLatestShopSubscription } from "../actions";

export function CancelLatestSubscriptionButton({ shopId }: { shopId: string }) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleConfirm() {
    startTransition(async () => {
      const result = await cancelLatestShopSubscription(shopId);
      if (!result.success) {
        toast.danger(result.error);
        return;
      }
      toast.success("ยกเลิกรายการล่าสุดแล้ว");
      setOpen(false);
    });
  }

  return (
    <AlertDialog isOpen={open} onOpenChange={setOpen}>
      <AlertDialog.Trigger
        aria-label="ยกเลิกรายการล่าสุด"
        className={buttonVariants({
          variant: "danger-soft",
          size: "sm",
          className: "!inline-flex shrink-0 items-center justify-center",
        })}
      >
        <span className="inline-flex items-center gap-2 whitespace-nowrap">
          <Undo2 className="size-4" />
          ยกเลิกรายการล่าสุด
        </span>
      </AlertDialog.Trigger>
      <AlertDialog.Backdrop>
        <AlertDialog.Container>
          <AlertDialog.Dialog>
            <AlertDialog.Header>
              <AlertDialog.Icon status="danger" />
              <AlertDialog.Heading>ยกเลิกรายการ subscription ล่าสุด</AlertDialog.Heading>
            </AlertDialog.Header>
            <AlertDialog.Body>
              ใช้สำหรับกรณีเจ้าของร้านกดซื้อ/ต่ออายุแพ็กเกจผิด ระบบจะย้อนสถานะ subscription ของร้านนี้กลับไปเป็นก่อนหน้ารายการล่าสุด
              (ไม่คืนเงินอัตโนมัติ — ถ้าจ่ายเงินจริงไปแล้วต้องคืนเงินแยกต่างหากเอง) ยกเลิกได้เฉพาะรายการล่าสุดเท่านั้น
            </AlertDialog.Body>
            <AlertDialog.Footer>
              <AlertDialog.CloseTrigger className={buttonVariants({ variant: "secondary" })}>
                ปิด
              </AlertDialog.CloseTrigger>
              <Button variant="danger" isDisabled={isPending} onPress={handleConfirm}>
                {isPending ? "กำลังยกเลิก..." : "ยืนยันยกเลิก"}
              </Button>
            </AlertDialog.Footer>
          </AlertDialog.Dialog>
        </AlertDialog.Container>
      </AlertDialog.Backdrop>
    </AlertDialog>
  );
}
