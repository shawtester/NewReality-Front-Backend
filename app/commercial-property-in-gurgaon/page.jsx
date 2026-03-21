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

  const baseUrl = "https://www.neevrealty.com";
  const pageUrl = `${baseUrl}/commercial-property-in-gurgaon`;

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
            "name": "Commercial Property in Gurgaon",
            "item": pageUrl
          }
        ]
      },
      {
        "@type": "ItemList",
        "name": "Commercial Properties in Gurgaon",
        "description": "Explore premium commercial properties and investment-ready commercial projects in Gurgaon.",
        "url": pageUrl,
        "itemListElement": filteredProperties.slice(0, 12).map((property, index) => ({
          "@type": "ListItem",
          "position": index + 1,
          "url": `${baseUrl}/commercial-property-in-gurgaon/${property.slug}`,
          "name": property.title
        }))
      }
    ]
  };

  schema["@graph"].push(
    {
      "@type": "Organization",
      "@id": "https://www.neevrealty.com/#organization",
      "name": "Neev Realty",
      "url": "https://www.neevrealty.com/"
    },
    {
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "What are the best commercial properties in Gurgaon?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Neev Realty features top commercial properties, retail shops, and office spaces for investment in Gurgaon."
          }
        }
      ]
    }
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <Suspense fallback={<div className="p-10">Loading...</div>}>
        <CommercialClient apartments={filteredProperties} />
      </Suspense>
    </>
  );
}