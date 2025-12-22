"use client";

import { useMemo, useState, useCallback } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
} from "@tanstack/react-table";
import { deleteProduct, updateProductWithImage } from "./actions";
import Image from "next/image"; // For optimized previews
import { ProductRow } from "@/interfaces/types";

const columnHelper = createColumnHelper<ProductRow>();

export default function ProductsTable({
  data,
  businessSlug,
  businessId,
  categories,
}: // eslint-disable-next-line @typescript-eslint/no-explicit-any
any) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<ProductRow>>({});
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleUpdate = async (id: string) => {
    const formData = new FormData();
    formData.append("name", editForm.name || "");
    formData.append("price", editForm.base_price?.toString() || "0");
    formData.append("stock", editForm.stock?.toString() || "0");
    formData.append("category_id", editForm.category_id || "");
    formData.append("business_id", businessId);
    formData.append("image_url", editForm.image_url || "");
    if (selectedFile) formData.append("image", selectedFile);

    try {
      await updateProductWithImage(id, formData, businessSlug);
      setEditingId(null);
      setSelectedFile(null);
    } catch (err) {
      alert("Update failed");
      console.error(err);
    }
  };

  const columns = useMemo(
    () => [
      columnHelper.accessor("image_url", {
        header: "Image",
        cell: (info) => {
          const isEditing = editingId === info.row.original.id;
          const currentUrl = info.getValue();

          return (
            <div className="flex flex-col gap-2">
              <div className="relative w-12 h-12 rounded border overflow-hidden bg-gray-50">
                {currentUrl ? (
                  <Image
                    src={currentUrl}
                    alt="Product"
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-[10px] text-gray-400">
                    No Img
                  </div>
                )}
              </div>
              {isEditing && (
                <input
                  type="file"
                  className="text-[10px] w-24"
                  onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                />
              )}
            </div>
          );
        },
      }),
      columnHelper.accessor("name", {
        header: "Name",
        cell: (info) =>
          editingId === info.row.original.id ? (
            <input
              className="border rounded px-2 py-1 w-full"
              value={editForm.name || ""}
              onChange={(e) =>
                setEditForm({ ...editForm, name: e.target.value })
              }
            />
          ) : (
            <span className="font-medium">{info.getValue()}</span>
          ),
      }),
      // ... rest of the columns (Price, Category) stay similar to before
      columnHelper.display({
        id: "actions",
        header: "Actions",
        cell: (info) => (
          <div className="flex gap-2">
            {editingId === info.row.original.id ? (
              <button
                onClick={() => handleUpdate(info.row.original.id)}
                className="text-green-600 font-bold"
              >
                Save
              </button>
            ) : (
              <button
                onClick={() => {
                  setEditingId(info.row.original.id);
                  setEditForm(info.row.original);
                }}
                className="text-blue-600"
              >
                Edit
              </button>
            )}
            <button
              onClick={() =>
                confirm("Delete?") &&
                deleteProduct(info.row.original.id, businessSlug)
              }
              className="text-red-600"
            >
              Delete
            </button>
          </div>
        ),
      }),
    ],
    [editingId, editForm, selectedFile, businessSlug, businessId]
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="rounded-lg border bg-white overflow-hidden shadow-sm">
      <table className="w-full text-sm text-left">
        <thead className="bg-gray-50 border-b">
          {table.getHeaderGroups().map((hg) => (
            <tr key={hg.id}>
              {hg.headers.map((h) => (
                <th key={h.id} className="px-6 py-4 font-semibold">
                  {flexRender(h.column.columnDef.header, h.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody className="divide-y">
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id} className="hover:bg-gray-50/50">
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="px-6 py-4">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
