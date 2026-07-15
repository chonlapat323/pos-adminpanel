"use server";

import { getToken } from "./auth";
import { getPlatformToken } from "./platform-auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3010";

export type UploadResult = { success: true; url: string } | { success: false; error: string };

export async function uploadImage(formData: FormData): Promise<UploadResult> {
  const token = await getToken();
  if (!token) return { success: false, error: "กรุณาเข้าสู่ระบบใหม่" };

  try {
    const res = await fetch(`${API_URL}/uploads`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });

    if (!res.ok) {
      const body = await res.json().catch(() => null);
      return { success: false, error: body?.message ?? "อัปโหลดรูปไม่สำเร็จ" };
    }

    const data = (await res.json()) as { url: string };
    return { success: true, url: data.url };
  } catch {
    return { success: false, error: "ไม่สามารถเชื่อมต่อ pos-backend ได้" };
  }
}

export async function uploadPlatformImage(formData: FormData, shopId: string): Promise<UploadResult> {
  const token = await getPlatformToken();
  if (!token) return { success: false, error: "กรุณาเข้าสู่ระบบใหม่" };
  if (!shopId) return { success: false, error: "กรุณาเลือกร้านก่อน" };

  try {
    const res = await fetch(`${API_URL}/platform/uploads?shopId=${encodeURIComponent(shopId)}`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });

    if (!res.ok) {
      const body = await res.json().catch(() => null);
      return { success: false, error: body?.message ?? "อัปโหลดรูปไม่สำเร็จ" };
    }

    const data = (await res.json()) as { url: string };
    return { success: true, url: data.url };
  } catch {
    return { success: false, error: "ไม่สามารถเชื่อมต่อ pos-backend ได้" };
  }
}
