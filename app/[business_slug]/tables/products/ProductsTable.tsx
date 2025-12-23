/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useMemo, useState, useCallback, useRef, useEffect, memo } from "react";
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

/**
 * FIX 1: Isolated Input Component
 * Manages its own focus and local state to prevent jumping.
 */
const StableInput = memo(({ initialValue, onSave, type = "text" }: any) => {
  const [localValue, setLocalValue] = useState(initialValue);
  useEffect(() => {
    setLocalValue(initialValue);
  }, [initialValue]);

  return (
    <input
      type={type}
      className="border rounded px-2 py-1 w-full focus:ring-2 focus:ring-blue-500 outline-none"
      value={localValue ?? ""}
      onChange={(e) => {
        setLocalValue(e.target.value);
        onSave(e.target.value);
      }}
    />
  );
});
StableInput.displayName = "StableInput";

export default function ProductsTable({
  data,
  businessSlug,
  businessId,
  categories,
}: any) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<any>({});
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // FIX 2: Stable Reference for the Update Handler
  const editFormRef = useRef(editForm);
  useEffect(() => {
    editFormRef.current = editForm;
  }, [editForm]);

  const handleUpdate = useCallback(
    async (id: string) => {
      const currentForm = editFormRef.current;
      const formData = new FormData();
      formData.append("name", currentForm.name || "");
      formData.append("base_price", currentForm.base_price?.toString() || "0");
      formData.append("category_id", currentForm.category_id || "");
      formData.append("stock", currentForm.stock?.toString() || "0");
      formData.append(
        "track_inventory",
        currentForm.track_inventory ? "true" : "false"
      );
      formData.append("business_id", businessId);
      if (selectedFile) formData.append("image", selectedFile);

      try {
        await updateProductWithImage(id, formData, businessSlug);
        setEditingId(null);
        setEditForm({});
        setSelectedFile(null);
      } catch (err) {
        console.error("Update failed:", err);
      }
    },
    [businessId, businessSlug, selectedFile]
  );

  // FIX 3: Static Column Definitions
  const columns = useMemo(
    () => [
      columnHelper.accessor("image_url", {
        header: "Image",
        cell: (info) => (
          <div className="flex flex-col gap-2">
            <div className="relative w-12 h-12 rounded border overflow-hidden bg-gray-50">
              {info.getValue() ? (
                <Image
                  src={info.getValue()!}
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
            {editingId === info.row.original.id && (
              <input
                type="file"
                className="text-[10px] w-32"
                onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
              />
            )}
          </div>
        ),
      }),
      columnHelper.accessor("name", {
        header: "Name",
        cell: (info) =>
          editingId === info.row.original.id ? (
            <StableInput
              initialValue={editForm.name ?? info.getValue() ?? ""}
              onSave={(val: string) =>
                setEditForm((p: any) => ({ ...p, name: val }))
              }
            />
          ) : (
            <span className="font-medium">{info.getValue()}</span>
          ),
      }),
      columnHelper.accessor("base_price", {
        header: "Price",
        cell: (info) =>
          editingId === info.row.original.id ? (
            <StableInput
              type="number"
              initialValue={editForm.base_price ?? info.getValue() ?? 0}
              onSave={(val: string) =>
                setEditForm((p: any) => ({ ...p, base_price: val }))
              }
            />
          ) : (
            <span>
              {new Intl.NumberFormat("id-ID", {
                style: "currency",
                currency: "IDR",
              }).format(info.getValue() || 0)}
            </span>
          ),
      }),
      columnHelper.accessor("stock", {
        header: "Stock",
        cell: (info) =>
          editingId === info.row.original.id ? (
            <StableInput
              type="number"
              initialValue={editForm.stock ?? info.getValue() ?? 0}
              onSave={(val: string) =>
                setEditForm((p: any) => ({ ...p, stock: val }))
              }
            />
          ) : (
            <span>{info.getValue() ?? 0}</span>
          ),
      }),
      columnHelper.accessor("track_inventory" as any, {
        header: "Track",
        cell: (info: any) =>
          editingId === info.row.original.id ? (
            <input
              type="checkbox"
              checked={editForm.track_inventory ?? info.getValue() ?? false}
              onChange={(e) =>
                setEditForm((p: any) => ({
                  ...p,
                  track_inventory: e.target.checked,
                }))
              }
            />
          ) : (
            <span>{info.getValue() ? "Yes" : "No"}</span>
          ),
      }),
      columnHelper.accessor("category_id", {
        header: "Category",
        cell: (info) => {
          if (editingId === info.row.original.id) {
            return (
              <select
                className="border rounded px-2 py-1 w-full text-sm"
                value={editForm.category_id ?? info.getValue() ?? ""}
                onChange={(e) =>
                  setEditForm((p: any) => ({
                    ...p,
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
            );
          }
          return (
            <span>
              {(info.row.original as any).categories?.name || "Uncategorized"}
            </span>
          );
        },
      }),
      columnHelper.display({
        id: "actions",
        header: "Actions",
        cell: (info) => (
          <div className="flex gap-2 text-sm">
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
      // eslint-disable-next-line react-hooks/exhaustive-deps
    ],
    [
      editingId,
      editForm.track_inventory,
      editForm.category_id,
      categories,
      businessSlug,
      handleUpdate,
    ]
  );

  const table = useReactTable({
    data: data || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="border rounded-lg bg-white overflow-hidden shadow-sm">
      <table className="w-full text-left text-sm">
        <thead className="bg-gray-50 border-b">
          {table.getHeaderGroups().map((hg) => (
            <tr key={hg.id}>
              {hg.headers.map((h) => (
                <th key={h.id} className="p-4 font-semibold text-gray-700">
                  {flexRender(h.column.columnDef.header, h.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody className="divide-y">
          {table.getRowModel().rows.map((row) => (
            <tr key={row.original.id} className="hover:bg-gray-50/50">
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="px-4 py-4">
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
