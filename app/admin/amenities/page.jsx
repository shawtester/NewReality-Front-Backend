"use client";

import { useState } from "react";
import Link from "next/link";
import { useAmenities } from "@/lib/firestore/amenities/read";
import { deleteAmenity } from "@/lib/firestore/amenities/write";
import toast from "react-hot-toast";

export default function AmenitiesPage() {
  const { amenities, isLoading } = useAmenities();
  const [search, setSearch] = useState("");

  const handleDelete = async (id) => {
    if (!confirm("Delete this amenity?")) return;
    await deleteAmenity({ id });
    toast.success("Amenity deleted");
  };

  // 🔎 Filtered list
  const filteredAmenities = amenities.filter((a) =>
    a.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold">Amenities</h1>
        <Link
          href="/admin/amenities/create"
          className="px-4 py-2 bg-black text-white rounded"
        >
          Add Amenity
        </Link>
      </div>

      {/* SEARCH BAR */}
      <div className="max-w-sm">
        <input
          type="text"
          placeholder="Search amenities..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border rounded-lg px-3 py-2 text-sm"
        />
      </div>

      {isLoading && <p>Loading...</p>}

      {/* TABLE */}
      <div className="bg-white rounded-xl overflow-hidden shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-3 text-left w-16">S.No.</th>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Image</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredAmenities.map((a, index) => (
              <tr key={a.id} className="border-t">
                <td className="p-3 text-gray-600">
                  {index + 1}
                </td>

                <td className="p-3">{a.name}</td>

                <td className="p-3">
                  {a.image?.url ? (
                    <img
                      src={a.image.url}
                      className="h-10 w-10 rounded object-cover"
                    />
                  ) : (
                    <div className="h-10 w-10 rounded bg-gray-200 flex items-center justify-center text-[10px] text-gray-500">
                      N/A
                    </div>
                  )}
                </td>

                <td className="p-3 flex gap-2">
                  <Link
                    href={`/admin/amenities/edit?id=${a.id}`}
                    className="px-3 py-1 bg-yellow-400 rounded text-xs"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(a.id)}
                    className="px-3 py-1 bg-red-500 text-white rounded text-xs"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}

            {!isLoading && filteredAmenities.length === 0 && (
              <tr>
                <td
                  colSpan={4}
                  className="p-6 text-center text-gray-400"
                >
                  No amenities found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
