"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import Link from "next/link";
import PropertyCard from "./PropertyCard";
import slugify from "slugify";

export default function TrendingProjects({ properties = [] }) {

  const scrollRef = useRef(null);

  const scrollLeft = () => {
    scrollRef.current?.scrollBy({ left: -340, behavior: "smooth" });
  };

  const scrollRight = () => {
    scrollRef.current?.scrollBy({ left: 340, behavior: "smooth" });
  };

  //  Filter + Latest First Sorting
  const trending = properties
    .filter((p) => p?.isTrending)
    .sort((a, b) => {
      //  Firestore Timestamp support
      const dateA = a?.timestampCreate?.seconds || 0;
      const dateB = b?.timestampCreate?.seconds || 0;

      return dateB - dateA; // Latest first
    });

  if (!trending.length) return null;

  return (
    <section className="max-w-[1240px] mx-auto px-4 mt-10">
      {/* HEADER */}
      <div className="max-w-[1480px] mx-auto px-1 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div className="flex-1 text-center">
          <h2 className="text-3xl font-semibold text-gray-900">
            Trending <span className="text-[#DBA40D]">Projects</span>
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Explore our top current projects
          </p>
        </div>

        <div className="max-sm:text-center">
          <Link
            href="/trending"
            className="inline-flex items-center justify-center bg-[#DBA40D] border border-[#DBA40D] rounded-sm text-white font-medium px-4 py-2 text-sm"
          >
            Explore More
          </Link>
        </div>
      </div>

      {/* CARDS */}
      {/* CARDS */}
      <div className="relative mt-6 px-6">

        <button
          onClick={scrollLeft}
          className="hidden sm:block absolute -left-6 top-1/2 -translate-y-1/2 z-20
  text-gray-400 hover:text-gray-800 transition"
        >
          <ChevronLeft size={40} />
        </button>

        {/* MOBILE ARROWS */}
        <div className="flex sm:hidden justify-center gap-44 mb-4">
          <button
            onClick={scrollLeft}
            className="bg-gray-200 rounded-full w-9 h-9 flex items-center justify-center"
          >
            <ChevronLeft size={18} />
          </button>

          <button
            onClick={scrollRight}
            className="bg-gray-200 rounded-full w-9 h-9 flex items-center justify-center"
          >
            <ChevronRight size={18} />
          </button>
        </div>

        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth p-2 pb-8"
        >
          {trending.map((p) => (
            <div
              key={p.id}
              className="w-full sm:min-w-[320px] sm:max-w-[320px] flex-shrink-0"
            >
              <PropertyCard
                property={{
                  title: p.title,
                  builder: p.developer,
                  location: p.location,
                  bhk: p.configurations?.join(", "),
                  size: p.areaRange,
                  price: p.priceRange,
                  img: p.mainImage?.url || "/placeholder.png",
                  slug: p.slug || p.id,
                  isRera: p.isRera,
                }}
              />
            </div>
          ))}
        </div>

        <button
          onClick={scrollRight}
          className="hidden sm:block absolute -right-6 top-1/2 -translate-y-1/2 z-20
  text-gray-400 hover:text-gray-800 transition"
        >
          <ChevronRight size={40} />
        </button>

      </div>

    </section>
  );
}
