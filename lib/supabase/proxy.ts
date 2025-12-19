import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, {
              ...options,
              // Allows session to persist across subdomains
              domain:
                process.env.NODE_ENV === "production"
                  ? ".sirkasir.com"
                  : "localhost",
            })
          );
        },
      },
    }
  );

  // Refresh session and get user data
  const { data } = await supabase.auth.getClaims();
  const user = data?.claims;

  const url = request.nextUrl.clone();
  const hostname = request.headers.get("host") || "";
  const pathname = url.pathname;

  const rootDomain =
    process.env.NODE_ENV === "production" ? "sirkasir.com" : "localhost:3000";

  const subdomain = hostname.endsWith(`.${rootDomain}`)
    ? hostname.replace(`.${rootDomain}`, "")
    : null;

  // Paths that should NOT be rewritten to the [business_slug] folder
  const publicPaths = [
    "/login",
    "/auth",
    "/api",
    "/_next",
    "/favicon.ico",
    "/logo.svg",
  ];
  const isPublicPath = publicPaths.some((path) => pathname.startsWith(path));

  // 1. SUBDOMAIN REWRITE LOGIC
  if (subdomain && subdomain !== "www") {
    // If it's a public path, don't rewrite it (e.g., stay at /login)
    if (isPublicPath) {
      return supabaseResponse;
    }

    // Rewrite internal path: dnyonya.localhost:3000/dashboard -> /dnyonya/dashboard
    url.pathname = `/${subdomain}${pathname}`;

    // Auth Guard: Redirect to login if trying to access dashboard while logged out
    const isDashboardRoute = url.pathname.includes("/dashboard");
    if (!user && isDashboardRoute) {
      const loginUrl = new URL("/login", request.url);
      return NextResponse.redirect(loginUrl);
    }

    return NextResponse.rewrite(url);
  }

  // 2. ROOT DOMAIN LOGIC
  // Prevent logged-out users from accessing the root /dashboard if they aren't on a subdomain
  if (!user && pathname.startsWith("/dashboard")) {
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  return supabaseResponse;
}
