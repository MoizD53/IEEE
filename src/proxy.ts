import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  const session = await auth();
  const { pathname } = request.nextUrl;

  // Allow public assets, images, auth api and login
  if (
    pathname.startsWith("/api/auth") ||
    pathname === "/login" ||
    /\.(png|jpg|jpeg|gif|webp|svg|ico|pdf)$/i.test(pathname)
  ) {
    return NextResponse.next();
  }

  // Redirect to login if not authenticated
  if (!session) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Admin Role Protection
  if (pathname.startsWith("/admin") && session.user.role !== "ADMIN") {
    return NextResponse.redirect(new URL("/chair/dashboard", request.url));
  }

  // Chair Role Protection
  if (pathname.startsWith("/chair") && session.user.role !== "SESSION_CHAIR") {
    return NextResponse.redirect(new URL("/admin/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
