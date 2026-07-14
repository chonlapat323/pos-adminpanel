import { type NextRequest, NextResponse } from "next/server";

import { AUTH_COOKIE } from "@/lib/auth-constants";

export function proxy(req: NextRequest) {
  const token = req.cookies.get(AUTH_COOKIE)?.value;
  const isAuthRoute = req.nextUrl.pathname.startsWith("/auth");
  const isDashboardRoute = req.nextUrl.pathname.startsWith("/dashboard");

  if (!token && isDashboardRoute) {
    return NextResponse.redirect(new URL("/auth/v1/login", req.url));
  }

  if (token && isAuthRoute) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/auth/:path*"],
};
