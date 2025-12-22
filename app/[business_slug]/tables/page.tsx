// app/[business_slug]/tables/page.tsx
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import {
  LayoutGrid,
  Users,
  Package,
  ShoppingCart,
  Settings,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function TablesIndexPage({
  params,
}: {
  params: Promise<{ business_slug: string }>;
}) {
  const { business_slug } = await params;
  const supabase = await createClient();

  // Verify authentication to ensure RLS context is active
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // Fetch business info to verify existence and access
  const { data: business } = await supabase
    .from("businesses")
    .select("id, name")
    .eq("slug", business_slug)
    .single();

  if (!business)
    return <div className="p-8 text-red-500">Business not found.</div>;

  const availableTables = [
    {
      title: "Categories",
      description: "Manage product groupings and organization.",
      href: `/tables/categories`,
      icon: <LayoutGrid className="w-6 h-6 text-blue-500" />,
    },
    {
      title: "Staff Members",
      description: "Manage employee access and profiles.",
      href: `/tables/staff`,
      icon: <Users className="w-6 h-6 text-green-500" />,
    },
    {
      title: "Products",
      description: "Inventory management and pricing.",
      href: `/tables/products`,
      icon: <Package className="w-6 h-6 text-purple-500" />,
    },
    {
      title: "Transactions",
      description: "View sales history and order details.",
      href: `/tables/transactions`,
      icon: <ShoppingCart className="w-6 h-6 text-orange-500" />,
    },
  ];

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <header className="mb-10">
        <h1 className="text-3xl font-bold text-gray-900">
          {business.name} Management
        </h1>
        <p className="text-gray-500">
          Select a table to view and manage your data.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {availableTables.map((table) => (
          <Link
            key={table.href}
            href={table.href}
            className="group block p-6 bg-white border rounded-xl shadow-sm hover:shadow-md transition-all hover:border-blue-200"
          >
            <div className="flex items-start gap-4">
              <div className="p-3 bg-gray-50 rounded-lg group-hover:bg-blue-50 transition-colors">
                {table.icon}
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600">
                  {table.title}
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  {table.description}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
