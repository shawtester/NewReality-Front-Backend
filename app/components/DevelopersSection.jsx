"use client";

import React, { useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import { useDevelopers } from "@/lib/firestore/developers/read";

export default function DevelopersSection() {
  const scrollRef = useRef(null);
  const touchStartX = useRef(null);
  const autoScrollIntervalRef = useRef(null);
  const isAutoScrolling = useRef(true);
  const cardWidth = 280; // Matches scroll distance (mobile: 240px + gap 36px + padding)

  const { data: developers, isLoading } = useDevelopers();

  /* ================= SCROLL FUNCTIONS ================= */
  const scrollLeft = useCallback(() => {
    scrollRef.current?.scrollBy({ left: -cardWidth, behavior: "smooth" });
  }, []);

  const scrollRight = useCallback(() => {
    scrollRef.current?.scrollBy({ left: cardWidth, behavior: "smooth" });
  }, []);

  const startAutoScroll = useCallback(() => {
    if (autoScrollIntervalRef.current) {
      clearInterval(autoScrollIntervalRef.current);
    }

    autoScrollIntervalRef.current = setInterval(() => {
      if (isAutoScrolling.current && scrollRef.current) {
        const scrollLeftPos = scrollRef.current.scrollLeft;
        const maxScroll = scrollRef.current.scrollWidth - scrollRef.current.clientWidth;
        
        // ✅ Loop back to start when reaching end
        if (scrollLeftPos >= maxScroll - 10) { // 10px threshold
          scrollRef.current.scrollTo({ left: 0, behavior: "smooth" });
        } else {
          scrollRef.current.scrollBy({ left: cardWidth, behavior: "smooth" });
        }
      }
    }, 3000);
  }, []);

  /* ================= TOUCH HANDLERS ================= */
  const onTouchStart = useCallback((e) => {
    touchStartX.current = e.touches[0].clientX;
    isAutoScrolling.current = false;
  }, []);

  const onTouchEnd = useCallback((e) => {
    if (!touchStartX.current || !scrollRef.current) return;

    const diff = touchStartX.current - e.changedTouches[0].clientX;

    if (Math.abs(diff) > 50) {
      scrollRef.current.scrollBy({
        left: diff > 0 ? cardWidth : -cardWidth,
        behavior: "smooth",
      });
    }

    touchStartX.current = null;
    setTimeout(() => {
      isAutoScrolling.current = true;
    }, 2000);
  }, []);

  /* ================= EFFECTS ================= */
  useEffect(() => {
    return () => {
      if (autoScrollIntervalRef.current) {
        clearInterval(autoScrollIntervalRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (developers?.length > 0) {
      const timer = setTimeout(() => {
        startAutoScroll();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [developers?.length, startAutoScroll]);

  if (isLoading || !developers?.length) return null;

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
          className="absolute left-4 top-1/2 -translate-y-1/2 z-10 h-12 w-12 rounded-full bg-white/90 shadow border flex items-center justify-center hover:bg-white transition-all"
        >
          ←
        </button>

        <button
          onClick={scrollRight}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-10 h-12 w-12 rounded-full bg-white/90 shadow border flex items-center justify-center hover:bg-white transition-all"
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
              className="min-w-[240px] snap-center flex-shrink-0 flex flex-col items-center rounded-xl bg-white px-6 py-8 border shadow hover:shadow-lg transition-all"
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

      {/* ===== DESKTOP: 2x7 GRID WITH LOOPING SCROLL ===== */}
      <div className="hidden lg:block mx-auto mt-4 max-w-[1240px] px-6">
        <div
          ref={scrollRef}
          className="grid grid-rows-2 grid-flow-col gap-8 overflow-x-auto scrollbar-hide pt-14 pb-6 snap-x snap-mandatory"
          style={{ gridAutoColumns: "160px" }}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          {activeDevelopers.map((dev) => (
            <div
              key={dev.id}
              className="flex flex-col items-center rounded-xl bg-white px-6 py-6 border shadow hover:shadow-lg transition-all snap-center"
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
      </div>
    </section>
  );
}
