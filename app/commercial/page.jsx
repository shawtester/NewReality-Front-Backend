import { Suspense } from "react";
import ApartmentsPage from "./CommercialClient";
import { getAllProperties } from "@/lib/firestore/products/read_server";
import { getSEOPage } from "@/lib/firestore/seo/read_server";

export const dynamic = "force-dynamic";

/* ✅ PROFESSIONAL DYNAMIC SEO */
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

  const canonicalURL =
    seo?.canonical ||
    `${baseUrl}${type ? `?type=${type}` : ""}`;

  const title =
    seo?.title ||
    "Commercial Property in Gurgaon | Best Commercial Real Estate";

  const description =
    seo?.description ||
    "Browse the best commercial properties and investment-ready commercial projects in Gurgaon.";

  const keywords = Array.isArray(seo?.keywords)
    ? seo.keywords
    : seo?.keywords?.split(",").map((k) => k.trim()) || [
        "commercial property gurgaon",
        "retail shops gurgaon",
        "sco plots gurgaon",
      ];

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: canonicalURL,
    },
    openGraph: {
      title,
      description,
      url: canonicalURL,
      siteName: "Neev Realty",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

/* ✅ PAGE WITH FILTER LOGIC */
export default async function CommercialPage({ searchParams }) {
  const type = searchParams?.type;

  const allProperties = await getAllProperties();

  // Always filter by commercial first
  let filteredProperties = allProperties.filter(
    (property) => property.type === "commercial"
  );

  // Apply sub-filter (retail-shops / sco-plots)
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