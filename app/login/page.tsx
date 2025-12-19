"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client"; // Your supabase client helper
import { useRouter } from "next/navigation";

// Define the shape of your join
interface ProfileWithBusiness {
  business_id: string;
  businesses:
    | {
        slug: string;
      }
    | { slug: string }[]; // Handle both object and array possibilities
}

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // 1. Sign in the user
    const { data: authData, error: authError } =
      await supabase.auth.signInWithPassword({
        email,
        password,
      });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    // 2. Fetch the business slug for this user
    // We join 'businesses' to get the slug needed for the URL
    const { data: profile, error: profileError } = await supabase
      .from("staff_profiles")
      .select(
        `
      businesses (
        slug
      )
    `
      )
      .eq("id", authData.user.id)
      .single<ProfileWithBusiness>();

    if (profileError || !profile?.businesses) {
      setError(
        `No business associated with this account. ${authData.user.id} ${profileError?.message}`
      );
      setLoading(false);
      return;
    }

    // 3. Redirect to the dynamic business route
    // Handle case where businesses might return an array or object
    const slug = Array.isArray(profile.businesses)
      ? profile.businesses[0].slug
      : profile.businesses.slug;

    router.push(`/${slug}/dashboard`);
    router.refresh();
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-foreground px-4">
      <div className="w-full max-w-md rounded-xl bg-background p-8 shadow-lg">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">
            Sign in to POS
          </h2>
          <p className="mt-2 text-sm text-gray-600">Enter your credentials</p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          {error && (
            <div className="rounded-md bg-red-50 p-3 text-sm text-red-500">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <input
                type="email"
                required
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-primary"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                type="password"
                required
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-primary"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-primary py-2 px-4 text-background font-semibold hover:bg-primary focus:outline-none disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
