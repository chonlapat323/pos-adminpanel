"use server";

import { revalidatePath } from "next/cache";

import { ApiError, apiFetch } from "@/lib/api";

export interface ServiceInput {
  categoryId: string;
  name: string;
  description?: string;
  price: number;
  durationMinutes: number;
  status: "ACTIVE" | "INACTIVE" | "PROMOTION";
  imageUrl?: string;
}

type ActionResult = { success: true } | { success: false; error: string };

export async function createService(input: ServiceInput): Promise<ActionResult> {
  try {
    await apiFetch("/services", { method: "POST", body: JSON.stringify(input) });
    revalidatePath("/dashboard/services");
    return { success: true };
  } catch (error) {
    return { success: false, error: error instanceof ApiError ? error.message : "เพิ่มบริการไม่สำเร็จ" };
  }
}

export async function updateService(id: string, input: ServiceInput): Promise<ActionResult> {
  try {
    await apiFetch(`/services/${id}`, { method: "PATCH", body: JSON.stringify(input) });
    revalidatePath("/dashboard/services");
    return { success: true };
  } catch (error) {
    return { success: false, error: error instanceof ApiError ? error.message : "แก้ไขบริการไม่สำเร็จ" };
  }
}

export async function deleteService(id: string): Promise<ActionResult> {
  try {
    await apiFetch(`/services/${id}`, { method: "DELETE" });
    revalidatePath("/dashboard/services");
    return { success: true };
  } catch (error) {
    return { success: false, error: error instanceof ApiError ? error.message : "ลบบริการไม่สำเร็จ" };
  }
}
