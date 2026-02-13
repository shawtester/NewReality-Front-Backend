"use client";

import Link from "next/link";
import PropertyCard from "./PropertyCard";
import slugify from "slugify";

export default function NewLaunchProjects({ properties = [] }) {
  // Filter + Latest First Sorting
  const newLaunch = properties
    .filter((p) => p?.isNewLaunch)
    .sort((a, b) => {
      //  Firestore Timestamp support
      const dateA = a?.timestampCreate?.seconds || 0;
      const dateB = b?.timestampCreate?.seconds || 0;

      return dateB - dateA; // Latest first
    });

  if (!newLaunch.length) return null;

  return (
    <section className="max-w-[1240px] mx-auto px-4 mt-40">
      {/* HEADER */}
      <div className="max-w-[1480px] mx-auto px-1 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div className="flex-1 text-center">
          <h2 className="text-3xl font-semibold text-gray-900">
            New Launch <span className="text-[#DBA40D]">Projects</span>
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Explore new residential and commercial projects
          </p>
        </div>

        <div className="max-sm:text-center">
          <Link
            href="/new-launch"
            className="inline-flex items-center justify-center bg-[#DBA40D] border border-[#DBA40D] rounded-sm text-white font-medium px-4 py-2 text-sm"
          >
            Explore More
          </Link>
        </div>
      </div>

      {/* CARDS */}
      <div className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth p-2 pb-8 mt-6">
        {newLaunch.map((p) => (
          <div
            key={p.id}
            className="min-w-[320px] max-w-[320px] flex-shrink-0"
          >
            <PropertyCard
              property={{
                title: p.title,
                builder: p.developer,
                locationName: p.location,
                sector: p.sector,
                bhk: p.configurations?.join(", "),
                size: p.areaRange,
                price: p.priceRange,
                img: p.mainImage?.url || "/images/placeholder.jpg",

                //  SLUG FIRST ELSE ID
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
