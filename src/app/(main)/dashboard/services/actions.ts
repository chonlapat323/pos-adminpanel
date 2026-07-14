"use server";

import { revalidatePath } from "next/cache";

import { ApiError, apiFetch } from "@/lib/api";

export interface CreateCategoryInput {
  name: string;
}

export interface CreateServiceInput {
  categoryId: string;
  name: string;
  description?: string;
  price: number;
  durationMinutes: number;
  status: "ACTIVE" | "INACTIVE" | "PROMOTION";
}

type ActionResult = { success: true } | { success: false; error: string };

export async function createServiceCategory(input: CreateCategoryInput): Promise<ActionResult> {
  try {
    await apiFetch("/service-categories", { method: "POST", body: JSON.stringify(input) });
    revalidatePath("/dashboard/services");
    return { success: true };
  } catch (error) {
    return { success: false, error: error instanceof ApiError ? error.message : "เพิ่มกลุ่มบริการไม่สำเร็จ" };
  }
}

export async function createService(input: CreateServiceInput): Promise<ActionResult> {
  try {
    await apiFetch("/services", { method: "POST", body: JSON.stringify(input) });
    revalidatePath("/dashboard/services");
    return { success: true };
  } catch (error) {
    return { success: false, error: error instanceof ApiError ? error.message : "เพิ่มบริการไม่สำเร็จ" };
  }
}
