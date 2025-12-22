// app/[business_slug]/tables/categories/page.tsx
import { createClient } from "@/lib/supabase/server";
import CategoriesTable from "./CategoriesTable";
import { notFound } from "next/navigation";

export default async function CategoriesPage({
  params,
}: {
  params: Promise<{ business_slug: string }>;
}) {
  const { business_slug } = await params;
  const supabase = await createClient();

  const { data: business } = await supabase
    .from("businesses")
    .select("id")
    .eq("slug", business_slug)
    .single();

  if (!business) return notFound();

  const { data: categories } = await supabase
    .from("categories")
    .select("id, name, businesses!inner(slug)")
    .eq("businesses.slug", business_slug);

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Category Management</h1>
      <CategoriesTable
        data={categories || []}
        businessSlug={business_slug}
        businessId={business.id}
      />
    </div>
  );
}
