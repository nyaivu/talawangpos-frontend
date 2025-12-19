"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    // 1. Sign out from Supabase
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("Error logging out:", error.message);
    } else {
      // 2. Clear local state and redirect to login
      // We use router.refresh() to ensure the middleware picks up the session change
      router.push("/login");
      router.refresh();
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="text-sm font-medium text-red-600 hover:text-red-500"
    >
      Sign Out
    </button>
  );
}
