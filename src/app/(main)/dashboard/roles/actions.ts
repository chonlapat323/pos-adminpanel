"use server";

import { revalidatePath } from "next/cache";

import { ApiError, apiFetch } from "@/lib/api";

export interface RoleInput {
  name: string;
  permissions: string[];
}

type ActionResult = { success: true } | { success: false; error: string };

export async function createRole(input: RoleInput): Promise<ActionResult> {
  try {
    await apiFetch("/roles", { method: "POST", body: JSON.stringify(input) });
    revalidatePath("/dashboard/roles");
    return { success: true };
  } catch (error) {
    return { success: false, error: error instanceof ApiError ? error.message : "เพิ่ม role ไม่สำเร็จ" };
  }
}

export async function updateRole(id: string, input: RoleInput): Promise<ActionResult> {
  try {
    await apiFetch(`/roles/${id}`, { method: "PATCH", body: JSON.stringify(input) });
    revalidatePath("/dashboard/roles");
    return { success: true };
  } catch (error) {
    return { success: false, error: error instanceof ApiError ? error.message : "แก้ไข role ไม่สำเร็จ" };
  }
}

export async function deleteRole(id: string): Promise<ActionResult> {
  try {
    await apiFetch(`/roles/${id}`, { method: "DELETE" });
    revalidatePath("/dashboard/roles");
    return { success: true };
  } catch (error) {
    return { success: false, error: error instanceof ApiError ? error.message : "ลบ role ไม่สำเร็จ" };
  }
}
