// middleware.ts (or wherever your updateSession is located)
import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
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
              // UPDATED: Use your actual domain here
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

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const url = request.nextUrl.clone();
  const hostname = request.headers.get("host") || "";
  const pathname = url.pathname;

  // UPDATED: Match your live domain
  const rootDomain =
    process.env.NODE_ENV === "production"
      ? "talawangpos.site"
      : "localhost:3000";

  // Check for subdomain
  const subdomain = hostname.endsWith(`.${rootDomain}`)
    ? hostname.replace(`.${rootDomain}`, "")
    : null;

  // Paths that should not be rewritten or protected
  const publicPaths = ["/login", "/auth", "/api", "/_next", "/favicon.ico"];
  const isPublicPath = publicPaths.some((path) => pathname.startsWith(path));

  // 1. SUBDOMAIN REWRITE LOGIC
  if (subdomain && subdomain !== "www") {
    // If user is not logged in and trying to access a private subdomain page
    if (!user && !isPublicPath) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    if (isPublicPath) return supabaseResponse;

    // IMPORTANT: Reroute to the [business_slug] folder internally
    // Example: dnyonya.talawangpos.site/tables -> talawangpos.site/dnyonya/tables
    return NextResponse.rewrite(
      new URL(`/${subdomain}${pathname}${url.search}`, request.url)
    );
  }

  // 2. ROOT DOMAIN PROTECTION
  // If user hits talawangpos.site/dashboard without being logged in
  if (!user && pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return supabaseResponse;
}
