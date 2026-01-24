"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { FaChevronLeft, FaChevronRight, FaPhoneAlt } from "react-icons/fa";

export default function FloorPlanSection({ floorPlans = [] }) {
  const [activeType, setActiveType] = useState("3 BHK");
  const scrollRef = useRef(null);

  // Filter plans by selected BHK
  const filteredPlans = floorPlans.filter(
    (fp) => fp?.type && fp.type.includes(activeType)
  );

  const scroll = (dir) => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({
      left: dir === "left" ? -300 : 300,
      behavior: "smooth",
    });
  };

  // Agar floor plans hi nahi hai → section mat dikhao
  if (!floorPlans || floorPlans.length === 0) return null;

  return (
    <section id="floor-plan" className="max-w-[1240px] mx-auto px-4 mt-16">
      <h2 className="text-xl font-semibold mb-4">Floor Plan</h2>

      {/* ===== BHK FILTER TABS ===== */}
      <div className="flex gap-3 mb-6">
        {["3 BHK", "4 BHK"].map((t) => (
          <button
            key={t}
            onClick={() => setActiveType(t)}
            className={`px-4 py-1 rounded-full text-sm border transition ${activeType === t
                ? "bg-gray-900 text-white"
                : "bg-gray-100 text-gray-600"
              }`}
          >
            {t} Apartment
          </button>
        ))}
      </div>

      {/* ===== SCROLL AREA ===== */}
      <div className="relative">
        {/* LEFT ARROW */}
        <button
          onClick={() => scroll("left")}
          className="hidden md:flex absolute -left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white border rounded-full shadow items-center justify-center"
        >
          <FaChevronLeft />
        </button>

        {/* CARDS */}
        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth pb-4"
        >
          {filteredPlans.map((fp, i) => (
            <div
              key={i}
              className="min-w-[197px] bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition"
            >
              <div className="text-xs text-gray-500 mb-2">
                📍 {fp.size}
              </div>

              <div className="relative w-full h-[140px] mb-3">
                <Image
                  src={fp.img?.url || fp.img}
                  alt={fp.type}
                  fill
                  className="object-contain"
                />
              </div>

              <p className="text-sm font-medium">{fp.type}</p>
              <p className="text-sm font-semibold">INR {fp.price}</p>

              <div className="flex justify-between items-center mt-3 text-xs">
                <span className="text-[#F5A300] cursor-pointer">
                  Request<br />Callback
                </span>
                <FaPhoneAlt className="text-yellow-400 text-lg" />
              </div>
            </div>
          ))}
        </div>

        {/* RIGHT ARROW */}
        <button
          onClick={() => scroll("right")}
          className="hidden md:flex absolute -right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white border rounded-full shadow items-center justify-center"
        >
          <FaChevronRight />
        </button>
      </div>
    </section>
  );
}
