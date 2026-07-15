"use server";

import { revalidatePath } from "next/cache";

import { ApiError, apiFetch } from "@/lib/api";

export interface VisitPhoto {
  id: string;
  type: "BEFORE" | "AFTER";
  imageUrl: string;
  createdAt: string;
}

type ActionResult = { success: true } | { success: false; error: string };
type FetchResult = { success: true; data: VisitPhoto[] } | { success: false; error: string };

export async function getVisitPhotos(memberId: string): Promise<FetchResult> {
  try {
    const data = await apiFetch<VisitPhoto[]>(`/photos?memberId=${memberId}`);
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error instanceof ApiError ? error.message : "โหลดรูปไม่สำเร็จ" };
  }
}

export async function createVisitPhoto(input: {
  memberId: string;
  type: "BEFORE" | "AFTER";
  imageUrl: string;
}): Promise<ActionResult> {
  try {
    await apiFetch("/photos", { method: "POST", body: JSON.stringify(input) });
    revalidatePath("/dashboard/members");
    return { success: true };
  } catch (error) {
    return { success: false, error: error instanceof ApiError ? error.message : "เพิ่มรูปไม่สำเร็จ" };
  }
}

export async function deleteVisitPhoto(id: string): Promise<ActionResult> {
  try {
    await apiFetch(`/photos/${id}`, { method: "DELETE" });
    revalidatePath("/dashboard/members");
    return { success: true };
  } catch (error) {
    return { success: false, error: error instanceof ApiError ? error.message : "ลบรูปไม่สำเร็จ" };
  }
}
