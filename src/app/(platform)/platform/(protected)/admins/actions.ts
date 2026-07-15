"use server";

import { revalidatePath } from "next/cache";

import { ApiError } from "@/lib/api";
import { platformApiFetch } from "@/lib/platform-api";

export interface CreatePlatformAdminInput {
  name: string;
  email: string;
  password: string;
  roleId?: string | null;
  isSuperAdmin: boolean;
}

export interface UpdatePlatformAdminInput {
  name: string;
  email: string;
  password?: string;
  roleId?: string | null;
  isSuperAdmin: boolean;
}

type ActionResult = { success: true } | { success: false; error: string };

export async function createPlatformAdminAccount(input: CreatePlatformAdminInput): Promise<ActionResult> {
  try {
    await platformApiFetch("/platform/admins", { method: "POST", body: JSON.stringify(input) });
    revalidatePath("/platform/admins");
    return { success: true };
  } catch (error) {
    return { success: false, error: error instanceof ApiError ? error.message : "เพิ่ม admin ไม่สำเร็จ" };
  }
}

export async function updatePlatformAdminAccount(id: string, input: UpdatePlatformAdminInput): Promise<ActionResult> {
  try {
    await platformApiFetch(`/platform/admins/${id}`, { method: "PATCH", body: JSON.stringify(input) });
    revalidatePath("/platform/admins");
    return { success: true };
  } catch (error) {
    return { success: false, error: error instanceof ApiError ? error.message : "แก้ไข admin ไม่สำเร็จ" };
  }
}

export async function deletePlatformAdminAccount(id: string): Promise<ActionResult> {
  try {
    await platformApiFetch(`/platform/admins/${id}`, { method: "DELETE" });
    revalidatePath("/platform/admins");
    return { success: true };
  } catch (error) {
    return { success: false, error: error instanceof ApiError ? error.message : "ลบ admin ไม่สำเร็จ" };
  }
}
