"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { PLATFORM_AUTH_COOKIE } from "./platform-auth-constants";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3010";

export interface PlatformSession {
  id: string;
  name: string;
}

export interface PlatformSessionFull {
  id: string;
  name: string;
  permissions: string[];
  isSuperAdmin: boolean;
}

export async function platformLogin(
  email: string,
  password: string,
): Promise<{ success: true } | { success: false; error: string }> {
  try {
    const res = await fetch(`${API_URL}/platform/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
      cache: "no-store",
    });

    if (!res.ok) {
      const body = await res.json().catch(() => null);
      return { success: false, error: body?.message ?? "เข้าสู่ระบบไม่สำเร็จ" };
    }

    const data = (await res.json()) as { accessToken: string };
    const cookieStore = await cookies();
    cookieStore.set(PLATFORM_AUTH_COOKIE, data.accessToken, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return { success: true };
  } catch {
    return { success: false, error: "ไม่สามารถเชื่อมต่อ pos-backend ได้" };
  }
}

export async function platformLogout() {
  const cookieStore = await cookies();
  cookieStore.delete(PLATFORM_AUTH_COOKIE);
  redirect("/platform/login");
}

export async function getPlatformToken(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get(PLATFORM_AUTH_COOKIE)?.value ?? null;
}

export async function getCurrentPlatformAdmin(): Promise<PlatformSession | null> {
  const token = await getPlatformToken();
  if (!token) return null;

  try {
    const payloadSegment = token.split(".")[1];
    const json = Buffer.from(payloadSegment, "base64url").toString("utf8");
    const payload = JSON.parse(json);
    return { id: payload.sub, name: payload.name };
  } catch {
    return null;
  }
}

export async function getCurrentPlatformAdminFull(): Promise<PlatformSessionFull | null> {
  const token = await getPlatformToken();
  if (!token) return null;

  try {
    const res = await fetch(`${API_URL}/platform/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    if (!res.ok) return null;
    return (await res.json()) as PlatformSessionFull;
  } catch {
    return null;
  }
}
