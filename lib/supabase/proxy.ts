import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!, // Use ANON_KEY here
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
              // Critical: Using undefined for localhost allows subdomains to share the cookie
              domain:
                process.env.NODE_ENV === "production"
                  ? ".talawangpos.site"
                  : undefined,
            })
          );
        },
      },
    }
  );

  // FIX 1: Use getUser() instead of getClaims()
  // This verifies the user session and allows RLS to function in Server Components
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const url = request.nextUrl.clone();
  const hostname = request.headers.get("host") || "";
  const pathname = url.pathname;

  const rootDomain =
    process.env.NODE_ENV === "production"
      ? "talawangpos.site"
      : "localhost:3000";

  const subdomain = hostname.endsWith(`.${rootDomain}`)
    ? hostname.replace(`.${rootDomain}`, "")
    : null;

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
    if (isPublicPath) {
      return supabaseResponse;
    }

    // Rewrite internal path: dnyonya.localhost:3000/dashboard -> /dnyonya/dashboard
    url.pathname = `/${subdomain}${pathname}`;

    // FIX 2: Protected Route Logic
    // If there is no user and the path is NOT public, redirect to login
    if (!user) {
      const loginUrl = new URL("/login", request.url);
      return NextResponse.redirect(loginUrl);
    }

    return NextResponse.rewrite(url, {
      request: {
        headers: request.headers,
      },
    });
  }

  // 2. ROOT DOMAIN LOGIC
  if (!user && pathname.startsWith("/dashboard")) {
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  return supabaseResponse;
}
