"use client";

import { useProperties } from "@/lib/firestore/products/read";
import { Button, CircularProgress, Badge, Input } from "@nextui-org/react";
import { Edit2, MapPin, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

export default function ListView() {
  const [pageLimit, setPageLimit] = useState(9);
  const [lastSnapDocList, setLastSnapDocList] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    setLastSnapDocList([]);
  }, [pageLimit]);

  const { data, isLoading, error, lastSnapDoc } = useProperties({
    pageLimit,
    lastSnapDoc:
      lastSnapDocList.length === 0
        ? null
        : lastSnapDocList[lastSnapDocList.length - 1],
  });

  /* 🔥 FORCE LATEST FIRST + SEARCH */
  const filteredData = useMemo(() => {
    if (!data) return [];

    const sorted = [...data].sort(
      (a, b) =>
        (b.timestampCreate || 0) - (a.timestampCreate || 0)
    );

    if (!search.trim()) return sorted;

    const q = search.toLowerCase();

    return sorted.filter((item) =>
      [
        item.title,
        item.location,
        item.developer,
      ]
        .join(" ")
        .toLowerCase()
        .includes(q)
    );
  }, [data, search]);

  const handleNext = () => {
    if (lastSnapDoc) {
      setLastSnapDocList((prev) => [...prev, lastSnapDoc]);
    }
  };

  const handlePrev = () => {
    setLastSnapDocList((prev) => prev.slice(0, -1));
  };

  if (isLoading)
    return (
      <div className="flex justify-center py-20">
        <CircularProgress />
      </div>
    );

  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="space-y-6">
      {/* 🔍 SEARCH BAR */}
      <Input
        placeholder="Search by project, location or developer..."
        startContent={<Search size={16} />}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredData.map((item) => (
          <PropertyCard key={item.id} item={item} />
        ))}
      </div>

      {/* PAGINATION */}
      {!search && (
        <div className="flex justify-between items-center pt-4">
          <Button
            size="sm"
            variant="bordered"
            isDisabled={lastSnapDocList.length === 0}
            onClick={handlePrev}
          >
            Previous
          </Button>

          <Button
            size="sm"
            variant="bordered"
            isDisabled={!lastSnapDoc}
            onClick={handleNext}
          >
            Next
          </Button>
        </div>
      )}
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

  return (
    <div className="bg-white rounded-2xl shadow hover:shadow-lg transition-all overflow-hidden flex flex-col">
      {/* IMAGE */}
      <div className="relative h-48">
        <img
          src={mainImage}
          alt={item.title}
          className="w-full h-full object-cover"
        />

        {/* STATUS */}
        <span className="absolute top-3 left-3 bg-green-600 text-white text-xs px-2 py-1 rounded">
          {item.status || "Active"}
        </span>
      </div>

      {/* CONTENT */}
      <div className="p-4 flex flex-col flex-1 justify-between">
        <div className="space-y-2">
          <h3 className="text-lg font-semibold truncate">
            {item.title}
          </h3>

          <p className="text-sm text-gray-500 flex items-center gap-1">
            <MapPin size={14} />
            {item.location}
          </p>

          <p className="text-sm font-medium">
            ₹ {item.minPrice?.toLocaleString()} – ₹{" "}
            {item.maxPrice?.toLocaleString()}
          </p>

          <p className="text-xs text-gray-600 line-clamp-2">
            {item.overview?.description ||
              "No description available."}
          </p>

          {item.developer && (
            <p className="text-xs text-gray-500">
              <strong>Developer:</strong> {item.developer}
            </p>
          )}

          {item.configurations?.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {item.configurations.map((conf, idx) => (
                <Badge key={idx} color="primary" variant="flat">
                  {conf}
                </Badge>
              ))}
            </div>
          )}
        </div>

        {/* FOOTER */}
        <div className="flex justify-between items-center mt-4">
          <span className="text-xs text-gray-400">
            Created:{" "}
            {item.timestampCreate
              ? new Date(
                  item.timestampCreate * 1000
                ).toLocaleDateString()
              : "—"}
          </span>

          <Button
            isIconOnly
            size="sm"
            className="bg-[#DBA40D]"
            onClick={() =>
              router.push(`/admin/properties/form?id=${item.id}`)
            }
          >
            <Edit2 size={14} />
          </Button>
        </div>
      </div>
    </div>
  );
}
