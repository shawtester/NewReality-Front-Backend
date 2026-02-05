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

  /* ================= ACTIVE TAB ================= */
  const [activeType, setActiveType] = useState("");
  const [openImages, setOpenImages] = useState([]); // modal images
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (bhkTypes.length > 0) {
      setActiveType(bhkTypes[0]);
    }
  }, [bhkTypes]);

  /* ================= FILTER ================= */
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

  const openImageModal = (index) => {
    setOpenImages(filteredPlans.map((fp) => fp.image));
    setCurrentIndex(index);
  };

  const prevImage = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? openImages.length - 1 : prev - 1
    );
  };

  const nextImage = () => {
    setCurrentIndex((prev) =>
      prev === openImages.length - 1 ? 0 : prev + 1
    );
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
          {/* LEFT */}
          <button
            onClick={() => scroll("left")}
            className="hidden md:flex absolute -left-4 top-1/2 -translate-y-1/2 z-10
                       w-10 h-10 bg-white border rounded-full shadow
                       items-center justify-center"
          >
            <FaChevronLeft />
          </button>

          {/* CARDS */}
          <div
            ref={scrollRef}
            className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth pb-4"
          >
            {filteredPlans.map((fp, idx) => (
              <div
                key={fp.image}
                className="min-w-[197px] bg-white rounded-xl p-4
                           shadow-sm hover:shadow-md transition"
              >
                <div className="text-xs text-gray-500 mb-2">📍 {fp.area}</div>

                {/* IMAGE CLICK TO OPEN */}
                <div
                  className="relative w-full h-[140px] mb-3 cursor-pointer"
                  onClick={() => openImageModal(idx)}
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

          {/* RIGHT */}
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

      {/* ================= FLOATING MODAL (65% SCREEN) ================= */}
      {openImages.length > 0 && (
        <div className="fixed inset-0 z-[999] bg-black/80 flex items-center justify-center">
          {/* Close Button */}
          <button
            onClick={() => setOpenImages([])}
            className="absolute top-5 right-5 text-white text-2xl z-20"
          >
            <FaTimes />
          </button>

          {/* Prev Button */}
          <button
            onClick={prevImage}
            className="absolute left-10 z-20 text-white text-3xl bg-black/30 p-2 rounded-full hover:bg-black/50 transition"
          >
            <FaChevronLeft />
          </button>

          {/* IMAGE */}
          <div className="relative w-[65%] h-[65vh] flex items-center justify-center rounded-lg overflow-hidden">
            <Image
              src={openImages[currentIndex]}
              alt="Floor Plan"
              fill
              className="object-contain"
            />
          </div>

          {/* Next Button */}
          <button
            onClick={nextImage}
            className="absolute right-10 z-20 text-white text-3xl bg-black/30 p-2 rounded-full hover:bg-black/50 transition"
          >
            <FaChevronRight />
          </button>
        </div>
      )}
    </>
  );
}
