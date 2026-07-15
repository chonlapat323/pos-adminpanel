"use client";

import { useRef, useState } from "react";

import { Button, Label, toast } from "@heroui/react";
import { ImageOff, Upload } from "lucide-react";

import { type UploadResult, uploadImage } from "@/lib/upload";

interface ImageUploadFieldProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  /** Overrides the shop-admin upload action — pass this on platform-admin forms, e.g. `(fd) => uploadPlatformImage(fd, shopId)`. */
  upload?: (formData: FormData) => Promise<UploadResult>;
  isDisabled?: boolean;
}

export function ImageUploadField({
  value,
  onChange,
  label = "รูปภาพ",
  upload = uploadImage,
  isDisabled = false,
}: ImageUploadFieldProps) {
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.set("file", file);
      const result = await upload(formData);
      if (!result.success) {
        toast.danger(result.error);
        return;
      }
      onChange(result.url);
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div className="flex flex-col gap-1.5">
      <Label>{label}</Label>
      <div className="flex items-center gap-3">
        <div className="flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-border bg-default">
          {value ? (
            // biome-ignore lint/performance/noImgElement: local dev image server, next/image remote-pattern config not worth it yet
            <img src={value} alt="" className="size-full object-cover" />
          ) : (
            <ImageOff className="size-5 text-muted" />
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            isDisabled={uploading || isDisabled}
            onPress={() => inputRef.current?.click()}
          >
            <Upload className="size-4" />
            {uploading ? "กำลังอัปโหลด..." : value ? "เปลี่ยนรูป" : "อัปโหลดรูป"}
          </Button>
          {value && (
            <Button type="button" variant="ghost" size="sm" onPress={() => onChange("")}>
              ลบรูป
            </Button>
          )}
        </div>
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          disabled={isDisabled}
          onChange={handleFileChange}
        />
      </div>
    </div>
  );
}
