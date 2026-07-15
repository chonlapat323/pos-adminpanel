"use server";

import { revalidatePath } from "next/cache";

import { ApiError, apiFetch } from "@/lib/api";

export interface CreateStaffInput {
  name: string;
  email: string;
  phone?: string;
  password: string;
  role: "OWNER" | "STAFF";
}

export interface UpdateStaffInput {
  name: string;
  email: string;
  phone?: string;
  password?: string;
  role: "OWNER" | "STAFF";
  isActive: boolean;
}

type ActionResult = { success: true } | { success: false; error: string };

export async function createStaff(input: CreateStaffInput): Promise<ActionResult> {
  try {
    await apiFetch("/staff", { method: "POST", body: JSON.stringify(input) });
    revalidatePath("/dashboard/staff");
    return { success: true };
  } catch (error) {
    return { success: false, error: error instanceof ApiError ? error.message : "เพิ่มพนักงานไม่สำเร็จ" };
  }
}

export async function updateStaff(id: string, input: UpdateStaffInput): Promise<ActionResult> {
  try {
    await apiFetch(`/staff/${id}`, { method: "PATCH", body: JSON.stringify(input) });
    revalidatePath("/dashboard/staff");
    return { success: true };
  } catch (error) {
    return { success: false, error: error instanceof ApiError ? error.message : "แก้ไขพนักงานไม่สำเร็จ" };
  }
}

export async function deleteStaff(id: string): Promise<ActionResult> {
  try {
    await apiFetch(`/staff/${id}`, { method: "DELETE" });
    revalidatePath("/dashboard/staff");
    return { success: true };
  } catch (error) {
    return { success: false, error: error instanceof ApiError ? error.message : "ลบพนักงานไม่สำเร็จ" };
  }
}
