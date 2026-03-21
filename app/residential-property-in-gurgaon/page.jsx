import { Suspense } from "react";
import { redirect } from "next/navigation";
import ApartmentsPage from "./ResidentialClient";
import { getAllProperties } from "@/lib/firestore/products/read_server";
import { getSEO } from "@/lib/firestore/seo/read";

export const dynamic = "force-dynamic";
export const revalidate = 0;

/* =========================
   ✅ CLEAN SEO (NO QUERY CANONICAL)
========================= */
export async function generateMetadata() {
  const seo = await getSEO("residential-property-in-gurgaon");

  const baseUrl =
    "https://www.neevrealty.com/residential-property-in-gurgaon";

  return {
    title:
      seo?.title ||
      "Best Residential Projects in Gurgaon | Residential Property",

    description:
      seo?.description ||
      "Explore the best residential projects in Gurgaon.",

    alternates: {
      canonical: seo?.canonical || baseUrl,
    },
  };
}

/* =========================
   ✅ PAGE LOGIC
========================= */
export default async function ResidentialPage({ searchParams }) {
  

  const allProperties = await getAllProperties();

  const residentialProperties = (allProperties || []).filter(
    (property) =>
      !property.propertyType ||
      property.propertyType === "residential"
  );

  const baseUrl = "https://www.neevrealty.com";
  const pageUrl = `${baseUrl}/residential-property-in-gurgaon`;

  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": baseUrl
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Residential Property in Gurgaon",
            "item": pageUrl
          }
        ]
      },
      {
        "@type": "ItemList",
        "name": "Residential Properties in Gurgaon",
        "description": "List of premium residential projects, apartments, and builder floors in Gurgaon.",
        "url": pageUrl,
        "itemListElement": residentialProperties.slice(0, 12).map((property, index) => ({
          "@type": "ListItem",
          "position": index + 1,
          "url": `${baseUrl}/residential-property-in-gurgaon/${property.slug}`,
          "name": property.title
        }))
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <Suspense fallback={<div className="p-10">Loading...</div>}>
        <ApartmentsPage apartments={residentialProperties} />
      </Suspense>
    </>
  );
}