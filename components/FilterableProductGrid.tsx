// components/FilterableProductGrid.tsx
"use client";

import { useState, useMemo } from "react";
import { Product } from "@/interfaces/types";
import ProductCard from "./ProductCard";

export default function FilterableProductGrid({
  initialProducts,
}: {
  initialProducts: Product[];
}) {
  const [activeCategory, setActiveCategory] = useState("All");

  // Get unique categories from the products we already fetched
  const categories = useMemo(() => {
    const names = initialProducts
      .map((p) => p.category?.name)
      .filter(Boolean) as string[];
    return ["All", ...Array.from(new Set(names))];
  }, [initialProducts]);

  // Instant filter logic
  const filteredProducts = useMemo(() => {
    if (activeCategory === "All") return initialProducts;
    return initialProducts.filter((p) => p.category?.name === activeCategory);
  }, [activeCategory, initialProducts]);

  return (
    <div className="flex flex-col h-full">
      {/* Instant Capsules */}
      <div className="flex gap-2 overflow-x-auto p-4 no-scrollbar whitespace-nowrap bg-background">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all border ${
              activeCategory === cat
                ? "bg-foreground text-background border-foreground"
                : "bg-white text-gray-600 border-gray-200 hover:bg-gray-100"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 p-4 overflow-y-auto">
        {filteredProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
