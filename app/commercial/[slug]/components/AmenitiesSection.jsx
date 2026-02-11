"use client";

import Image from "next/image";

export default function AmenitiesSection({ amenities = [] }) {
  if (!amenities || amenities.length === 0) return null;

  return (
    <section id="amenities" className="max-w-[1240px] mx-auto px-4 mt-12">
      <h2 className="text-xl font-semibold mb-6">Amenities</h2>

      {/* GRID LIST */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-6">
        {amenities.map((a, i) => (
          <div
            key={i}
            className="flex items-center gap-4 border-b border-gray-200 pb-4"
          >
            {/* ICON */}
            <div className="w-12 h-12 rounded-full border border-gray-300 flex items-center justify-center flex-shrink-0">
              {a.image?.url ? (
                <Image
                  src={a.image.url}
                  alt={a.name || "Amenity"}
                  width={26}
                  height={26}
                  className="object-contain"
                />
              ) : (
                <span className="text-[10px] text-gray-400">Icon</span>
              )}
            </div>

            {/* NAME */}
            <p className="text-sm text-gray-800 font-medium">
              {a.name}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

