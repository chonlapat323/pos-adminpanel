"use server";

import { revalidatePath } from "next/cache";

import { ApiError } from "@/lib/api";
import { platformApiFetch } from "@/lib/platform-api";

export interface CreatePlatformCategoryInput {
  shopId: string;
  name: string;
  isHidden: boolean;
  imageUrl?: string;
}

export interface UpdatePlatformCategoryInput {
  name: string;
  isHidden: boolean;
  imageUrl?: string;
}

type ActionResult = { success: true } | { success: false; error: string };

export async function createPlatformCategory(input: CreatePlatformCategoryInput): Promise<ActionResult> {
  try {
    await platformApiFetch("/platform/service-categories", { method: "POST", body: JSON.stringify(input) });
    revalidatePath("/platform/categories");
    return { success: true };
  } catch (error) {
    return { success: false, error: error instanceof ApiError ? error.message : "เพิ่มกลุ่มบริการไม่สำเร็จ" };
  }
}

export async function updatePlatformCategory(id: string, input: UpdatePlatformCategoryInput): Promise<ActionResult> {
  try {
    await platformApiFetch(`/platform/service-categories/${id}`, { method: "PATCH", body: JSON.stringify(input) });
    revalidatePath("/platform/categories");
    return { success: true };
  } catch (error) {
    return { success: false, error: error instanceof ApiError ? error.message : "แก้ไขกลุ่มบริการไม่สำเร็จ" };
  }
}

export async function deletePlatformCategory(id: string): Promise<ActionResult> {
  try {
    await platformApiFetch(`/platform/service-categories/${id}`, { method: "DELETE" });
    revalidatePath("/platform/categories");
    return { success: true };
  } catch (error) {
    return { success: false, error: error instanceof ApiError ? error.message : "ลบกลุ่มบริการไม่สำเร็จ" };
  }
}
