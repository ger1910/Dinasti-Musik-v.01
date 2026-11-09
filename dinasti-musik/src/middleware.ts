import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const session = request.cookies.get("dm_session")?.value;
  const role = request.cookies.get("dm_role")?.value;

  const isAuthenticated = Boolean(session);

  // 1. Root ("/") — Selalu izinkan akses ke beranda (landing page) untuk semua pengunjung
  if (pathname === "/") {
    return NextResponse.next();
  }

  // 2. Proteksi rute pelanggan: /catalog, /wishlist, /dashboard
  const isProtectedCustomerRoute =
    pathname.startsWith("/catalog") ||
    pathname.startsWith("/wishlist") ||
    pathname.startsWith("/dashboard");

  if (isProtectedCustomerRoute) {
    if (!isAuthenticated) {
      const loginUrl = new URL("/", request.url);
      loginUrl.searchParams.set("auth", "login");
      return NextResponse.redirect(loginUrl);
    }

    // Jika owner mencoba mengakses dashboard pelanggan biasa
    if (pathname.startsWith("/dashboard") && role === "owner") {
      return NextResponse.redirect(new URL("/admin", request.url));
    }

    return NextResponse.next();
  }

  // 3. Proteksi rute admin: /admin
  if (pathname.startsWith("/admin")) {
    if (!isAuthenticated) {
      const loginUrl = new URL("/", request.url);
      loginUrl.searchParams.set("auth", "login");
      return NextResponse.redirect(loginUrl);
    }

    if (role !== "owner") {
      // Pelanggan yang mencoba mengakses area admin diarahkan ke katalog mereka
      return NextResponse.redirect(new URL("/catalog", request.url));
    }

    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/catalog/:path*",
    "/wishlist/:path*",
    "/dashboard/:path*",
    "/admin/:path*",
  ],
};
