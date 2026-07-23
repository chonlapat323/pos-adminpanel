"use server";

import { revalidatePath } from "next/cache";

import { ApiError } from "@/lib/api";
import { platformApiFetch } from "@/lib/platform-api";

type ActionResult = { success: true } | { success: false; error: string };

export async function updatePlatformSetting(key: string, value: string): Promise<ActionResult> {
  try {
    await platformApiFetch(`/platform/settings/${key}`, { method: "PATCH", body: JSON.stringify({ value }) });
    revalidatePath("/platform/settings");
    return { success: true };
  } catch (error) {
    return { success: false, error: error instanceof ApiError ? error.message : "บันทึกไม่สำเร็จ" };
  }
}
