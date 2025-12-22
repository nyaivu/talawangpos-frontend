"use client";

import { useState } from "react";
import { createProductWithImage } from "./actions";

interface Props {
  businessId: string;
  businessSlug: string;
  categories: { id: string; name: string }[];
}

export default function CreateProductModal({
  businessId,
  businessSlug,
  categories,
}: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    formData.append("business_id", businessId);

    try {
      await createProductWithImage(formData, businessSlug);
      setIsOpen(false);
    } catch (err) {
      alert(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }

  if (!isOpen)
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-blue-700"
      >
        + New Product
      </button>
    );

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="flex justify-between items-center border-b pb-4">
            <h2 className="text-xl font-bold">Add New Product</h2>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-black"
            >
              ✕
            </button>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold">Product Image</label>
            <input
              type="file"
              name="image"
              accept="image/*"
              className="w-full text-sm border rounded-lg p-2"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold">Product Name</label>
            <input
              required
              name="name"
              type="text"
              placeholder="e.g. Iced Latte"
              className="w-full border rounded-lg p-2"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold">Price</label>
              <input
                required
                name="price"
                type="number"
                placeholder="0"
                className="w-full border rounded-lg p-2"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold">Stock</label>
              <input
                required
                name="stock"
                type="number"
                placeholder="0"
                className="w-full border rounded-lg p-2"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold">Category</label>
            <select
              required
              name="category_id"
              className="w-full border rounded-lg p-2"
            >
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="flex-1 px-4 py-2 border rounded-lg font-semibold hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? "Saving..." : "Create Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
