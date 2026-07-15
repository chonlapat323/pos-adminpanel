"use client";

import { useRef, useState } from "react";

import { Button, buttonVariants, Modal, toast } from "@heroui/react";
import { Camera, ImageOff, Upload } from "lucide-react";

import { DeleteConfirmButton } from "@/components/delete-confirm-button";
import { uploadImage } from "@/lib/upload";

import { createVisitPhoto, deleteVisitPhoto, getVisitPhotos, type VisitPhoto } from "./visit-photos-actions";

interface VisitPhotosDialogProps {
  memberId: string;
  memberName: string;
}

export function VisitPhotosDialog({ memberId, memberName }: VisitPhotosDialogProps) {
  const [open, setOpen] = useState(false);
  const [photos, setPhotos] = useState<VisitPhoto[] | null>(null);
  const [uploadingType, setUploadingType] = useState<"BEFORE" | "AFTER" | null>(null);

  async function loadPhotos() {
    const result = await getVisitPhotos(memberId);
    if (!result.success) {
      toast.danger(result.error);
      return;
    }
    setPhotos(result.data);
  }

  function handleOpenChange(next: boolean) {
    setOpen(next);
    if (next) void loadPhotos();
  }

  async function handleUpload(type: "BEFORE" | "AFTER", file: File) {
    setUploadingType(type);
    try {
      const formData = new FormData();
      formData.set("file", file);
      const uploadResult = await uploadImage(formData);
      if (!uploadResult.success) {
        toast.danger(uploadResult.error);
        return;
      }
      const createResult = await createVisitPhoto({ memberId, type, imageUrl: uploadResult.url });
      if (!createResult.success) {
        toast.danger(createResult.error);
        return;
      }
      toast.success(type === "BEFORE" ? "เพิ่มรูปก่อนใช้บริการแล้ว" : "เพิ่มรูปหลังใช้บริการแล้ว");
      await loadPhotos();
    } finally {
      setUploadingType(null);
    }
  }

  async function handleDelete(id: string) {
    const result = await deleteVisitPhoto(id);
    if (result.success) await loadPhotos();
    return result;
  }

  const beforePhotos = photos?.filter((p) => p.type === "BEFORE") ?? [];
  const afterPhotos = photos?.filter((p) => p.type === "AFTER") ?? [];

  return (
    <Modal isOpen={open} onOpenChange={handleOpenChange}>
      <Modal.Trigger
        aria-label="รูปก่อน-หลังใช้บริการ"
        className={buttonVariants({
          variant: "secondary",
          size: "sm",
          isIconOnly: true,
          className: "!inline-flex shrink-0 items-center justify-center",
        })}
      >
        <Camera className="size-4" />
      </Modal.Trigger>
      <Modal.Backdrop>
        <Modal.Container size="lg">
          <Modal.Dialog>
            <Modal.Header>
              <Modal.Heading>รูปก่อน-หลังใช้บริการ</Modal.Heading>
              <p className="text-muted text-sm">{memberName}</p>
            </Modal.Header>
            <Modal.Body className="flex flex-col gap-4">
              {photos === null ? (
                <p className="text-muted text-sm">กำลังโหลด...</p>
              ) : (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <PhotoSection
                    label="ก่อนใช้บริการ"
                    photos={beforePhotos}
                    onDelete={handleDelete}
                    onUpload={(file) => handleUpload("BEFORE", file)}
                    uploading={uploadingType === "BEFORE"}
                  />
                  <PhotoSection
                    label="หลังใช้บริการ"
                    photos={afterPhotos}
                    onDelete={handleDelete}
                    onUpload={(file) => handleUpload("AFTER", file)}
                    uploading={uploadingType === "AFTER"}
                    showLatestBadge
                  />
                </div>
              )}
            </Modal.Body>
            <Modal.Footer>
              <Modal.CloseTrigger className={buttonVariants({ variant: "secondary" })}>ปิด</Modal.CloseTrigger>
            </Modal.Footer>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
}

interface PhotoSectionProps {
  label: string;
  photos: VisitPhoto[];
  onDelete: (id: string) => Promise<{ success: true } | { success: false; error: string }>;
  onUpload: (file: File) => void;
  uploading: boolean;
  showLatestBadge?: boolean;
}

function PhotoSection({ label, photos, onDelete, onUpload, uploading, showLatestBadge }: PhotoSectionProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) onUpload(file);
    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <div className="flex flex-col gap-2 rounded-lg border border-border p-3">
      <div className="flex items-center justify-between gap-2">
        <p className="font-medium text-sm">{label}</p>
        <Button
          type="button"
          variant="secondary"
          size="sm"
          isDisabled={uploading}
          onPress={() => inputRef.current?.click()}
        >
          <Upload className="size-4" />
          {uploading ? "กำลังอัปโหลด..." : "เพิ่มรูป"}
        </Button>
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>
      {photos.length === 0 ? (
        <div className="flex flex-col items-center gap-1 py-6 text-center">
          <ImageOff className="size-5 text-muted" />
          <p className="text-muted text-xs">ยังไม่มีรูป</p>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-2">
          {photos.map((photo, index) => (
            <div
              key={photo.id}
              className="group relative aspect-square overflow-hidden rounded-lg border border-border bg-default"
            >
              {/* biome-ignore lint/performance/noImgElement: local dev image server, next/image remote-pattern config not worth it yet */}
              <img src={photo.imageUrl} alt="" className="size-full object-cover" />
              {showLatestBadge && index === 0 && (
                <span className="absolute top-1 left-1 rounded bg-primary px-1.5 py-0.5 text-[10px] text-primary-foreground">
                  ล่าสุด
                </span>
              )}
              <div className="absolute top-1 right-1 opacity-0 transition-opacity group-hover:opacity-100">
                <DeleteConfirmButton
                  title="ลบรูป"
                  description="ยืนยันลบรูปนี้"
                  successMessage="ลบรูปแล้ว"
                  onConfirm={() => onDelete(photo.id)}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
