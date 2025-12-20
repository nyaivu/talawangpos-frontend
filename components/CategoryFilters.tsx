"use client";

import { useRouter, useSearchParams } from "next/navigation";

interface Category {
  id: string;
  name: string;
}

export function CategoryFilters({ categories }: { categories: Category[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeCategory = searchParams.get("category") || "All";

  const handleFilter = (name: string) => {
    const params = new URLSearchParams(searchParams);
    if (name === "All") {
      params.delete("category");
    } else {
      params.set("category", name);
    }
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-4 no-scrollbar">
      <button
        onClick={() => handleFilter("All")}
        className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
          activeCategory === "All"
            ? "bg-foreground text-background"
            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
        }`}
      >
        All
      </button>
      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => handleFilter(cat.name)}
          className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
            activeCategory === cat.name
              ? "bg-foreground text-background"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          {cat.name}
        </button>
      ))}
    </div>
  );
}
