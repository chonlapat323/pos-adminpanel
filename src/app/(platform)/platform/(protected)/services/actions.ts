"use server";

import { revalidatePath } from "next/cache";

import { ApiError } from "@/lib/api";
import { platformApiFetch } from "@/lib/platform-api";

export interface CreatePlatformServiceInput {
  shopId: string;
  categoryId: string;
  name: string;
  description?: string;
  price: number;
  durationMinutes: number;
  status: "ACTIVE" | "INACTIVE" | "PROMOTION";
  imageUrl?: string;
}

export interface UpdatePlatformServiceInput {
  categoryId: string;
  name: string;
  description?: string;
  price: number;
  durationMinutes: number;
  status: "ACTIVE" | "INACTIVE" | "PROMOTION";
  imageUrl?: string;
}

type ActionResult = { success: true } | { success: false; error: string };

export async function createPlatformService(input: CreatePlatformServiceInput): Promise<ActionResult> {
  try {
    await platformApiFetch("/platform/services", { method: "POST", body: JSON.stringify(input) });
    revalidatePath("/platform/services");
    return { success: true };
  } catch (error) {
    return { success: false, error: error instanceof ApiError ? error.message : "เพิ่มบริการไม่สำเร็จ" };
  }
}

export async function updatePlatformService(id: string, input: UpdatePlatformServiceInput): Promise<ActionResult> {
  try {
    await platformApiFetch(`/platform/services/${id}`, { method: "PATCH", body: JSON.stringify(input) });
    revalidatePath("/platform/services");
    return { success: true };
  } catch (error) {
    return { success: false, error: error instanceof ApiError ? error.message : "แก้ไขบริการไม่สำเร็จ" };
  }
}

export async function deletePlatformService(id: string): Promise<ActionResult> {
  try {
    await platformApiFetch(`/platform/services/${id}`, { method: "DELETE" });
    revalidatePath("/platform/services");
    return { success: true };
  } catch (error) {
    return { success: false, error: error instanceof ApiError ? error.message : "ลบบริการไม่สำเร็จ" };
  }
}
