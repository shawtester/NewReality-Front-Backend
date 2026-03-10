import { Suspense } from "react";
import CommercialClient from "./CommercialClient";
import { getAllProperties } from "@/lib/firestore/products/read_server";
import { getSEO } from "@/lib/firestore/seo/read";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";
export const revalidate = 0;

/* ================= METADATA ================= */
export async function generateMetadata() {
  const seo = await getSEO("commercial-property-in-gurgaon");

  const baseUrl =
    "https://www.neevrealty.com/commercial-property-in-gurgaon";

  return {
    title:
      seo?.title ||
      "Commercial Property in Gurgaon | Best Commercial Real Estate",

    description:
      seo?.description ||
      "Browse the best commercial properties and investment-ready commercial projects in Gurgaon.",

    alternates: {
      canonical: seo?.canonical || baseUrl,
    },
  };
}

/* ================= PAGE ================= */
export default async function CommercialPage({ searchParams }) {
  const type = searchParams?.type;

  

  const allProperties = await getAllProperties();

  const filteredProperties = (allProperties || []).filter(
    (property) =>
      !property.propertyType ||
      property.propertyType === "commercial"
  );

  return (
    <Suspense fallback={<div className="p-10">Loading...</div>}>
      <CommercialClient apartments={filteredProperties} />
    </Suspense>
  );
}