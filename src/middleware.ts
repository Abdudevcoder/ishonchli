import NextAuth from "next-auth";
import createMiddleware from "next-intl/middleware";
import { NextResponse } from "next/server";
import { routing } from "@/i18n/routing";
import { authConfig } from "@/auth.config";
import type { NextAuthRequest } from "next-auth";

// Edge-safe auth using authConfig (no bcrypt/prisma)
const { auth } = NextAuth(authConfig);

const intlMiddleware = createMiddleware(routing);

const protectedPaths = ["/submit-report", "/my-reports", "/favorites", "/profile"];
const adminPaths = ["/admin"];

export default auth((req: NextAuthRequest) => {
  const { pathname } = req.nextUrl;

  const localePrefix = routing.locales.find(
    (l) => pathname.startsWith(`/${l}/`) || pathname === `/${l}`
  );
  const pathWithoutLocale = localePrefix
    ? pathname.slice(localePrefix.length + 1) || "/"
    : pathname;

  const isProtected = protectedPaths.some((p) => pathWithoutLocale.startsWith(p));
  const isAdmin = adminPaths.some((p) => pathWithoutLocale.startsWith(p));
  const session = req.auth;

  if ((isProtected || isAdmin) && !session) {
    const loginUrl = new URL(
      `/${localePrefix ?? routing.defaultLocale}/auth/login`,
      req.url
    );
    return NextResponse.redirect(loginUrl);
  }

  if (isAdmin && session?.user?.role !== "ADMIN") {
    return NextResponse.redirect(
      new URL(`/${localePrefix ?? routing.defaultLocale}`, req.url)
    );
  }

  return intlMiddleware(req);
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
