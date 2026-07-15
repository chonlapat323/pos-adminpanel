"use client";

import { useState, useTransition } from "react";

import { AlertDialog, Button, buttonVariants, toast } from "@heroui/react";
import { Trash2 } from "lucide-react";

type ActionResult = { success: true } | { success: false; error: string };

interface DeleteConfirmButtonProps {
  title: string;
  description: string;
  successMessage: string;
  onConfirm: () => Promise<ActionResult>;
}

export function DeleteConfirmButton({ title, description, successMessage, onConfirm }: DeleteConfirmButtonProps) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleConfirm() {
    startTransition(async () => {
      const result = await onConfirm();
      if (!result.success) {
        toast.danger(result.error);
        return;
      }
      toast.success(successMessage);
      setOpen(false);
    });
  }

  return (
    <AlertDialog isOpen={open} onOpenChange={setOpen}>
      <AlertDialog.Trigger
        aria-label="ลบ"
        className={buttonVariants({
          variant: "danger-soft",
          size: "sm",
          isIconOnly: true,
          className: "!inline-flex shrink-0 items-center justify-center",
        })}
      >
        <Trash2 className="size-4" />
      </AlertDialog.Trigger>
      <AlertDialog.Backdrop>
        <AlertDialog.Container>
          <AlertDialog.Dialog>
            <AlertDialog.Header>
              <AlertDialog.Icon status="danger" />
              <AlertDialog.Heading>{title}</AlertDialog.Heading>
            </AlertDialog.Header>
            <AlertDialog.Body>{description}</AlertDialog.Body>
            <AlertDialog.Footer>
              <AlertDialog.CloseTrigger className={buttonVariants({ variant: "secondary" })}>
                ยกเลิก
              </AlertDialog.CloseTrigger>
              <Button variant="danger" isDisabled={isPending} onPress={handleConfirm}>
                {isPending ? "กำลังลบ..." : "ลบ"}
              </Button>
            </AlertDialog.Footer>
          </AlertDialog.Dialog>
        </AlertDialog.Container>
      </AlertDialog.Backdrop>
    </AlertDialog>
  );
}
