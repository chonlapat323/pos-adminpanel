"use server";

import { revalidatePath } from "next/cache";

import { ApiError, apiFetch } from "@/lib/api";

export interface RewardInput {
  name: string;
  description?: string;
  pointCost: number;
  isActive: boolean;
}

type ActionResult = { success: true } | { success: false; error: string };

export async function createReward(input: RewardInput): Promise<ActionResult> {
  try {
    await apiFetch("/rewards", { method: "POST", body: JSON.stringify(input) });
    revalidatePath("/dashboard/rewards");
    return { success: true };
  } catch (error) {
    return { success: false, error: error instanceof ApiError ? error.message : "เพิ่มรางวัลไม่สำเร็จ" };
  }
}

export async function updateReward(id: string, input: RewardInput): Promise<ActionResult> {
  try {
    await apiFetch(`/rewards/${id}`, { method: "PATCH", body: JSON.stringify(input) });
    revalidatePath("/dashboard/rewards");
    return { success: true };
  } catch (error) {
    return { success: false, error: error instanceof ApiError ? error.message : "แก้ไขรางวัลไม่สำเร็จ" };
  }
}

export async function deleteReward(id: string): Promise<ActionResult> {
  try {
    await apiFetch(`/rewards/${id}`, { method: "DELETE" });
    revalidatePath("/dashboard/rewards");
    return { success: true };
  } catch (error) {
    return { success: false, error: error instanceof ApiError ? error.message : "ลบรางวัลไม่สำเร็จ" };
  }
}
