"use server";

import { revalidatePath } from "next/cache";

import { ApiError } from "@/lib/api";
import { platformApiFetch } from "@/lib/platform-api";

export interface CreatePlatformRewardInput {
  shopId: string;
  name: string;
  description?: string;
  pointCost: number;
  isActive: boolean;
}

export interface UpdatePlatformRewardInput {
  name: string;
  description?: string;
  pointCost: number;
  isActive: boolean;
}

type ActionResult = { success: true } | { success: false; error: string };

export async function createPlatformReward(input: CreatePlatformRewardInput): Promise<ActionResult> {
  try {
    await platformApiFetch("/platform/rewards", { method: "POST", body: JSON.stringify(input) });
    revalidatePath("/platform/rewards");
    return { success: true };
  } catch (error) {
    return { success: false, error: error instanceof ApiError ? error.message : "เพิ่มรางวัลไม่สำเร็จ" };
  }
}

export async function updatePlatformReward(id: string, input: UpdatePlatformRewardInput): Promise<ActionResult> {
  try {
    await platformApiFetch(`/platform/rewards/${id}`, { method: "PATCH", body: JSON.stringify(input) });
    revalidatePath("/platform/rewards");
    return { success: true };
  } catch (error) {
    return { success: false, error: error instanceof ApiError ? error.message : "แก้ไขรางวัลไม่สำเร็จ" };
  }
}

export async function deletePlatformReward(id: string): Promise<ActionResult> {
  try {
    await platformApiFetch(`/platform/rewards/${id}`, { method: "DELETE" });
    revalidatePath("/platform/rewards");
    return { success: true };
  } catch (error) {
    return { success: false, error: error instanceof ApiError ? error.message : "ลบรางวัลไม่สำเร็จ" };
  }
}
