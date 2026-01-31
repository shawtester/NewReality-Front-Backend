"use client";

import { useProperties } from "@/lib/firestore/products/read";
import { Button, CircularProgress, Badge } from "@nextui-org/react";
import { Edit2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function ListView() {
  const [pageLimit, setPageLimit] = useState(10);
  const [lastSnapDocList, setLastSnapDocList] = useState([]);

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

  const handleNext = () => {
    if (lastSnapDoc) setLastSnapDocList((prev) => [...prev, lastSnapDoc]);
  };

  const handlePrev = () => {
    setLastSnapDocList((prev) => prev.slice(0, -1));
  };

  if (isLoading) return <CircularProgress />;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {data?.map((item) => (
          <PropertyCard key={item.id} item={item} />
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-between mt-6">
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
    </div>
  );
}

/* ================= Property Card ================= */
function PropertyCard({ item }) {
  const router = useRouter();
  const mainImage = item.gallery?.[0]?.url || "/placeholder.jpg";

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden flex flex-col">
      {/* Image */}
      <div className="w-full h-48 overflow-hidden rounded-t-xl">
        <img
          src={mainImage}
          alt={item.title}
          className="w-full h-full object-cover object-center"
        />
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col justify-between flex-1">
        <div className="space-y-2">
          <h3 className="text-lg font-semibold truncate">{item.title}</h3>
          <p className="text-sm text-gray-500 truncate">{item.location}</p>
          <p className="text-sm mt-1 font-medium">
            ₹ {item.minPrice?.toLocaleString()} – ₹ {item.maxPrice?.toLocaleString()}
          </p>
          <p className="text-xs text-gray-600 line-clamp-2">
            {item.overview?.description || "No description available."}
          </p>

          {/* Developer */}
          {item.developer && (
            <p className="text-xs text-gray-500">
              <strong>Developer:</strong> {item.developer}
            </p>
          )}

          {/* Configurations */}
          {item.configurations?.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {item.configurations.map((conf, idx) => (
                <Badge key={idx} color="primary" variant="flat">
                  {conf}
                </Badge>
              ))}
            </div>
          )}

          {/* Amenities */}
          {item.amenities?.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-1">
              {item.amenities.map((amenity, idx) => (
                <Badge key={idx} color="success" variant="flat">
                  {amenity.name || amenity}
                </Badge>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center mt-4">
          <span className="px-2 py-1 text-xs bg-blue-100 text-blue-600 rounded">
            {item.status || "Active"}
          </span>

          <Button
            className="bg-[#DBA40D]"
            isIconOnly
            size="sm"
            onClick={() => router.push(`/admin/properties/form?id=${item.id}`)}
          >
            <Edit2 size={14} />
          </Button>
        </div>
      </div>
    </div>
  );
}
