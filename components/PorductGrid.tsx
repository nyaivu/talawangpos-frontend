// components/ProductGrid.tsx
import { createClient } from "@/lib/supabase/server";
import { Product } from "@/interfaces/product";
import ProductCard from "./ProductCard";
import CategoryCapsules from "./CategoryCapsules";

interface SupabaseProductResponse {
  id: string;
  name: string;
  base_price: number;
  image_url: string | null;
  stock: number;
  track_inventory: boolean;
  category_id: string; // Ensure this is here for strict checking
  category: { name: string } | { name: string }[] | null;
}

export default async function ProductGrid({
  business_slug,
  categoryId = "All",
}: {
  business_slug: string;
  categoryId?: string;
}) {
  const supabase = await createClient();

  // 1. Fetch categories for the capsules
  const { data: catData } = await supabase
    .from("categories")
    .select("id, name, businesses!inner(slug)")
    .eq("businesses.slug", business_slug);

  const categories = catData || [];

  // 2. Build the Product Query
  // We remove businesses!inner from select to keep it clean,
  // but we keep it in the filter to ensure data belongs to this slug.
  let query = supabase
    .from("products")
    .select(
      `
      id, 
      name, 
      base_price, 
      image_url, 
      stock, 
      track_inventory,
      category_id,
      category:categories(name),
      businesses!inner(slug)
    `
    )
    .eq("businesses.slug", business_slug);

  // 3. THE ABSOLUTE FILTER: Filter by the direct column 'category_id'
  // Direct column filters on the parent table CANNOT "ghost".
  if (categoryId && categoryId !== "All" && categoryId !== "undefined") {
    query = query.eq("category_id", categoryId);
  }

  const { data, error } = await query.order("name");

  if (error) {
    console.error("Supabase Query Error:", error);
    return <div className="p-4">Error loading products.</div>;
  }

  const rawProducts = (data as unknown as SupabaseProductResponse[]) || [];

  return (
    <div className="flex flex-col w-full">
      <CategoryCapsules categories={categories} />

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 p-4">
        {rawProducts.map((item) => {
          const categoryObj = Array.isArray(item.category)
            ? item.category[0]
            : item.category;

          const product: Product = {
            id: item.id,
            name: item.name,
            base_price: item.base_price,
            image_url: item.image_url || "",
            stock: item.stock,
            track_inventory: item.track_inventory,
            category: categoryObj || null,
          };

          return <ProductCard key={product.id} product={product} />;
        })}

        {rawProducts.length === 0 && (
          <div className="col-span-full py-20 text-center text-gray-400">
            No items found.
          </div>
        )}
      </div>
    </div>
  );
}
