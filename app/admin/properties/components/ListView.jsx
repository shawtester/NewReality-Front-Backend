"use client";

import { useProperties } from "@/lib/firestore/products/read";
import {
  Button,
  CircularProgress,
  Badge,
  Input,
} from "@nextui-org/react";
import { Edit2, MapPin, Search, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

import { deleteProperty } from "@/lib/firestore/products/write"; // ✅ IMPORTANT

export default function ListView() {
  const [search, setSearch] = useState("");

  const { data, isLoading, error } = useProperties({
    pageLimit: 9999, // 🔥 load all
  });

  const filteredData = useMemo(() => {
    if (!data) return [];

    const sorted = [...data].sort(
      (a, b) =>
        (b.timestampCreate?.seconds || 0) -
        (a.timestampCreate?.seconds || 0)
    );

    if (!search.trim()) return sorted;

    const q = search.toLowerCase();

    return sorted.filter((item) =>
      [item.title, item.location, item.developer]
        .join(" ")
        .toLowerCase()
        .includes(q)
    );
  }, [data, search]);

  if (isLoading)
    return (
      <div className="flex justify-center py-20">
        <CircularProgress />
      </div>
    );

  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="space-y-6">
      <Input
        placeholder="Search by project, location or developer..."
        startContent={<Search size={16} />}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredData.map((item) => (
          <PropertyCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}

/* ================= PROPERTY CARD ================= */

function PropertyCard({ item }) {
  const router = useRouter();

  const mainImage =
    item.images?.[0] ||
    item.gallery?.[0]?.url ||
    "/placeholder.jpg";

  const isRecent =
    item.timestampCreate?.seconds &&
    Date.now() - item.timestampCreate.seconds * 1000 <
      3 * 24 * 60 * 60 * 1000;

  /* ✅ FINAL DELETE FIX */
  const handleDelete = async () => {
    const ok = window.confirm(
      "Are you sure you want to delete this property?"
    );
    if (!ok) return;

    try {
      await deleteProperty({ id: item.id }); // 🔥 YOUR WRITE.JS FUNCTION
    } catch (err) {
      console.error(err);
      alert("Delete Failed");
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl hover:shadow-md transition-all overflow-hidden flex flex-col">
      {/* IMAGE */}
      <div className="relative h-36">
        <img
          src={mainImage}
          alt={item.title}
          className="w-full h-full object-cover"
        />

        <span className="absolute top-2 left-2 bg-green-600 text-white text-[10px] px-2 py-[2px] rounded-md">
          {item.status || "Active"}
        </span>

        {isRecent && (
          <span className="absolute top-2 right-2 bg-[#DBA40D] text-white text-[10px] px-2 py-[2px] rounded-md">
            NEW
          </span>
        )}
      </div>

      {/* CONTENT */}
      <div className="p-3 flex flex-col flex-1 justify-between">
        <div className="space-y-1">
          <h3 className="text-sm font-semibold truncate">
            {item.title}
          </h3>

          <p className="text-[12px] text-gray-500 flex items-center gap-1">
            <MapPin size={12} />
            {item.location}
          </p>

          <p className="text-[13px] font-medium text-black">
            ₹ {item.minPrice?.toLocaleString()} – ₹{" "}
            {item.maxPrice?.toLocaleString()}
          </p>

          {item.developer && (
            <p className="text-[11px] text-gray-500 truncate">
              {item.developer}
            </p>
          )}

          {item.configurations?.length > 0 && (
            <div className="flex flex-wrap gap-1 pt-1">
              {item.configurations.slice(0, 3).map((conf, idx) => (
                <Badge key={idx} size="sm" color="primary" variant="flat">
                  {conf}
                </Badge>
              ))}
            </div>
          )}
        </div>

        {/* 🔥 FOOTER BUTTONS */}
        <div className="flex justify-between items-center mt-3">
          {/* EDIT */}
          <Button
            isIconOnly
            size="sm"
            className="bg-[#DBA40D] min-w-0 w-7 h-7"
            onClick={() =>
              router.push(`/admin/properties/form?id=${item.id}`)
            }
          >
            <Edit2 size={12} />
          </Button>

          {/* DELETE RED */}
          <Button
            isIconOnly
            size="sm"
            color="danger"
            className="min-w-0 w-7 h-7"
            onClick={handleDelete}
          >
            <Trash2 size={12} />
          </Button>
        </div>
      </div>
    </div>
  );
}

