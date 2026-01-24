"use client";

import PropertyCard from "@/app/components/property/PropertyCard";

export default function SimilarProjectsSection({
  projects = [],
  currentSlug,
}) {
  // Agar projects hi nahi hai → section mat dikhao
  if (!projects || projects.length === 0) return null;

  const filteredProjects = projects.filter(
    (p) => p.slug !== currentSlug
  );

  if (filteredProjects.length === 0) return null;

  return (
    <section id="project" className="max-w-[1240px] mx-auto px-4 mt-16 mb-10">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Similar Projects</h2>
      </div>

      {/* HORIZONTAL SCROLL */}
      <div className="flex gap-4 md:gap-10 overflow-x-auto scrollbar-hide scroll-smooth pb-6">
        {filteredProjects.map((p) => (
          <div
            key={p.slug}
            className="
              min-w-[220px] max-w-[220px]
              sm:min-w-[240px] sm:max-w-[240px]
              md:min-w-[260px] md:max-w-[260px]
              flex-shrink-0
            "
          >
            <PropertyCard
              property={{
                title: p.title,
                builder: p.developer,
                location: p.location,
                bhk: p.configurations?.join(", "),
                size: p.areaRange,
                price: p.priceRange,

                img:
                  p.mainImage?.url ||
                  p.gallery?.[0]?.url ||
                  "/placeholder.png",

                slug: p.slug || p.id,
              }}
            />

          </div>
        ))}
      </div>
    </section>
  );
}
