"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { useDevelopers } from "@/lib/firestore/developers/read";

export default function DevelopersSection() {
  const scrollRef = useRef(null);
  const touchStartX = useRef(null);

  const { data: developers, isLoading } = useDevelopers();

  if (isLoading || !developers?.length) return null;

  /* ================= SCROLL BUTTONS ================= */
  const scrollLeft = () => {
    scrollRef.current?.scrollBy({ left: -280, behavior: "smooth" });
  };

  const scrollRight = () => {
    scrollRef.current?.scrollBy({ left: 280, behavior: "smooth" });
  };

  /* ================= SWIPE (MOBILE) ================= */
  const onTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const onTouchEnd = (e) => {
    if (!touchStartX.current || !scrollRef.current) return;

    const diff = touchStartX.current - e.changedTouches[0].clientX;

    if (Math.abs(diff) > 50) {
      scrollRef.current.scrollBy({
        left: diff > 0 ? 280 : -280,
        behavior: "smooth",
      });
    }

    touchStartX.current = null;
  };

  // ✅ sirf active developers
  const activeDevelopers = developers.filter((d) => d.isActive);

  return (
    <section className="w-full bg-[#F5F7FB] py-6">
      {/* ===== Heading ===== */}
      <div className="mx-auto max-w-5xl text-center px-6">
        <h2 className="text-3xl font-semibold text-gray-900">
          Top Real Estate Developers in{" "}
          <span className="text-[#DBA40D]">Gurgaon</span>
        </h2>
      </div>

      {/* ===== MOBILE / TABLET SLIDER ===== */}
      <div className="lg:hidden relative">
        <button
          onClick={scrollLeft}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-10 h-12 w-12 rounded-full bg-white/90 shadow border flex items-center justify-center"
        >
          ←
        </button>

        <button
          onClick={scrollRight}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-10 h-12 w-12 rounded-full bg-white/90 shadow border flex items-center justify-center"
        >
          →
        </button>

        <div
          ref={scrollRef}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
          className="flex gap-6 overflow-x-auto scrollbar-hide px-20 py-12 snap-x snap-mandatory"
        >
          {activeDevelopers.map((dev) => (
            <div
              key={dev.id}
              className="min-w-[240px] snap-center flex-shrink-0 flex flex-col items-center rounded-xl bg-white px-6 py-8 border shadow transition"
            >
              <div className="-mt-14 flex h-24 w-24 items-center justify-center rounded-full bg-white border shadow">
                <Image
                  src={dev.logo?.url || "/placeholder.png"}
                  alt={dev.title}
                  width={56}
                  height={56}
                  className="object-contain"
                />
              </div>

              <p className="mt-6 text-base font-semibold text-gray-900 text-center">
                {dev.title}
              </p>

              <p className="mt-2 text-sm font-medium text-gray-600 bg-gray-50 px-3 py-1 rounded-full">
                {dev.totalProjects}+ Projects
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ===== DESKTOP GRID ===== */}
      <div className="hidden lg:grid mx-auto mt-12 max-w-[1240px] grid-cols-5 gap-8 px-6">
        {activeDevelopers.map((dev) => (
          <div
            key={dev.id}
            className="flex flex-col items-center rounded-xl bg-white px-6 py-6 border shadow transition"
          >
            <div className="-mt-12 flex h-20 w-20 items-center justify-center rounded-full bg-white border shadow-sm">
              <Image
                src={dev.logo?.url || "/placeholder.png"}
                alt={dev.title}
                width={48}
                height={48}
                className="object-contain"
              />
            </div>

            <p className="mt-4 text-sm font-semibold text-gray-900 text-center">
              {dev.title}
            </p>

            <p className="mt-1 text-xs text-gray-500">
              {dev.totalProjects}+ Projects
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
