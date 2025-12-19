// app/[business_slug]/layout.tsx
import { createClient } from "@/lib/supabase/server";
import Image from "next/image";
import Link from "next/link";
import { redirect, notFound } from "next/navigation";

export default async function BusinessLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { business_slug: string };
}) {
  const unwrappedParams = await params;
  const business_slug = unwrappedParams.business_slug;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  // 1. Fetch the business based on the URL slug
  // 2. Cross-reference with the user's staff_profile
  const { data: profile, error } = await supabase
    .from("staff_profiles")
    .select(
      `
      business_id,
      role,
      businesses!inner (
        id,
        name,
        slug
      )
    `
    )
    .eq("id", user.id)
    .eq("businesses.slug", business_slug)
    .single();

  if (error || !profile) {
    // User is logged in, but doesn't belong to THIS business URL
    console.error(error.message);
    return notFound();
  }

  const business = Array.isArray(profile?.businesses)
    ? profile.businesses[0]
    : profile?.businesses;

  const businessName = business?.name || "Store";
  const businessSlugFromDB = business?.slug;

  return (
    <div className="min-h-screen bg-foreground py-4 grid grid-cols-[max-content_5fr_3fr] md:grid-cols-[max-content_7fr_2fr]">
      <nav className="text-background flex flex-col gap-4 px-4">
        <Link href={`/${business_slug}/dashboard`}>
          <Image
            className="w-auto h-12"
            src="/logo.svg"
            width={100}
            height={100}
            alt="Logo"
          />
        </Link>
        <Link href={`/${business_slug}/dashboard`}>
          <Image
            className="w-auto h-12"
            src="/logo.svg"
            width={100}
            height={100}
            alt="Logo"
          />
        </Link>
        <Link href={`/${business_slug}/dashboard`}>
          <Image
            className="w-auto h-12"
            src="/logo.svg"
            width={100}
            height={100}
            alt="Logo"
          />
        </Link>
      </nav>
      <main className="bg-background rounded-md p-2">{children}</main>

      <div className="text-background px-4">Current Order</div>
    </div>
  );
}
