import type { ReactNode } from "react";

import { Toast } from "@heroui/react";
import type { Metadata } from "next";

import { APP_CONFIG } from "@/config/app-config";
import { fontVars } from "@/lib/fonts/registry";
import { ThemeProvider } from "@/lib/theme-provider";

import "./globals.css";

export const metadata: Metadata = {
  title: APP_CONFIG.meta.title,
  description: APP_CONFIG.meta.description,
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="th" suppressHydrationWarning>
      <body className={`${fontVars} min-h-screen antialiased`}>
        <ThemeProvider>
          {children}
          <Toast.Provider />
        </ThemeProvider>
      </body>
    </html>
  );
}
