import { Suspense } from "react";
import ApartmentsPage from "./CommercialClient";
import { getAllProperties } from "@/lib/firestore/products/read_server";
import { getSEOPage } from "@/lib/firestore/seo/read_server";

export const dynamic = "force-dynamic";

// ✅ DYNAMIC SEO BASED ON FILTER
export async function generateMetadata({ searchParams }) {
  const type = searchParams?.type;

  // Default slug
  let slug = "commercial";

  // If filter exists → generate slug dynamically
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
      "Browse the best commercial properties and projects in Gurgaon.",

    keywords: Array.isArray(seo?.keywords)
      ? seo.keywords
      : seo?.keywords?.split(",") || [],

    alternates: {
      canonical:
        seo?.canonical ||
        `${baseUrl}${type ? `?type=${type}` : ""}`,
    },
  };
}

export default async function CommercialPage({ searchParams }) {
  const type = searchParams?.type;

  const allProperties = await getAllProperties();

  // ✅ Always filter by commercial first
  let filteredProperties = allProperties.filter(
    (property) => property.type === "commercial"
  );

  // ✅ Apply sub-filter (retail-shops / sco-plots)
  if (type) {
    filteredProperties = filteredProperties.filter(
      (property) => property.category === type
    );
  }

  return (
    <Suspense fallback={<div className="p-10">Loading...</div>}>
      <ApartmentsPage apartments={filteredProperties} />
    </Suspense>
  );
}
