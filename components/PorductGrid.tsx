import { createClient } from "@/lib/supabase/server";
import ProductCard from "./ProductCard";

export default async function ProductGrid({
  business_slug,
}: {
  business_slug: string;
}) {
  const supabase = await createClient();

  const { data: products, error } = await supabase
    .from("products")
    .select(
      `
      id,
      name,
      base_price,
      image_url,
      stock,
      track_inventory,
      category:categories(name),
      businesses!inner(slug)
    `
    )
    // Filter by the business slug through the join
    .eq("businesses.slug", business_slug)
    .order("name");

  if (error) {
    console.error("Error Details:", {
      message: error.message,
      code: error.code,
      details: error.details,
      hint: error.hint,
    });
    return <div>Failed to load products.</div>;
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
      {products?.map((item) => {
        // Flatten the category array into a single object
        const productForCard = {
          ...item,
          category: Array.isArray(item.category)
            ? item.category[0]
            : item.category,
        };

        return <ProductCard key={item.id} product={productForCard} />;
      })}
    </div>
  );
}
