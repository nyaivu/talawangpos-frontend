"use client";

import { useState } from "react";
import { insertCategory } from "@/app/[business_slug]/tables/categories/actions";

export function AddCategory({
  businessId,
  slug,
}: {
  businessId: string;
  slug: string;
}) {
  const [name, setName] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await insertCategory(name, businessId, slug);
    setName("");
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 mb-6">
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="New Category Name"
        className="border px-3 py-2 rounded-lg text-sm w-64"
        required
      />
      <button
        type="submit"
        className="bg-black text-white px-4 py-2 rounded-lg text-sm"
      >
        Add
      </button>
    </form>
  );
}
