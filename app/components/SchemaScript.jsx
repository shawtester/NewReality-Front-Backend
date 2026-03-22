"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";

export default function SchemaScript() {
  const pathname = usePathname();

  const isBlog = pathname.startsWith("/blog/");

  // property slug (single level URL)
  const isPropertySlug =
    pathname.split("/").filter(Boolean).length === 1;

  // 🔥 FULL SCHEMA
  const fullGraph = [
    {
      "@type": "Organization",
      name: "Neev Realty",
      url: "https://www.neevrealty.com",
      logo: "https://www.neevrealty.com/logo.png",
      image: "https://www.neevrealty.com/logo.png",
      telephone: "+91-8824966966",
      contactPoint: [
        {
          "@type": "ContactPoint",
          telephone: "+91-8824966966",
          contactType: "sales",
          areaServed: "IN",
          availableLanguage: ["en", "hi"],
        },
      ],
      sameAs: [
        "https://www.facebook.com/neevrealty",
        "https://www.instagram.com/neevrealty",
        "https://twitter.com/neevrealty",
        "https://www.linkedin.com/company/neevrealty",
      ],
    },
    {
      "@type": "WebSite",
      url: "https://www.neevrealty.com/",
      name: "Neev Realty",
      potentialAction: {
        "@type": "SearchAction",
        target:
          "https://www.neevrealty.com/search?q={search_term_string}",
        "query-input": "required name=search_term_string",
      },
    },
    {
      "@type": "RealEstateAgent",
      name: "Neev Realty",
      url: "https://www.neevrealty.com",
      image: "https://www.neevrealty.com/logo.png",
      telephone: "+91-8824966966",
      priceRange: "₹₹ - ₹₹₹",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Gurgaon",
        addressRegion: "Haryana",
        postalCode: "122018",
        addressCountry: "IN",
      },
    },
    {
      "@type": "LocalBusiness",
      name: "Neev Realty",
      image: "https://www.neevrealty.com/logo.png",
      url: "https://www.neevrealty.com",
      telephone: "+91-8824966966",
      priceRange: "₹₹ - ₹₹₹",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Gurgaon",
        addressRegion: "Haryana",
        postalCode: "122018",
        addressCountry: "IN",
      },
    },
  ];

  // 🔥 FILTER LOGIC
  let finalGraph = fullGraph;

  if (isBlog) {
    // blog page → kuch bhi global schema nahi
    return null;
  }

  if (isPropertySlug) {
    // property page → ONLY organization
    finalGraph = fullGraph.filter(
      (item) => item["@type"] === "Organization"
    );
  }

  return (
    <Script
      id="schema-org"
      type="application/ld+json"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@graph": finalGraph,
        }),
      }}
    />
  );
}