import { Suspense } from "react";
import ApartmentsPage from "./ResidentialClient";
import { getAllProperties } from "@/lib/firestore/products/read_server";
import { getSEO } from "@/lib/firestore/seo/read"; // ✅ SAME SEO FUNCTION

export const dynamic = "force-dynamic";
export const revalidate = 0;

/* =========================
   ✅ DYNAMIC SEO
========================= */
export async function generateMetadata({ searchParams }) {
  const type = searchParams?.type;

  // 🔥 SLUG MATCH FIRESTORE EXACTLY
  const seoSlug = type ? `residential-${type}` : "residential";

  const seo = await getSEO(seoSlug);

  const baseUrl = "https://www.neevrealty.com/residential-property-in-gurgaon";

  return {
    title:
      seo?.title ||
      "Best Residential Projects in Gurgaon | Residential Property",

    description:
      seo?.description ||
      "Explore the best residential projects in Gurgaon.",

    alternates: {
      canonical:
        seo?.canonical ||
        `${baseUrl}${type ? `?type=${type}` : ""}`,
    },
  };
}

/* =========================
   ✅ PAGE FILTER LOGIC
========================= */
export default async function ResidentialPage({ searchParams }) {
  const type = searchParams?.type;

  const allProperties = await getAllProperties();

  let residentialProperties = (allProperties || []).filter(
    (property) =>
      !property.propertyType ||
      property.propertyType === "residential"
  );

  const PROPERTY_TYPE_MAP = {
    apartments: "isApartment",
    "builder-floor": "isBuilderFloor",
    
  };

  if (type && PROPERTY_TYPE_MAP[type]) {
    const field = PROPERTY_TYPE_MAP[type];

    residentialProperties = residentialProperties.filter(
      (property) => property[field] === true
    );
  }

  return (
    <Suspense fallback={<div className="p-10">Loading...</div>}>
      <ApartmentsPage apartments={residentialProperties} />
    </Suspense>
  );
}