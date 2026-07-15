"use server";

import { revalidatePath } from "next/cache";

import { ApiError, apiFetch } from "@/lib/api";

export interface MemberInput {
  name: string;
  phone: string;
  birthday?: string;
  address?: string;
  photoUrl?: string;
  note?: string;
}

type ActionResult = { success: true } | { success: false; error: string };

export async function createMember(input: MemberInput): Promise<ActionResult> {
  try {
    await apiFetch("/members", { method: "POST", body: JSON.stringify(input) });
    revalidatePath("/dashboard/members");
    return { success: true };
  } catch (error) {
    return { success: false, error: error instanceof ApiError ? error.message : "เพิ่มสมาชิกไม่สำเร็จ" };
  }
}

export async function updateMember(id: string, input: MemberInput): Promise<ActionResult> {
  try {
    await apiFetch(`/members/${id}`, { method: "PATCH", body: JSON.stringify(input) });
    revalidatePath("/dashboard/members");
    return { success: true };
  } catch (error) {
    return { success: false, error: error instanceof ApiError ? error.message : "แก้ไขสมาชิกไม่สำเร็จ" };
  }
}

export async function deleteMember(id: string): Promise<ActionResult> {
  try {
    await apiFetch(`/members/${id}`, { method: "DELETE" });
    revalidatePath("/dashboard/members");
    return { success: true };
  } catch (error) {
    return { success: false, error: error instanceof ApiError ? error.message : "ลบสมาชิกไม่สำเร็จ" };
  }
}
