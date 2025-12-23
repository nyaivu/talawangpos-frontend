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

/** * FIX 1: Memoized Input component moved OUTSIDE.
 * This traps focus locally so parent re-renders don't affect the cursor.
 */
const TableInput = memo(({ initialValue, onSave, type = "text" }: any) => {
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
TableInput.displayName = "TableInput";

export default function ProductsTable({
  data,
  businessSlug,
  businessId,
  categories,
}: any) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<ProductRow>>({});
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  /** * FIX 2: Stable Data Reference.
   * Prevents the table from re-processing rows when page.tsx revalidates data.
   */
  const stableData = useRef(data);
  useEffect(() => {
    if (!editingId) stableData.current = data;
  }, [data, editingId]);

  const handleUpdate = useCallback(
    async (id: string) => {
      const formData = new FormData();
      formData.append("name", editForm.name || "");
      formData.append("base_price", editForm.base_price?.toString() || "0");
      formData.append("stock", editForm.stock?.toString() || "0");
      formData.append("category_id", editForm.category_id || "");
      formData.append("business_id", businessId);
      if (selectedFile) formData.append("image", selectedFile);

      try {
        await updateProductWithImage(id, formData, businessSlug);
        setEditingId(null);
        setEditForm({});
        setSelectedFile(null);
      } catch (err) {
        console.error("Update failed", err);
      }
    },
    [editForm, businessId, businessSlug, selectedFile]
  );

  /** * FIX 3: Memoized Columns with primitive dependencies.
   * This ensures the table structure is "frozen" during typing.
   */
  const columns = useMemo(
    () => [
      columnHelper.accessor("image_url", {
        header: "Image",
        cell: (info) => (
          <div className="flex flex-col gap-1">
            <div className="relative w-10 h-10 rounded border overflow-hidden bg-gray-50">
              {info.getValue() ? (
                <Image
                  src={info.getValue()!}
                  alt="Product"
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-200" />
              )}
            </div>
            {editingId === info.row.original.id && (
              <input
                type="file"
                className="text-[8px] w-20"
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
            <TableInput
              initialValue={editForm.name ?? info.getValue() ?? ""}
              onSave={(val: string) =>
                setEditForm((prev) => ({ ...prev, name: val }))
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
            <TableInput
              type="number"
              initialValue={editForm.base_price ?? info.getValue() ?? 0}
              onSave={(val: string) =>
                setEditForm((prev) => ({
                  ...prev,
                  base_price: parseFloat(val) || 0,
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
              className="border rounded px-2 py-1 w-full text-sm"
              value={editForm.category_id ?? info.getValue() ?? ""}
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [editingId, categories, businessSlug, handleUpdate]
  );

  const table = useReactTable({
    data: stableData.current || [],
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
            <tr key={row.original.id} className="hover:bg-gray-50/50">
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
