import { Suspense } from "react";
import ApartmentsPage from "./ResidentialClient";
import { getAllProperties } from "@/lib/firestore/products/read_server";
import { getSEOPage } from "@/lib/firestore/seo/read_server";

export const dynamic = "force-dynamic";

/* ✅ PROFESSIONAL DYNAMIC SEO */
export async function generateMetadata({ searchParams }) {
  const type = searchParams?.type;

  let seoSlug = "residential";
  if (type) {
    seoSlug = `residential-${type}`;
  }

  const seo = await getSEOPage(seoSlug);

  const baseUrl = "https://www.neevrealty.com/residential";
  const canonicalURL =
    seo?.canonical ||
    `${baseUrl}${type ? `?type=${type}` : ""}`;

  const title =
    seo?.title ||
    "Best Residential Projects in Gurgaon | Residential Property";

  const description =
    seo?.description ||
    "Explore the best residential projects in Gurgaon. Find luxury flats, apartments and top residential options.";

  const keywords = Array.isArray(seo?.keywords)
    ? seo.keywords
    : seo?.keywords?.split(",").map((k) => k.trim()) || [
        "residential property gurgaon",
        "apartments in gurgaon",
        "builder floor gurgaon",
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
export default async function ResidentialPage({ searchParams }) {
  const type = searchParams?.type;

  const allProperties = await getAllProperties();

  // First filter only residential
  let residentialProperties = allProperties.filter(
    (property) => property.type === "residential"
  );

  // Then apply sub-filter (apartments / builder-floor)
  if (type) {
    residentialProperties = residentialProperties.filter(
      (property) => property.category === type
    );
  }

  return (
    <Suspense fallback={<div className="p-10">Loading...</div>}>
      <ApartmentsPage apartments={residentialProperties} />
    </Suspense>
  );
}