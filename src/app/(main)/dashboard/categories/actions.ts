"use server";

import { revalidatePath } from "next/cache";

import { ApiError, apiFetch } from "@/lib/api";

export interface CategoryInput {
  name: string;
  isHidden: boolean;
}

type ActionResult = { success: true } | { success: false; error: string };

export async function createServiceCategory(input: CategoryInput): Promise<ActionResult> {
  try {
    await apiFetch("/service-categories", { method: "POST", body: JSON.stringify(input) });
    revalidatePath("/dashboard/categories");
    revalidatePath("/dashboard/services");
    return { success: true };
  } catch (error) {
    return { success: false, error: error instanceof ApiError ? error.message : "เพิ่มกลุ่มบริการไม่สำเร็จ" };
  }
}

export async function updateServiceCategory(id: string, input: CategoryInput): Promise<ActionResult> {
  try {
    await apiFetch(`/service-categories/${id}`, { method: "PATCH", body: JSON.stringify(input) });
    revalidatePath("/dashboard/categories");
    revalidatePath("/dashboard/services");
    return { success: true };
  } catch (error) {
    return { success: false, error: error instanceof ApiError ? error.message : "แก้ไขกลุ่มบริการไม่สำเร็จ" };
  }
}

export async function deleteServiceCategory(id: string): Promise<ActionResult> {
  try {
    await apiFetch(`/service-categories/${id}`, { method: "DELETE" });
    revalidatePath("/dashboard/categories");
    revalidatePath("/dashboard/services");
    return { success: true };
  } catch (error) {
    return { success: false, error: error instanceof ApiError ? error.message : "ลบกลุ่มบริการไม่สำเร็จ" };
  }
}
