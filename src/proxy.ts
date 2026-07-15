import { type NextRequest, NextResponse } from "next/server";

import { AUTH_COOKIE } from "@/lib/auth-constants";
import { PLATFORM_AUTH_COOKIE } from "@/lib/platform-auth-constants";

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const token = req.cookies.get(AUTH_COOKIE)?.value;
  const isAuthRoute = pathname.startsWith("/auth");
  const isDashboardRoute = pathname.startsWith("/dashboard");

  if (!token && isDashboardRoute) {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }
  if (token && isAuthRoute) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  const platformToken = req.cookies.get(PLATFORM_AUTH_COOKIE)?.value;
  const isPlatformLoginRoute = pathname.startsWith("/platform/login");
  const isPlatformProtectedRoute = pathname.startsWith("/platform/") && !isPlatformLoginRoute;

  if (!platformToken && isPlatformProtectedRoute) {
    return NextResponse.redirect(new URL("/platform/login", req.url));
  }
  if (platformToken && isPlatformLoginRoute) {
    return NextResponse.redirect(new URL("/platform/dashboard", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/auth/:path*", "/platform/:path*"],
};
