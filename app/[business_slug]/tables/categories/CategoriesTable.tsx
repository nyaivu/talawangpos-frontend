"use client";

import { useMemo, useState, useCallback } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
} from "@tanstack/react-table";
import { deleteCategory, insertCategory, updateCategory } from "./actions";
import { CategoryRow } from "@/interfaces/types";

interface Props {
  data: CategoryRow[];
  businessSlug: string;
  businessId: string;
}

const columnHelper = createColumnHelper<CategoryRow>();

export default function CategoriesTable({
  data,
  businessSlug,
  businessId,
}: Props) {
  const [newName, setNewName] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");

  const handleInsert = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    try {
      await insertCategory(newName, businessId, businessSlug);
      setNewName("");
    } catch (err) {
      alert("Failed to add category");
      console.error(err);
    }
  };

  // FIX: Wrap handleUpdate in useCallback to satisfy useMemo dependencies
  const handleUpdate = useCallback(
    async (id: string) => {
      try {
        await updateCategory(id, editValue, businessSlug);
        setEditingId(null);
      } catch (err) {
        alert("Failed to update");
        console.error(err);
      }
    },
    [editValue, businessSlug]
  );

  const columns = useMemo(
    () => [
      columnHelper.accessor("name", {
        header: "Category Name",
        cell: (info) => {
          const isEditing = editingId === info.row.original.id;
          return isEditing ? (
            <input
              className="border rounded px-2 py-1 w-full focus:ring-2 focus:ring-blue-500 outline-none"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              autoFocus
            />
          ) : (
            <span className="font-medium capitalize">{info.getValue()}</span>
          );
        },
      }),
      columnHelper.display({
        id: "actions",
        header: "Actions",
        cell: (info) => {
          const id = info.row.original.id;
          const isEditing = editingId === id;

          return (
            <div className="flex gap-3">
              {isEditing ? (
                <>
                  <button
                    onClick={() => handleUpdate(id)}
                    className="text-green-600 font-bold hover:text-green-700"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditingId(null)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => {
                      setEditingId(id);
                      setEditValue(info.row.original.name);
                    }}
                    className="text-blue-600 hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() =>
                      confirm("Delete this category?") &&
                      deleteCategory(id, businessSlug)
                    }
                    className="text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </>
              )}
            </div>
          );
        },
      }),
    ],
    [editingId, editValue, businessSlug, handleUpdate] // handleUpdate is now a stable dependency
  );

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="space-y-6">
      <form
        onSubmit={handleInsert}
        className="flex gap-2 p-4 bg-gray-50 rounded-lg border"
      >
        <input
          placeholder="New category name..."
          className="flex-1 border rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded-md text-sm font-bold hover:bg-blue-700 transition-colors"
        >
          Add
        </button>
      </form>

      <div className="rounded-lg border bg-white overflow-hidden shadow-sm">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 border-b border-gray-200">
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
          <tbody className="divide-y divide-gray-100">
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
    </div>
  );
}
