"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";

const defaultStats = [
  {
    finalValue: 100,
    label: "Hand-Picked Projects Across Market",
    icon: "/images/homebanner/lg6.png",
  },
  {
    finalValue: 50,
    label: "Dedicated Agents and Financial Advisors",
    icon: "/images/homebanner/lg3.png",
  },
  {
    finalValue: 15,
    label: "Years of Trust and Experties",
    icon: "/images/homebanner/lg2.png",
  },
  {
    finalValue: 1500,
    label: "Happy Clients",
    icon: "/images/homebanner/lg4.png",
  },
];

export default function StatsBar({ stats }) {
  const useStats = stats || defaultStats;

  const [counts, setCounts] = useState(useStats.map(() => 0));
  const observedRef = useRef(null);
  const animationIds = useRef([]);
  const observer = useRef(null);

  /* ================= INTERSECTION OBSERVER ================= */
  useEffect(() => {
    observer.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCounts();
            observer.current?.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );

    if (observedRef.current) {
      observer.current.observe(observedRef.current);
    }

    return () => {
      observer.current?.disconnect();
      animationIds.current.forEach(clearInterval);
    };
  }, []);

  /* ================= COUNT ANIMATION ================= */
  const animateCounts = useCallback(() => {
    const duration = 2000;
    const stepTime = 20;
    const steps = duration / stepTime;

    useStats.forEach((stat, index) => {
      let start = 0;
      const target = stat.finalValue;
      const increment = target / steps;

      animationIds.current[index] = setInterval(() => {
        start += increment;

        if (start >= target) {
          start = target;
          clearInterval(animationIds.current[index]);
        }

        setCounts((prev) => {
          const updated = [...prev];
          updated[index] = Math.floor(start);
          return updated;
        });
      }, stepTime);
    });
  }, [useStats]);

  return (
    <section
      ref={observedRef}
      className="relative mx-auto py-8 sm:py-12 w-full max-w-[1520px] bg-[#F8FBFF] h-[200px] sm:h-[330px] overflow-hidden"
    >
      {/* Background blobs */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-4 left-4 w-16 h-16 bg-white/30 rounded-full blur-xl" />
        <div className="absolute bottom-10 right-10 w-20 h-20 bg-white/20 rounded-full blur-2xl" />
      </div>

      <div className="mx-auto max-w-[1400px] px-3 sm:px-6 lg:px-12">
        {/* ================= MOBILE ================= */}
        <div className="flex gap-4 md:hidden overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide">
          {useStats.map((item, index) => (
            <div
              key={item.label}
              className="flex-none w-40 h-44 rounded-xl bg-white shadow-xl border p-4 snap-center"
            >
              <div className="w-12 h-12 rounded-full bg-white shadow mb-3 flex items-center justify-center">
                <Image
                  src={item.icon}
                  alt={item.label}
                  width={24}
                  height={24}
                />
              </div>

              <p className="text-xl font-black">
                {counts[index].toLocaleString()}+
              </p>

              <p className="text-xs leading-tight mt-1">{item.label}</p>
            </div>
          ))}
        </div>

        {/* ================= DESKTOP / TABLET ================= */}
        <div className="hidden md:flex justify-center gap-6 bg-white/90 rounded-3xl shadow-2xl p-6">
          {useStats.map((item, index) => (
            <div
              key={item.label}
              className="relative w-[200px] h-[180px] rounded-2xl bg-white shadow-xl border flex flex-col items-center justify-center hover:-translate-y-2 transition"
            >
              <div className="absolute -top-8 w-16 h-16 rounded-full bg-white shadow flex items-center justify-center">
                <Image
                  src={item.icon}
                  alt={item.label}
                  width={32}
                  height={32}
                />
              </div>

              <p className="text-3xl font-black mt-6 text-[#111]">
                {counts[index].toLocaleString()}+
              </p>

              <p className="text-sm text-center px-2 mt-2">
                {item.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
