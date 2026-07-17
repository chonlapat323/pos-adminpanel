"use server";

import { revalidatePath } from "next/cache";

import { ApiError, apiFetch } from "@/lib/api";

export interface ShopSettingsInput {
  name: string;
  shopType: "NAIL" | "HAIR" | "WAX" | "MULTI";
  logoUrl?: string;
  address?: string;
  phone?: string;
  openTime?: string;
  closeTime?: string;
  bahtPerPoint: number;
  signupBonusPoints: number;
}

type ActionResult = { success: true } | { success: false; error: string };

export async function updateShopSettings(input: ShopSettingsInput): Promise<ActionResult> {
  try {
    await apiFetch("/shop", { method: "PATCH", body: JSON.stringify(input) });
    revalidatePath("/dashboard/settings");
    return { success: true };
  } catch (error) {
    return { success: false, error: error instanceof ApiError ? error.message : "แก้ไขข้อมูลร้านไม่สำเร็จ" };
  }
}
