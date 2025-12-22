"use client";

import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { QueryData } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";
import { deleteCategory } from "@/app/[business_slug]/tables/categories/actions";

// 1. Initialize client just for type inference
const supabase = createClient();

// 2. Define the query exactly as it is in your Server Component
const categoriesQuery = supabase.from("categories").select(`
    id,
    name,
    businesses!inner(slug)
  `);

// 3. Export the inferred type for use in Actions and the Page
export type CategoryWithBusiness = QueryData<typeof categoriesQuery>[number];

const columnHelper = createColumnHelper<CategoryWithBusiness>();

/**
 * We wrap the columns in a function so we can pass the businessSlug
 * for the revalidation logic in our CRUD actions.
 */
export const categoryColumns = (
  businessSlug: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): ColumnDef<CategoryWithBusiness, any>[] => [
  columnHelper.accessor("id", {
    header: "ID",
    cell: (info) => (
      <span className="text-xs font-mono text-gray-400">
        {info.getValue().slice(0, 8)}
      </span>
    ),
  }),
  columnHelper.accessor("name", {
    header: "Category Name",
    cell: (info) => (
      <span className="font-medium capitalize text-gray-900">
        {info.getValue()}
      </span>
    ),
  }),
  columnHelper.accessor(
    (row) => {
      // Safely extract slug from the joined array Supabase returns
      const business = Array.isArray(row.businesses)
        ? row.businesses[0]
        : row.businesses;
      return business?.slug || "-";
    },
    {
      id: "business_slug",
      header: "Business",
      cell: (info) => (
        <span className="text-xs text-gray-500">{info.getValue()}</span>
      ),
    }
  ),
  columnHelper.display({
    id: "actions",
    header: "Actions",
    cell: (info) => {
      const categoryId = info.row.original.id;

      const handleDelete = async () => {
        if (confirm("Are you sure you want to delete this category?")) {
          try {
            await deleteCategory(categoryId, businessSlug);
          } catch (error) {
            alert("Failed to delete category.");
            console.error(error);
          }
        }
      };

      return (
        <div className="flex gap-4">
          <button
            className="text-blue-600 hover:text-blue-800 text-sm font-semibold transition-colors"
            onClick={() => console.log("Edit requested for:", categoryId)}
          >
            Edit
          </button>
          <button
            onClick={handleDelete}
            className="text-red-600 hover:text-red-800 text-sm font-semibold transition-colors"
          >
            Delete
          </button>
        </div>
      );
    },
  }),
];
