"use client";

import Image from "next/image";

export default function AmenitiesSection({ amenities = [] }) {
  if (!amenities || amenities.length === 0) return null;

  return (
    <section id="amenities" className="max-w-[1240px] mx-auto px-4 mt-12">
      <h2 className="text-xl font-semibold mb-6">Amenities</h2>

      {/* ================= ALL DEVICES (SAME LAYOUT) ================= */}
      <div className="overflow-x-auto scrollbar-hide">
        <div className="grid grid-rows-2 grid-flow-col auto-cols-max gap-4">
          {amenities.map((a, i) => (
            <div
              key={i}
              className="
                w-[160px] h-[140px]
                lg:w-[172px] lg:h-[149px]
                bg-white border border-gray-300 rounded-[4px]
                overflow-hidden flex flex-col flex-shrink-0
                hover:-translate-y-1 hover:shadow-[0_8px_20px_rgba(0,0,0,0.12)]
                hover:border-gray-400
                transition-all duration-200
              "
            >
              {/* IMAGE */}
              <div className="h-[90px] lg:h-[100px] w-full bg-gray-50 flex items-center justify-center">
                {a.image?.url ? (
                  <Image
                    src={a.image.url}
                    alt={a.name || "Amenity"}
                    width={160}
                    height={90}
                    className="object-contain"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">
                    No Image
                  </div>
                )}
              </div>

              {/* NAME */}
              <div className="flex-1 flex items-center justify-center px-2 text-center">
                <p className="text-xs font-medium text-gray-700 leading-tight">
                  {a.name}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
