"use server";

import { revalidatePath } from "next/cache";

import { ApiError } from "@/lib/api";
import { platformApiFetch } from "@/lib/platform-api";

export interface CreatePlatformMemberInput {
  shopId: string;
  name: string;
  phone: string;
  birthday?: string;
  address?: string;
  photoUrl?: string;
  note?: string;
}

export interface UpdatePlatformMemberInput {
  name: string;
  phone: string;
  birthday?: string;
  address?: string;
  photoUrl?: string;
  note?: string;
}

type ActionResult = { success: true } | { success: false; error: string };

export async function createPlatformMember(input: CreatePlatformMemberInput): Promise<ActionResult> {
  try {
    await platformApiFetch("/platform/members", { method: "POST", body: JSON.stringify(input) });
    revalidatePath("/platform/members");
    return { success: true };
  } catch (error) {
    return { success: false, error: error instanceof ApiError ? error.message : "เพิ่มสมาชิกไม่สำเร็จ" };
  }
}

export async function updatePlatformMember(id: string, input: UpdatePlatformMemberInput): Promise<ActionResult> {
  try {
    await platformApiFetch(`/platform/members/${id}`, { method: "PATCH", body: JSON.stringify(input) });
    revalidatePath("/platform/members");
    return { success: true };
  } catch (error) {
    return { success: false, error: error instanceof ApiError ? error.message : "แก้ไขสมาชิกไม่สำเร็จ" };
  }
}

export async function deletePlatformMember(id: string): Promise<ActionResult> {
  try {
    await platformApiFetch(`/platform/members/${id}`, { method: "DELETE" });
    revalidatePath("/platform/members");
    return { success: true };
  } catch (error) {
    return { success: false, error: error instanceof ApiError ? error.message : "ลบสมาชิกไม่สำเร็จ" };
  }
}
