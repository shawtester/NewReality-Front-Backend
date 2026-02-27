import { Suspense } from "react";
import CommercialClient from "./CommercialClient";
import { getAllProperties } from "@/lib/firestore/products/read_server";
import { getSEO } from "@/lib/firestore/seo/read";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateMetadata({ searchParams }) {
  const type = searchParams?.type;

  const slug = type ? `commercial-${type}` : "commercial";

  const seo = await getSEO(slug);

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

export default async function CommercialPage({ searchParams }) {
  const type = searchParams?.type;
  const allProperties = await getAllProperties();

  let filteredProperties = (allProperties || []).filter(
    (property) =>
      !property.propertyType ||
      property.propertyType === "commercial"
  );

  const PROPERTY_TYPE_MAP = {
    "retail-shops": "isRetail",
    "sco-plots": "isScoPlot",
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
      <CommercialClient apartments={filteredProperties} />
    </Suspense>
  );
}