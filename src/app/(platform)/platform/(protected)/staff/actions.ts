"use server";

import { revalidatePath } from "next/cache";

import { ApiError } from "@/lib/api";
import { platformApiFetch } from "@/lib/platform-api";

export interface CreatePlatformStaffInput {
  shopId: string;
  name: string;
  email: string;
  phone?: string;
  password: string;
  role: "OWNER" | "STAFF";
}

export interface UpdatePlatformStaffInput {
  name: string;
  email: string;
  phone?: string;
  password?: string;
  role: "OWNER" | "STAFF";
  isActive: boolean;
}

type ActionResult = { success: true } | { success: false; error: string };

export async function createPlatformStaff(input: CreatePlatformStaffInput): Promise<ActionResult> {
  try {
    await platformApiFetch("/platform/staff", { method: "POST", body: JSON.stringify(input) });
    revalidatePath("/platform/staff");
    return { success: true };
  } catch (error) {
    return { success: false, error: error instanceof ApiError ? error.message : "เพิ่มพนักงานไม่สำเร็จ" };
  }
}

export async function updatePlatformStaff(id: string, input: UpdatePlatformStaffInput): Promise<ActionResult> {
  try {
    await platformApiFetch(`/platform/staff/${id}`, { method: "PATCH", body: JSON.stringify(input) });
    revalidatePath("/platform/staff");
    return { success: true };
  } catch (error) {
    return { success: false, error: error instanceof ApiError ? error.message : "แก้ไขพนักงานไม่สำเร็จ" };
  }
}

export async function deletePlatformStaff(id: string): Promise<ActionResult> {
  try {
    await platformApiFetch(`/platform/staff/${id}`, { method: "DELETE" });
    revalidatePath("/platform/staff");
    return { success: true };
  } catch (error) {
    return { success: false, error: error instanceof ApiError ? error.message : "ลบพนักงานไม่สำเร็จ" };
  }
}
