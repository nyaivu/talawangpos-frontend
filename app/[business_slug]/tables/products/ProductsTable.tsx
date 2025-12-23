/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useMemo, useState, useCallback } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
} from "@tanstack/react-table";
import { deleteProduct, updateProductWithImage } from "./actions";
import Image from "next/image";
import { ProductRow } from "@/interfaces/types";

const columnHelper = createColumnHelper<ProductRow>();

const EditableCell = ({
  value,
  onChange,
  type = "text",
}: {
  value: string | number;
  onChange: (val: string) => void;
  type?: string;
}) => {
  return (
    <input
      type={type}
      className="border rounded px-2 py-1 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );
};

export default function ProductsTable({
  data,
  businessSlug,
  businessId,
  categories,
}: any) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<ProductRow>>({});
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Wrap in useCallback to satisfy linter and prevent unnecessary re-creations
  const handleUpdate = useCallback(
    async (id: string) => {
      const formData = new FormData();
      formData.append("name", editForm.name || "");
      formData.append("base_price", editForm.base_price?.toString() || "0");
      formData.append("stock", editForm.stock?.toString() || "0");
      formData.append("category_id", editForm.category_id || "");
      formData.append("business_id", businessId);
      formData.append("image_url", editForm.image_url || "");
      if (selectedFile) formData.append("image", selectedFile);

      try {
        await updateProductWithImage(id, formData, businessSlug);
        setEditingId(null);
        setSelectedFile(null);
        setEditForm({});
      } catch (err) {
        alert("Update failed");
        console.error(err);
      }
    },
    [editForm, businessId, businessSlug, selectedFile]
  );

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
            <EditableCell
              value={editForm.name || ""}
              onChange={(val) =>
                setEditForm((prev) => ({ ...prev, name: val }))
              }
            />
          ) : (
            <span className="font-medium">{info.getValue()}</span>
          ),
      }),
      columnHelper.accessor("base_price", {
        header: "Base Price",
        cell: (info) =>
          editingId === info.row.original.id ? (
            <EditableCell
              type="number"
              value={editForm.base_price || 0}
              onChange={(val) =>
                setEditForm((prev) => ({
                  ...prev,
                  base_price: parseFloat(val),
                }))
              }
            />
          ) : (
            <span>
              {new Intl.NumberFormat("id-ID", {
                style: "currency",
                currency: "IDR",
              }).format(info.getValue())}
            </span>
          ),
      }),
      columnHelper.accessor("category_id", {
        header: "Category",
        cell: (info) => {
          const isEditing = editingId === info.row.original.id;
          return isEditing ? (
            <select
              className="border rounded px-2 py-1 w-full"
              value={editForm.category_id || ""}
              onChange={(e) =>
                setEditForm((prev) => ({
                  ...prev,
                  category_id: e.target.value,
                }))
              }
            >
              <option value="">Select Category</option>
              {categories.map((cat: any) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          ) : (
            <span>{info.row.original.categories?.name || "Uncategorized"}</span>
          );
        },
      }),
      columnHelper.display({
        id: "actions",
        header: "Actions",
        cell: (info) => (
          <div className="flex gap-2">
            {editingId === info.row.original.id ? (
              <button
                onClick={() => handleUpdate(info.row.original.id)}
                className="text-green-600 font-bold hover:underline"
              >
                Save
              </button>
            ) : (
              <button
                onClick={() => {
                  setEditingId(info.row.original.id);
                  setEditForm(info.row.original);
                }}
                className="text-blue-600 hover:underline"
              >
                Edit
              </button>
            )}
            <button
              onClick={() =>
                confirm("Delete?") &&
                deleteProduct(info.row.original.id, businessSlug)
              }
              className="text-red-600 hover:underline"
            >
              Delete
            </button>
          </div>
        ),
      }),
    ],
    // We intentionally omit editForm fields to keep focus during typing
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      editingId,
      selectedFile,
      businessSlug,
      businessId,
      categories,
      handleUpdate,
    ]
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
                <th
                  key={h.id}
                  className="px-6 py-4 font-semibold text-gray-700"
                >
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
