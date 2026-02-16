"use client";

import Link from "next/link";
import PropertyCard from "./PropertyCard";
import slugify from "slugify";
import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function NewLaunchProjects({ properties = [] }) {
  const scrollRef = useRef(null);
  const scrollLeft = () => {
    scrollRef.current?.scrollBy({ left: -340, behavior: "smooth" });
  };

  const scrollRight = () => {
    scrollRef.current?.scrollBy({ left: 340, behavior: "smooth" });
  };

  // Filter + Latest First Sorting
  const newLaunch = properties
    .filter((p) => p?.isNewLaunch)
    .sort((a, b) => {
      //  Firestore Timestamp support
      const dateA = a?.timestampCreate || 0;
      const dateB = b?.timestampCreate || 0;

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
      {/* CARDS */}
      {/* CARDS */}
      <div className="relative mt-10 ">

        {/* LEFT BUTTON */}
        <button
          onClick={scrollLeft}
          className="absolute -left-2 top-1/2 -translate-y-1/2 z-20
             text-gray-400 hover:text-gray-700 transition"
        >
          <ChevronLeft size={34} />
        </button>



        {/* SCROLL CONTAINER */}

        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto snap-x snap-mandatory
             scrollbar-hide scroll-smooth pb-8 px-2"
        >


          {newLaunch.map((p) => (
            <div
              key={p.id}
              className="w-full sm:min-w-[320px] sm:max-w-[320px]
           flex-shrink-0 snap-center px-4 sm:px-0"

            >
              <PropertyCard
                property={{
                  title: p.title,
                  builder: p.developer,
                  location: p.location,
                  bhk: p.configurations?.join(", "),
                  size: p.areaRange,
                  price: p.priceRange,
                  img: p.mainImage?.url || "/images/placeholder.jpg",
                  slug: p.slug || p.id,
                  propertyType: p.propertyType, 
                  isRera: p.isRera,
                }}
              />
            </div>
          ))}
        </div>

        {/* RIGHT BUTTON */}
        <button
          onClick={scrollRight}
          className="absolute -right-2 top-1/2 -translate-y-1/2 z-20
             text-gray-400 hover:text-gray-700 transition"
        >
          <ChevronRight size={34} />
        </button>



      </div>

    </section>
  );
}
