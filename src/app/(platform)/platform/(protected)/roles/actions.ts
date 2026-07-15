"use server";

import { revalidatePath } from "next/cache";

import { ApiError } from "@/lib/api";
import { platformApiFetch } from "@/lib/platform-api";

export interface PlatformRoleInput {
  name: string;
  permissions: string[];
}

type ActionResult = { success: true } | { success: false; error: string };

export async function createPlatformRole(input: PlatformRoleInput): Promise<ActionResult> {
  try {
    await platformApiFetch("/platform/roles", { method: "POST", body: JSON.stringify(input) });
    revalidatePath("/platform/roles");
    return { success: true };
  } catch (error) {
    return { success: false, error: error instanceof ApiError ? error.message : "เพิ่ม role ไม่สำเร็จ" };
  }
}

export async function updatePlatformRole(id: string, input: PlatformRoleInput): Promise<ActionResult> {
  try {
    await platformApiFetch(`/platform/roles/${id}`, { method: "PATCH", body: JSON.stringify(input) });
    revalidatePath("/platform/roles");
    return { success: true };
  } catch (error) {
    return { success: false, error: error instanceof ApiError ? error.message : "แก้ไข role ไม่สำเร็จ" };
  }
}

export async function deletePlatformRole(id: string): Promise<ActionResult> {
  try {
    await platformApiFetch(`/platform/roles/${id}`, { method: "DELETE" });
    revalidatePath("/platform/roles");
    return { success: true };
  } catch (error) {
    return { success: false, error: error instanceof ApiError ? error.message : "ลบ role ไม่สำเร็จ" };
  }
}
