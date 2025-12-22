// app/[business_slug]/layout.tsx
import LogoutButton from "@/components/LogoutButton";
import OrderSidebar from "@/components/OrderSidebar";
import { createClient } from "@/lib/supabase/server";
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

  const { data: profile, error } = await supabase
    .from("staff_profiles")
    .select(
      `
      business_id,
      store_id,
      role,
      full_name
    `
    )
    .eq("id", user.id) // staff_profiles.id usually matches auth.users.id
    .single();

  if (error || !profile) {
    // User is logged in, but doesn't belong to THIS business URL
    console.error(error.message);
    return notFound();
  }

  return (
    <div className="min-h-screen bg-foreground py-4 grid grid-cols-[max-content_5fr_3fr] md:grid-cols-[max-content_5fr_2fr]">
      <nav className="text-background flex flex-col items-center gap-8 px-4 py-2">
        {/* Home Button */}
        <Link href="/">
          <svg
            width="140"
            height="327"
            viewBox="0 0 140 327"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-auto h-14"
          >
            <path
              d="m73.345 3.01 65 58.5L140 63v198.396l-1.584 1.481-65 60.827L70 326.901l-3.416-3.197-65-60.827L0 261.396V63l1.655-1.49 65-58.5L70 0zM10 67.453v189.605l60 56.148 60-56.148V67.453l-60-54zm59.5 39.601a55.003 55.003 0 0 1 55 55 55.01 55.01 0 0 1-33.952 50.813 55 55 0 0 1-71.861-29.765 55.005 55.005 0 0 1 11.922-59.939A55 55 0 0 1 69.5 107.054m0 10a45 45 0 1 0 0 89.998 45 45 0 0 0 0-89.998m0 6.667a5 5 0 0 1 5 5v3.841c3.209.665 6.264 1.981 8.862 3.947l.376.292.001.001 2.306 1.833a5 5 0 1 1-6.224 7.827l-2.304-1.833a11.3 11.3 0 0 0-3.017-1.687v14.576c3.496.657 6.898 2.026 9.79 4.201h-.002c4.314 3.237 6.879 7.832 6.879 12.835s-2.567 9.601-6.884 12.839c-2.89 2.167-6.288 3.537-9.783 4.196v3.798a5 5 0 0 1-10 0v-3.797c-3.496-.658-6.895-2.029-9.785-4.198v-.001l-4.881-3.659a5 5 0 0 1 5.999-8.002l4.883 3.662.003.002c1.075.807 2.362 1.449 3.781 1.902v-14.754c-3.31-.686-6.515-2.073-9.236-4.233l-.002-.002c-4.134-3.285-6.498-7.869-6.498-12.753s2.364-9.468 6.498-12.753c2.678-2.128 5.873-3.541 9.238-4.239v-3.841a5 5 0 0 1 5-5m5 57.574c1.42-.453 2.707-1.095 3.783-1.902 2.195-1.646 2.884-3.447 2.884-4.839s-.69-3.193-2.884-4.839l-.005-.004c-1.072-.807-2.358-1.449-3.778-1.9zm-10-38.353a11.3 11.3 0 0 0-3.017 1.687c-2.01 1.598-2.72 3.412-2.72 4.925s.709 3.325 2.718 4.923l.396.298a11.5 11.5 0 0 0 2.623 1.387z"
              fill="currentColor"
            />
          </svg>
        </Link>
        <Link href="/orders">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-auto h-10"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m9 14.25 6-6m4.5-3.493V21.75l-3.75-1.5-3.75 1.5-3.75-1.5-3.75 1.5V4.757c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0c1.1.128 1.907 1.077 1.907 2.185ZM9.75 9h.008v.008H9.75V9Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm4.125 4.5h.008v.008h-.008V13.5Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
            />
          </svg>
        </Link>
        <Link href="/tables">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-auto h-10"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 0 1-1.125-1.125M3.375 19.5h7.5c.621 0 1.125-.504 1.125-1.125m-9.75 0V5.625m0 12.75v-1.5c0-.621.504-1.125 1.125-1.125m18.375 2.625V5.625m0 12.75c0 .621-.504 1.125-1.125 1.125m1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125m0 3.75h-7.5A1.125 1.125 0 0 1 12 18.375m9.75-12.75c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125m19.5 0v1.5c0 .621-.504 1.125-1.125 1.125M2.25 5.625v1.5c0 .621.504 1.125 1.125 1.125m0 0h17.25m-17.25 0h7.5c.621 0 1.125.504 1.125 1.125M3.375 8.25c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125m17.25-3.75h-7.5c-.621 0-1.125.504-1.125 1.125m8.625-1.125c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h7.5m-7.5 0c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125M12 10.875v-1.5m0 1.5c0 .621-.504 1.125-1.125 1.125M12 10.875c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125M13.125 12h7.5m-7.5 0c-.621 0-1.125.504-1.125 1.125M20.625 12c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h7.5M12 14.625v-1.5m0 1.5c0 .621-.504 1.125-1.125 1.125M12 14.625c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125m0 1.5v-1.5m0 0c0-.621.504-1.125 1.125-1.125m0 0h7.5"
            />
          </svg>
        </Link>

        <LogoutButton />
      </nav>
      <main className="bg-background rounded-md p-2">{children}</main>

      <OrderSidebar
        businessId={profile.business_id}
        storeId={profile.store_id}
        userId={user.id}
      />
    </div>
  );
}
