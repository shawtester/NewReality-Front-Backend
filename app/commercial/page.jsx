import { Suspense } from "react";
import ApartmentsPage from "./CommercialClient";
import { getAllProperties } from "@/lib/firestore/products/read_server";
import { getSEOPage } from "@/lib/firestore/seo/read_server";

export const dynamic = "force-dynamic";

/* =========================
   ✅ PROFESSIONAL DYNAMIC SEO
========================= */
export async function generateMetadata({ searchParams }) {
  const type = searchParams?.type;

  let slug = "commercial";
  if (type) {
    slug = `commercial-${type}`;
  }

  const seo = await getSEOPage(slug);

  const baseUrl = "https://www.neevrealty.com/commercial";

  return {
    title:
      seo?.title ||
      "Commercial Property in Gurgaon | Best Commercial Real Estate",
    description:
      seo?.description ||
      "Browse the best commercial properties and investment-ready commercial projects in Gurgaon.",
    alternates: {
      canonical:
        seo?.canonical ||
        `${baseUrl}${type ? `?type=${type}` : ""}`,
    },
  };
}

/* =========================
   ✅ PAGE WITH SAFE FILTER LOGIC
========================= */
export default async function CommercialPage({ searchParams }) {
  const type = searchParams?.type;

  const allProperties = await getAllProperties();

  // ✅ FIX 1: Correct main commercial filter
  let filteredProperties = (allProperties || []).filter(
    (property) =>
      !property.propertyType ||
      property.propertyType === "commercial"
  );

  // ✅ FIX 2: Match your boolean flag structure (like residential)
  const PROPERTY_TYPE_MAP = {
    retail: "isRetail",
    "retail-shop": "isRetail",
    "sco-plot": "isScoPlot",
    office: "isOffice",
    warehouse: "isWarehouse",
  };

  if (type && PROPERTY_TYPE_MAP[type]) {
    const field = PROPERTY_TYPE_MAP[type];

    filteredProperties = filteredProperties.filter(
      (property) => property[field] === true
    );
  }

  return (
    <Suspense fallback={<div className="p-10">Loading...</div>}>
      <ApartmentsPage apartments={filteredProperties} />
    </Suspense>
  );
}