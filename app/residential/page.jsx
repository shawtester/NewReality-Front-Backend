import { Suspense } from "react";
import ApartmentsPage from "./ResidentialClient";
import { getAllProperties } from "@/lib/firestore/products/read_server";
import { getSEOPage } from "@/lib/firestore/seo/read_server";

export const dynamic = "force-dynamic";

export async function generateMetadata({ searchParams }) {
  const type = searchParams?.type;

  let seoSlug = "residential";
  if (type) {
    seoSlug = `residential-${type}`;
  }

  const seo = await getSEOPage(seoSlug);

  const baseUrl = "https://www.neevrealty.com/residential";

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

export default async function ResidentialPage({ searchParams }) {
  const type = searchParams?.type;

  const allProperties = await getAllProperties();

  // ✅ Main residential filter
  let residentialProperties = (allProperties || []).filter(
    (property) =>
      !property.propertyType ||
      property.propertyType === "residential"
  );

  // ✅ Type filter (MATCH CLIENT LOGIC)
  const PROPERTY_TYPE_MAP = {
    apartment: "isApartment",
    "builder-floor": "isBuilderFloor",
    villa: "isVilla",
    plot: "isPlot",
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