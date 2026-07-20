"use server";

import { revalidatePath } from "next/cache";

import { ApiError } from "@/lib/api";
import { platformApiFetch } from "@/lib/platform-api";

export interface CreateShopInput {
  name: string;
  slug: string;
  shopType: "NAIL" | "HAIR" | "WAX" | "MULTI";
  address?: string;
  phone?: string;
  ownerName: string;
  ownerEmail: string;
  ownerPassword: string;
}

type ActionResult = { success: true } | { success: false; error: string };

export async function createShop(input: CreateShopInput): Promise<ActionResult> {
  try {
    await platformApiFetch("/platform/shops", { method: "POST", body: JSON.stringify(input) });
    revalidatePath("/platform/shops");
    return { success: true };
  } catch (error) {
    return { success: false, error: error instanceof ApiError ? error.message : "สร้างร้านไม่สำเร็จ" };
  }
}

export interface UpdateShopInput {
  name: string;
  shopType: "NAIL" | "HAIR" | "WAX" | "MULTI";
  address?: string;
  phone?: string;
  bahtPerPoint: number;
}

export async function updateShop(shopId: string, input: UpdateShopInput): Promise<ActionResult> {
  try {
    await platformApiFetch(`/platform/shops/${shopId}`, { method: "PATCH", body: JSON.stringify(input) });
    revalidatePath("/platform/shops");
    revalidatePath(`/platform/shops/${shopId}`);
    return { success: true };
  } catch (error) {
    return { success: false, error: error instanceof ApiError ? error.message : "แก้ไขข้อมูลร้านไม่สำเร็จ" };
  }
}

export async function updateShopStatus(shopId: string, isActive: boolean): Promise<ActionResult> {
  try {
    await platformApiFetch(`/platform/shops/${shopId}/status`, {
      method: "PATCH",
      body: JSON.stringify({ isActive }),
    });
    revalidatePath("/platform/shops");
    revalidatePath(`/platform/shops/${shopId}`);
    return { success: true };
  } catch (error) {
    return { success: false, error: error instanceof ApiError ? error.message : "อัปเดตสถานะร้านไม่สำเร็จ" };
  }
}

export async function updateShopSlug(shopId: string, slug: string): Promise<ActionResult> {
  try {
    await platformApiFetch(`/platform/shops/${shopId}/slug`, {
      method: "PATCH",
      body: JSON.stringify({ slug }),
    });
    revalidatePath("/platform/shops");
    revalidatePath(`/platform/shops/${shopId}`);
    return { success: true };
  } catch (error) {
    return { success: false, error: error instanceof ApiError ? error.message : "แก้ไข slug ไม่สำเร็จ" };
  }
}

export async function grantShopSubscription(shopId: string, packageId: string): Promise<ActionResult> {
  try {
    await platformApiFetch(`/platform/shops/${shopId}/subscription`, {
      method: "PATCH",
      body: JSON.stringify({ packageId }),
    });
    revalidatePath("/platform/shops");
    revalidatePath(`/platform/shops/${shopId}`);
    return { success: true };
  } catch (error) {
    return { success: false, error: error instanceof ApiError ? error.message : "ให้/ต่ออายุแพ็กเกจไม่สำเร็จ" };
  }
}

export async function cancelLatestShopSubscription(shopId: string): Promise<ActionResult> {
  try {
    await platformApiFetch(`/platform/shops/${shopId}/subscription/cancel`, { method: "POST" });
    revalidatePath("/platform/shops");
    revalidatePath(`/platform/shops/${shopId}`);
    revalidatePath("/platform/subscriptions");
    return { success: true };
  } catch (error) {
    return { success: false, error: error instanceof ApiError ? error.message : "ยกเลิกรายการล่าสุดไม่สำเร็จ" };
  }
}
