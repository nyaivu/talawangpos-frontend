// app/[business_slug]/tables/products/page.tsx
import { createClient } from "@/lib/supabase/server";
import ProductsTable from "./ProductsTable";
import CreateProductModal from "./CreateProductModal"; // Import the modal
import { notFound } from "next/navigation";

export default async function ProductsPage({
  params,
}: {
  params: Promise<{ business_slug: string }>;
}) {
  const { business_slug } = await params;
  const supabase = await createClient();

  // 1. Fetch Business ID
  const { data: business } = await supabase
    .from("businesses")
    .select("id")
    .eq("slug", business_slug)
    .single();

  if (!business) return notFound();

  // 2. Fetch categories for the modal dropdown
  const { data: categories } = await supabase
    .from("categories")
    .select("id, name")
    .eq("business_id", business.id);

  // 3. Fetch products for the table
  const { data: products } = await supabase
    .from("products")
    .select("*, categories(name)")
    .eq("business_id", business.id);

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Product Management</h1>
        {/* Modal sits at the top level for easy access */}
        <CreateProductModal
          businessId={business.id}
          businessSlug={business_slug}
          categories={categories || []}
        />
      </div>

      <ProductsTable
        data={products || []}
        businessSlug={business_slug}
        businessId={business.id}
        categories={categories || []}
      />
    </div>
  );
}
