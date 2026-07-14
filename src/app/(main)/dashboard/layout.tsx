import type { ReactNode } from "react";

import { getCurrentUser } from "@/lib/auth";

import { AppShell } from "./_components/app-shell";

export default async function Layout({ children }: Readonly<{ children: ReactNode }>) {
  const currentUser = await getCurrentUser();

  return <AppShell user={currentUser}>{children}</AppShell>;
}
