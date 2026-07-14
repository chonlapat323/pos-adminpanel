import { redirect } from "next/navigation";

import { ApiError } from "./api";
import { getPlatformToken } from "./platform-auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3010";

export async function platformApiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = await getPlatformToken();

  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
    cache: "no-store",
  });

  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new ApiError(body?.message ?? `Request to ${path} failed with ${res.status}`, res.status);
  }

  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}

export async function requirePlatformApiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  try {
    return await platformApiFetch<T>(path, options);
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) {
      redirect("/platform/login");
    }
    throw error;
  }
}
