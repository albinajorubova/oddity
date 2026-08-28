import { type NextRequest, NextResponse } from "next/server";

import { AUTH_COOKIE_NAME } from "@entities/user/model/constants";

import { ROUTES } from "@shared/config";

export function middleware(request: NextRequest) {
  const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;
  const { pathname } = request.nextUrl;

  if (
    (pathname.startsWith(ROUTES.profile) ||
      pathname.startsWith(ROUTES.admin)) &&
    !token
  ) {
    const loginUrl = new URL(ROUTES.login, request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/profile/:path*", "/admin/:path*"],
};
