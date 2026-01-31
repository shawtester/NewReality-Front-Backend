"use client";

import Image from "next/image";

export default function AmenitiesSection({ amenities = [] }) {
  // Agar amenities hi nahi hain → section mat dikhao
  if (!amenities || amenities.length === 0) return null;

  return (
    <section id="amenities" className="max-w-[1240px] mx-auto px-4 mt-12">
      <h2 className="text-xl font-semibold mb-6">Amenities</h2>

      {/* ================= MOBILE + TABLET ================= */}
      <div className="lg:hidden overflow-x-auto scrollbar-hide">
        <div
          className="
            grid
            grid-rows-2
            grid-flow-col
            auto-cols-max
            gap-4
          "
        >
          {amenities.map((a, i) => (
            <div
              key={i}
              className="
                w-[160px] h-[140px]
                bg-white
                border border-gray-300
                rounded-[4px]
                overflow-hidden
                flex flex-col
                flex-shrink-0
              "
            >
              {/* IMAGE */}
              <div className="h-[90px] w-full bg-gray-50 flex items-center justify-center">
                <Image
                  src={a.image?.url || a.image}
                  alt={a.label || "Amenity"}
                  width={160}
                  height={90}
                />

              </div>

              {/* TEXT */}
              <div className="flex-1 flex items-center justify-center px-2 text-center">
                <p className="text-xs font-medium text-gray-700 leading-tight">
                  {a.label}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ================= DESKTOP GRID ================= */}
      <div className="hidden lg:grid grid-cols-4 gap-6">
        {amenities.map((a, i) => (
          <div
            key={i}
            className="
              w-[172px] h-[149px]
              bg-white
              border border-gray-300
              rounded-[4px]
              overflow-hidden
              flex flex-col
              hover:-translate-y-1
              hover:shadow-[0_8px_20px_rgba(0,0,0,0.12)]
              hover:border-gray-400
            "
          >
            {/* IMAGE */}
            <div className="h-[100px] w-full bg-gray-50 flex items-center justify-center">
              <Image
                src={a.image?.url || a.image}
                alt={a.label || "Amenity"}
                width={160}
                height={90}
              />

            </div>

            {/* TEXT */}
            <div className="flex-1 flex items-center justify-center px-2 text-center">
              <p className="text-xs font-medium text-gray-700 leading-tight">
                {a.label}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
