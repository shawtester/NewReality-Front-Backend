"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import toast from "react-hot-toast";

import { useBuilders } from "@/lib/firestore/builders/read";
import { deleteBuilder } from "@/lib/firestore/builders/write";

export default function BuildersPage() {
  const { builders, isLoading } = useBuilders();
  const [search, setSearch] = useState("");

  const handleDelete = async (id) => {
    if (!confirm("Delete this builder?")) return;

    try {
      await deleteBuilder({ id });
      toast.success("Builder deleted");
    } catch (err) {
      toast.error(err.message || "Delete failed");
    }
  };

  const filteredBuilders = builders.filter((b) =>
    b.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold">Builder List</h1>

        <Link
          href="/admin/builders/create"
          className="px-4 py-2 bg-green-500 text-white rounded"
        >
          Add Builder
        </Link>
      </div>

      {/* SEARCH */}
      <div className="max-w-sm">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search builder..."
          className="w-full border rounded-lg px-3 py-2 text-sm"
        />
      </div>

      {isLoading && (
        <p className="text-sm text-gray-400">
          Loading builders...
        </p>
      )}

      {/* TABLE */}
      <div className="bg-white rounded-xl overflow-x-auto shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-3 text-left w-14">S.No.</th>
              <th className="p-3 text-left">Builder</th>
              <th className="p-3 text-left">Description</th>
              <th className="p-3 text-left">Established</th>
              <th className="p-3 text-left">Ongoing</th>
              <th className="p-3 text-left">Cities</th>
              <th className="p-3 text-left">Auto Total</th>
              <th className="p-3 text-left">Manual Total</th> {/* 🔥 NEW */}
              <th className="p-3 text-left">Logo</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredBuilders.map((b, index) => (
              <tr key={b.id} className="border-t align-top">
                {/* S.NO */}
                <td className="p-3 text-gray-600">
                  {index + 1}
                </td>

                {/* NAME */}
                <td className="p-3 font-medium">
                  {b.name}
                </td>

                {/* DESCRIPTION */}
                <td className="p-3 max-w-[420px]">
                  {b.description ? (
                    <div
                      className="line-clamp-3 text-gray-700"
                      dangerouslySetInnerHTML={{
                        __html: b.description,
                      }}
                    />
                  ) : (
                    <span className="text-gray-400">
                      —
                    </span>
                  )}
                </td>

                {/* ESTABLISHED */}
                <td className="p-3">
                  {b.establishedYear || "—"}
                </td>

                {/* ONGOING */}
                <td className="p-3">
                  {b.ongoingProjects ?? 0}
                </td>

                {/* CITIES */}
                <td className="p-3">
                  {b.citiesPresent ?? 0}
                </td>

                {/* AUTO TOTAL */}
                <td className="p-3 font-semibold">
                  {b.totalProjects ?? 0}
                </td>

                {/* 🔥 MANUAL TOTAL */}
                <td className="p-3 font-semibold">
                  {b.manualTotalProjects ?? 0}
                </td>

                {/* LOGO */}
                <td className="p-3">
                  {b.logo?.url ? (
                    <Image
                      src={b.logo.url}
                      alt={b.name}
                      width={40}
                      height={40}
                      className="object-contain"
                    />
                  ) : (
                    <div className="h-10 w-10 bg-gray-100 flex items-center justify-center text-[10px] text-gray-400">
                      N/A
                    </div>
                  )}
                </td>

                {/* ACTIONS */}
                <td className="p-3 flex gap-2">
                  <Link
                    href={`/admin/builders/edit?id=${b.id}`}
                    className="px-3 py-1 bg-yellow-400 rounded text-xs"
                  >
                    Edit
                  </Link>

                  <button
                    onClick={() => handleDelete(b.id)}
                    className="px-3 py-1 bg-red-500 text-white rounded text-xs"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}

            {!isLoading &&
              filteredBuilders.length === 0 && (
                <tr>
                  <td
                    colSpan={10} // 🔥 updated colspan
                    className="p-6 text-center text-gray-400"
                  >
                    No builders found
                  </td>
                </tr>
              )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
