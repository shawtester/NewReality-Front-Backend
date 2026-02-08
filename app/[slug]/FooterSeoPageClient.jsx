"use client";

import { useState, useMemo, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import PropertyCard from "@/app/components/property/PropertyCard";

/* ================= EXPANDABLE TEXT ================= */
const ExpandableText = ({ children, maxLines = 2 }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="mt-2 text-sm text-gray-600 leading-relaxed">
      <p
        className={`transition-all ${
          expanded ? "" : "line-clamp-2"
        }`}
      >
        {children}
      </p>

      <button
        onClick={() => setExpanded(!expanded)}
        className="text-[#F5A300] text-sm mt-1"
      >
        {expanded ? "Read Less" : "Read More"}
      </button>
    </div>
  );
};

export default function FooterSeoPage({ params, properties = [] }) {
  const { slug } = params;

  const [search, setSearch] = useState("");
  const [description, setDescription] = useState("");

  /* ================= NORMALIZED SLUG ================= */
  const normalizedSlug = slug
    .toLowerCase()
    .replace("-in-gurgaon", "")
    .replace("-property", "")
    .replace("-properties", "")
    .replace("-projects", "");

  /* ================= FETCH ADMIN DESCRIPTION ================= */
  useEffect(() => {
    const fetchDescription = async () => {
      const collections = [
        "projects_by_budget",
        "projects_by_location",
        "projects_by_size",
        "projects_by_status",
        "property_by_type",
      ];

      for (const col of collections) {
        const snap = await getDoc(doc(db, "footer_links", col));
        const data = snap.data();

        const found = data?.links?.find(
          (l) => l.value === slug
        );

        if (found?.description) {
          setDescription(found.description);
          break;
        }
      }
    };

    fetchDescription();
  }, [slug]);

  let filtered = [...properties];

  /* ================= SIZE FILTER ================= */
  if (normalizedSlug.includes("bhk")) {
    filtered = filtered.filter((p) =>
      p.configurations?.some((cfg) => {
        const normalizedCfg = cfg
          ?.toLowerCase()
          .trim()
          .replace(/\s+/g, "-");

        return normalizedCfg === normalizedSlug;
      })
    );
  }

  /* ================= STATUS FILTER ================= */
  const statusMap = {
    "new-launch": "isNewLaunch",
    "ready-to-move": "isReadyToMove",
    "under-construction": "isUnderConstruction",
    "pre-launch": "isPreLaunch",
  };

  if (statusMap[normalizedSlug]) {
    filtered = filtered.filter(
      (p) => p[statusMap[normalizedSlug]] === true
    );
  }

  /* ================= TYPE FILTER ================= */
  const typeMap = {
    "retail-shops": "isRetail",
    "sco-plots": "isSCO",
    "builder-floor": "isBuilderFloor",
    "luxury-apartment": "isApartment",
  };

  if (typeMap[normalizedSlug]) {
    filtered = filtered.filter(
      (p) => p[typeMap[normalizedSlug]] === true
    );
  }

  /* PROPERTY TYPE */
  if (normalizedSlug === "residential") {
    filtered = filtered.filter(
      (p) => p.propertyType === "residential"
    );
  }

  if (normalizedSlug === "commercial") {
    filtered = filtered.filter(
      (p) => p.propertyType === "commercial"
    );
  }

  /* ================= BUDGET FILTER ================= */
  if (normalizedSlug.includes("cr")) {
    filtered = filtered.filter((p) => {
      if (!p.priceRange) return false;

      const match = p.priceRange.match(/([\d.]+)/g);
      if (!match || match.length < 2) return false;

      const propertyMin = parseFloat(match[0]);
      const propertyMax = parseFloat(match[1]);

      if (normalizedSlug === "above-8-cr") {
        return propertyMax >= 8;
      }

      const parts = normalizedSlug.replace("-cr", "").split("-");
      const min = parseFloat(parts[0]);
      const max = parseFloat(parts[1]);

      return propertyMin >= min && propertyMax <= max;
    });
  }

  /* ================= LOCATION FILTER ================= */
  const locationSlugs = [
    "dwarka-expressway",
    "golf-course-road",
    "sohna-road",
    "new-gurgaon",
    "spr",
    "nh8",
  ];

  if (locationSlugs.includes(normalizedSlug)) {
    filtered = filtered.filter((p) =>
      p.location
        ?.toLowerCase()
        .includes(normalizedSlug.replaceAll("-", " "))
    );
  }

  /* ================= SEARCH ================= */
  const finalFiltered = useMemo(() => {
    if (!search) return filtered;

    const keyword = search.toLowerCase();

    return filtered.filter(
      (p) =>
        p.title?.toLowerCase().includes(keyword) ||
        p.developer?.toLowerCase().includes(keyword) ||
        p.location?.toLowerCase().includes(keyword)
    );
  }, [search, filtered]);

  return (
    <>
      <Header />

      {/* ================= INTRO SECTION (LIKE RESIDENTIAL) ================= */}
      <section className="bg-[#F6FBFF]">
        <div className="max-w-[1240px] mx-auto px-4 py-6">

          <div className="flex flex-col lg:flex-row lg:justify-between gap-4">
            <div className="max-w-4xl">
              <h1 className="text-xl md:text-[26px] font-semibold text-gray-900 capitalize">
                {slug.replaceAll("-", " ")} Properties
              </h1>

              {description && (
                <ExpandableText maxLines={2}>
                  {description}
                </ExpandableText>
              )}
            </div>

            <div className="text-sm text-gray-500">
              {finalFiltered.length} results
            </div>
          </div>
        </div>
      </section>

      {/* ================= LISTING ================= */}
      <section className="max-w-[1240px] mx-auto px-4 py-16">
        {/* SEARCH BAR */}
        <div className="mb-8 flex justify-center">
          <input
            type="text"
            placeholder="Search property, developer or location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="
              w-full max-w-xl
              border rounded-full
              px-5 py-3
              text-sm
              outline-none
              focus:ring-2 focus:ring-[#F5A300]
            "
          />
        </div>

        {finalFiltered.length === 0 ? (
          <p>No properties found</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {finalFiltered.map((p) => (
              <PropertyCard
                key={p.id}
                property={{
                  title: p.title,
                  builder: p.developer,
                  location: p.location,
                  bhk: p.configurations?.join(", "),
                  size: p.areaRange,
                  price: p.priceRange,
                  img: p.mainImage?.url,
                  slug: p.slug || p.id,
                  isRera: p.isRera,
                }}
              />
            ))}
          </div>
        )}
      </section>

      <Footer />
    </>
  );
}

