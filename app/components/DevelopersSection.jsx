"use client";

import React, { useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import { useBuilders } from "@/lib/firestore/builders/read";

export default function DevelopersSection() {
  const scrollRef = useRef(null);
  const touchStartX = useRef(null);
  const autoScrollIntervalRef = useRef(null);
  const isAutoScrolling = useRef(true);
  const cardWidth = 280;

  const { builders, isLoading } = useBuilders();

  /* ================= AUTO SCROLL ================= */
  const startAutoScroll = useCallback(() => {
    if (autoScrollIntervalRef.current) {
      clearInterval(autoScrollIntervalRef.current);
    }

    autoScrollIntervalRef.current = setInterval(() => {
      if (isAutoScrolling.current && scrollRef.current) {
        const scrollLeftPos = scrollRef.current.scrollLeft;
        const maxScroll =
          scrollRef.current.scrollWidth - scrollRef.current.clientWidth;

        if (scrollLeftPos >= maxScroll - 10) {
          scrollRef.current.scrollTo({ left: 0, behavior: "smooth" });
        } else {
          scrollRef.current.scrollBy({ left: cardWidth, behavior: "smooth" });
        }
      }
    }, 3000);
  }, []);

  /* ================= BUTTON SCROLL ================= */
  const scrollLeft = useCallback(() => {
    if (!scrollRef.current) return;
    isAutoScrolling.current = false;
    scrollRef.current.scrollBy({ left: -cardWidth, behavior: "smooth" });

    setTimeout(() => {
      isAutoScrolling.current = true;
    }, 2000);
  }, []);

  const scrollRight = useCallback(() => {
    if (!scrollRef.current) return;
    isAutoScrolling.current = false;
    scrollRef.current.scrollBy({ left: cardWidth, behavior: "smooth" });

    setTimeout(() => {
      isAutoScrolling.current = true;
    }, 2000);
  }, []);

  /* ================= TOUCH ================= */
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
    if (builders?.length > 0) {
      const timer = setTimeout(() => {
        startAutoScroll();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [builders?.length, startAutoScroll]);

  /* ================= LOADING GUARD ================= */
  if (isLoading || !builders?.length) return null;

  const activeBuilders = builders.filter((b) => b.isActive);

  return (
    <section className="w-full bg-[#F5F7FB] py-6">
      <div className="mx-auto max-w-5xl text-center px-6">
        <h2 className="text-3xl font-semibold text-gray-900">
          Top Real Estate Builders in{" "}
          <span className="text-[#DBA40D]">Gurgaon</span>
        </h2>
      </div>

      {/* ===== MOBILE / TABLET SLIDER ===== */}
      <div className="lg:hidden">
        <div
          ref={scrollRef}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
          className="flex gap-6 overflow-x-auto scrollbar-hide px-20 py-12 snap-x snap-mandatory"
        >
          {activeBuilders.map((b) => (
            <div
              key={b.id}
              className="min-w-[240px] snap-center flex-shrink-0 flex flex-col items-center rounded-xl bg-white px-6 py-8 border shadow"
            >
              <div className="-mt-14 flex h-24 w-24 items-center justify-center rounded-full bg-white border shadow">
                <Image
                  src={b.logo?.url || "/placeholder.png"}
                  alt={b.name}
                  width={56}
                  height={56}
                  className="object-contain"
                />
              </div>

              <p className="mt-6 text-base font-semibold text-gray-900 text-center">
                {b.name}
              </p>

              <p className="mt-2 text-sm font-medium text-gray-600 bg-gray-50 px-3 py-1 rounded-full">
                {b.totalProjects}+ Projects
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ===== DESKTOP GRID ===== */}
      <div className="hidden lg:block mx-auto mt-4 max-w-[1240px] px-6">
        <div
          ref={scrollRef}
          className="grid grid-rows-2 grid-flow-col gap-8 overflow-x-auto scrollbar-hide pt-14 pb-6 snap-x snap-mandatory"
          style={{ gridAutoColumns: "160px" }}
        >
          {activeBuilders.map((b) => (
            <div
              key={b.id}
              className="flex flex-col items-center rounded-xl bg-white px-6 py-6 border shadow"
            >
              <div className="-mt-12 flex h-20 w-20 items-center justify-center rounded-full bg-white border shadow-sm">
                <Image
                  src={b.logo?.url || "/placeholder.png"}
                  alt={b.name}
                  width={48}
                  height={48}
                  className="object-contain"
                />
              </div>

              <p className="mt-4 text-sm font-semibold text-gray-900 text-center">
                {b.name}
              </p>

              <p className="mt-1 text-xs text-gray-500">
                {b.totalProjects}+ Projects
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
