"use client";

import { useRef, useState, useMemo, useEffect } from "react";
import Image from "next/image";
import { FaChevronLeft, FaChevronRight, FaPhoneAlt, FaTimes } from "react-icons/fa";

export default function FloorPlanSection({ floorPlans = [] }) {
  const scrollRef = useRef(null);

  /* ================= BHK TYPES ================= */
  const bhkTypes = useMemo(() => {
    const set = new Set();
    floorPlans.forEach((fp) => {
      if (fp?.title) set.add(fp.title.trim());
    });
    return Array.from(set);
  }, [floorPlans]);

  const [activeType, setActiveType] = useState("");
  const [previewImage, setPreviewImage] = useState(null); // 👈 NEW

  useEffect(() => {
    if (bhkTypes.length > 0) {
      setActiveType(bhkTypes[0]);
    }
  }, [bhkTypes]);

  const filteredPlans = floorPlans.filter(
    (fp) => fp?.title?.trim() === activeType
  );

  const scroll = (dir) => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({
      left: dir === "left" ? -260 : 260,
      behavior: "smooth",
    });
  };

  if (!floorPlans.length) return null;

  return (
    <>
      <section id="floor-plan" className="max-w-[1240px] mx-auto px-4 mt-16">
        <h2 className="text-xl font-semibold mb-4">Floor Plan</h2>

        {/* ===== BHK TABS ===== */}
        <div className="flex gap-3 mb-6 flex-wrap">
          {bhkTypes.map((t) => (
            <button
              key={t}
              onClick={() => setActiveType(t)}
              className={`px-4 py-1 rounded-full text-sm border transition ${
                activeType === t
                  ? "bg-gray-900 text-white"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              {t} Apartment
            </button>
          ))}
        </div>

        {/* ===== SLIDER ===== */}
        <div className="relative">
          <button
            onClick={() => scroll("left")}
            className="hidden md:flex absolute -left-4 top-1/2 -translate-y-1/2 z-10
                       w-10 h-10 bg-white border rounded-full shadow
                       items-center justify-center"
          >
            <FaChevronLeft />
          </button>

          <div
            ref={scrollRef}
            className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth pb-4"
          >
            {filteredPlans.map((fp) => (
              <div
                key={fp.image}
                className="min-w-[197px] bg-white rounded-xl p-4
                           shadow-sm hover:shadow-md transition"
              >
                <div className="text-xs text-gray-500 mb-2">📍 {fp.area}</div>

                {/* IMAGE (CLICKABLE) */}
                <div
                  className="relative w-full h-[140px] mb-3 cursor-pointer"
                  onClick={() => setPreviewImage(fp.image)} // 👈 OPEN
                >
                  <Image
                    src={fp.image}
                    alt={fp.title}
                    fill
                    className="object-contain"
                  />
                </div>

                <p className="text-sm font-medium">{fp.title}</p>
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

          <button
            onClick={() => scroll("right")}
            className="hidden md:flex absolute -right-4 top-1/2 -translate-y-1/2 z-10
                       w-10 h-10 bg-white border rounded-full shadow
                       items-center justify-center"
          >
            <FaChevronRight />
          </button>
        </div>
      </section>

      {/* ===== IMAGE MODAL ===== */}
      {previewImage && (
        <div
          className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center"
          onClick={() => setPreviewImage(null)}
        >
          <div
            className="relative bg-white rounded-lg p-4 max-w-4xl w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setPreviewImage(null)}
              className="absolute top-3 right-3 text-gray-600 hover:text-black"
            >
              <FaTimes size={18} />
            </button>

            <div className="relative w-full h-[70vh]">
              <Image
                src={previewImage}
                alt="Floor Plan Preview"
                fill
                className="object-contain"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
