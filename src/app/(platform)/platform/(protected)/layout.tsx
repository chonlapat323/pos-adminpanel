import type { ReactNode } from "react";

import { getCurrentPlatformAdmin } from "@/lib/platform-auth";

import { PlatformAppShell } from "./_components/platform-app-shell";

export default async function Layout({ children }: Readonly<{ children: ReactNode }>) {
  const admin = await getCurrentPlatformAdmin();

  return <PlatformAppShell admin={admin}>{children}</PlatformAppShell>;
}
