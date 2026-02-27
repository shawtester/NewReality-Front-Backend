"use client";

import { useState, useMemo, useEffect, useRef } from "react";

import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import PropertyCard from "@/app/components/property/PropertyCard";

/* ================= EXPANDABLE TEXT ================= */
const ExpandableText = ({ children: html, maxLines = 2, className = "" }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const textRef = useRef(null);

  useEffect(() => {
    if (textRef.current) {
      const element = textRef.current;
      const lineHeight = parseFloat(getComputedStyle(element).lineHeight);
      const maxHeight = lineHeight * maxLines;
      setIsOverflowing(element.scrollHeight > maxHeight);
    }
  }, [html, maxLines]);
  return (
    <div className={className}>
      <div
        ref={textRef}
        className="leading-relaxed
    [&>p]:mb-0
    [&>p]:mt-0
    [&>h1]:text-2xl
    [&>h2]:text-xl
    [&>h3]:text-lg
    [&>strong]:font-semibold
    [&>ul]:pl-5
    [&>ul]:list-disc"
        style={{
          display: "-webkit-box",
          WebkitLineClamp: isExpanded ? "unset" : maxLines,
          WebkitBoxOrient: "vertical",
          overflow: isExpanded ? "visible" : "hidden",
        }}
        dangerouslySetInnerHTML={{ __html: html }}
      />

      {isOverflowing && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-sm text-[#F5A300] font-medium pt-1 cursor-pointer"
        >
          {isExpanded ? "Read Less" : "Read More"}
        </button>
      )}
    </div>
  );
};


export default function FooterSeoPage({ params, properties = [] }) {
  const { slug } = params;

  const [search, setSearch] = useState("");
  const [description, setDescription] = useState("");
  const [heading, setHeading] = useState("");
  const [isValidSlug, setIsValidSlug] = useState(false);
  const [isChecked, setIsChecked] = useState(false);

  const extractPriceRange = (priceRange = "") => {
    if (!priceRange) return null;

    const cleaned = priceRange
      .toLowerCase()
      .replace(/₹/g, "")
      .replace(/cr|crore/g, "")
      .replace(/onwards/g, "")
      .replace(/\+/g, "")
      .replace(/\*/g, "")
      .replace(/,/g, "")
      .trim();

    if (!/\d/.test(cleaned)) return null;

    if (cleaned.includes("-")) {
      const [min, max] = cleaned.split("-").map((v) => parseFloat(v.trim()));
      return {
        min: min || 0,
        max: max || min || 0,
      };
    }

    const value = parseFloat(cleaned);
    return { min: value, max: value };
  };


  /* ================= NORMALIZED SLUG ================= */
  const normalizedSlug = slug
    .toLowerCase()
    .replace("-in-gurgaon", "")
    .replace("-property", "")
    .replace("-properties", "")
    .replace("-projects", "");

  /* ================= FETCH ADMIN SEO DATA + VALIDATE ================= */
  useEffect(() => {
    const fetchSeoData = async () => {
      const collections = [
        "projects_by_budget",
        "projects_by_location",
        "projects_by_size",
        "projects_by_status",
        "property_by_type",
      ];

      let foundMatch = false;

      for (const col of collections) {
        const snap = await getDoc(doc(db, "footer_links", col));
        const data = snap.data();

        const found = data?.links?.find((l) => l.value === slug);

        if (found) {
          foundMatch = true;

          if (found.description) setDescription(found.description);
          if (found.heading) setHeading(found.heading);

          break;
        }
      }

      setIsValidSlug(foundMatch);
      setIsChecked(true);
    };

    fetchSeoData();
  }, [slug]);

  /* ================= ONLY ACTIVE PROPERTIES ================= */
  let filtered = [...properties].filter((p) => p.isActive === true);

  /* ================= SIZE FILTER ================= */
  if (normalizedSlug.includes("bhk")) {
    filtered = filtered.filter((p) => {
      if (!p.configurations) return false;

      // Above 5 BHK
      if (normalizedSlug === "above-5-bhk") {
        return p.configurations.some((cfg) => {
          const match = cfg.match(/\d+(\.\d+)?/);
          if (!match) return false;
          return parseFloat(match[0]) > 5;
        });
      }

      const selectedBhk = parseFloat(normalizedSlug);

      return p.configurations.some((cfg) => {
        const match = cfg.match(/\d+(\.\d+)?/);
        if (!match) return false;
        return parseFloat(match[0]) === selectedBhk;
      });
    });
  }


  /* ================= STATUS FILTER ================= */
  const statusMap = {
    "new-launch": "isNewLaunch",
    "ready-to-move": "isReadyToMove",
    "under-construction": "isUnderConstruction",
    "pre-launch": "isPreLaunch",
    "trending": "isTrending",
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
      const range = extractPriceRange(p.priceRange);
      if (!range) return false;

      const { min: propertyMin, max: propertyMax } = range;

      if (normalizedSlug === "above-8-cr") {
        return propertyMax >= 8;
      }

      const parts = normalizedSlug.replace("-cr", "").split("-");
      const min = parseFloat(parts[0]);
      const max = parseFloat(parts[1]);

      return propertyMax >= min && propertyMin <= max;
    });
  }


  /* ================= LOCATION FILTER (🔥 FIXED) ================= */
  const locationSlugs = [
    "dwarka-expressway",
    "golf-course-road",
    "golf-course-extension",
    "sohna-road",
    "new-gurgaon",
    "old-gurgaon",
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

  /* ================= SEARCH + LATEST SORT ================= */
  const finalFiltered = useMemo(() => {
    let result = [...filtered];

    if (search) {
      const keyword = search.toLowerCase();

      result = result.filter(
        (p) =>
          p.title?.toLowerCase().includes(keyword) ||
          p.developer?.toLowerCase().includes(keyword) ||
          p.location?.toLowerCase().includes(keyword) ||
          p.sector?.toLowerCase().includes(keyword)
      );
    }

    result.sort((a, b) => {
      const dateA = a?.timestampCreate || 0;
      const dateB = b?.timestampCreate || 0;
      return dateB - dateA;
    });

    return result;


  }, [search, filtered]);

  /* ================= INVALID SLUG GUARD ================= */
  if (isChecked && !isValidSlug) {
    return (
      <>
        <Header />
        <section className="py-20 text-center">
          <h1 className="text-2xl font-semibold">
            Page Not Found
          </h1>
        </section>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      {/* INTRO */}
      <section className="bg-[#F6FBFF]">
        <div className="max-w-[1240px] mx-auto px-4 py-6">

          {/* Top Row: Title + Results */}
          <div className="flex items-start justify-between gap-4">
            <h1 className="text-xl md:text-[26px] font-semibold text-gray-900 capitalize">
              {heading || `${slug.replaceAll("-", " ")} Properties`}
            </h1>

            <div className="text-sm text-gray-500 whitespace-nowrap pt-1">
              {finalFiltered.length} results
            </div>
          </div>

          {/* Expandable Text Below */}
          {description && (
            <ExpandableText
              maxLines={2}
              className="mt-3 text-sm sm:text-[15px] text-gray-600"
            >
              {description}
            </ExpandableText>
          )}

        </div>
      </section>



      {/* LISTING */}
      <section className="max-w-[1240px] mx-auto px-4 py-16">
        <div className="mb-8 flex justify-center">
          <input
            type="text"
            placeholder="Search property, developer or location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full max-w-xl border rounded-full px-5 py-3 text-sm outline-none focus:ring-2 focus:ring-[#F5A300]"
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
                  locationName: p.location, // ✅ FIXED
                  sector: p.sector,        // ✅ FIXED
                  bhk: p.configurations?.join(", "),
                  size: p.areaRange,
                  price: p.priceRange,
                  img: p.mainImage?.url,
                  slug: p.slug || p.id,
                  propertyType: p.propertyType,
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
