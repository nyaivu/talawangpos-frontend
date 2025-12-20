// components/CategoryCapsules.tsx
"use client";

import { useRouter, useSearchParams } from "next/navigation";

export default function CategoryCapsules({
  categories,
}: {
  categories: { id: string; name: string }[];
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeCategoryId = searchParams.get("categoryId") || "All";

  const setCategory = (id: string) => {
    const params = new URLSearchParams(searchParams);
    if (id === "All") params.delete("categoryId");
    else params.set("categoryId", id);
    router.push(`?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="flex gap-2 overflow-x-auto p-4 no-scrollbar whitespace-nowrap">
      <button
        onClick={() => setCategory("All")}
        className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
          activeCategoryId === "All"
            ? "bg-black text-white"
            : "bg-gray-100 text-gray-600"
        }`}
      >
        All
      </button>
      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => setCategory(cat.id)}
          className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
            activeCategoryId === cat.id
              ? "bg-black text-white"
              : "bg-gray-100 text-gray-600"
          }`}
        >
          {cat.name}
        </button>
      ))}
    </div>
  );
}
