"use client";

import { useEffect } from "react";
import Link from "next/link";
import PropertyCard from "./PropertyCard";
import slugify from "slugify";

export default function TrendingProjects({ properties = [] }) {
  // ✅ Filter trending projects safely
  const trending = properties.filter((p) => p?.isTrending);

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
      <div className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth p-2 pb-8 mt-6">
        {trending.map((p) => (
          <div
            key={p.id}
            className="min-w-[320px] max-w-[320px] flex-shrink-0"
          >
            <PropertyCard
              property={{
                title: p.title,
                builder: p.developer,
                location: p.location,
                bhk: p.configurations?.join(", "),
                size: p.areaRange,
                price: p.priceRange,

                // ✅ IMAGE SAFE FALLBACK
                img: p.mainImage?.url || "/placeholder.png",

                // ✅ TITLE BASED SLUG (SEO FRIENDLY)
                slug: p.slug || p.id, 
                isRera: p.isRera,
              }}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
