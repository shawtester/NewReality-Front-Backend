import { Suspense } from "react";
import BuildersClient from "./BuildersClient";

const pageUrl = "https://www.neevrealty.com/top-builders-in-gurgaon";

export const metadata = {
  title: "Top Real Estate Builders in Gurgaon | Neev Realty",
  description:
    "Explore top real estate builders in Gurgaon with their premium residential projects and developer details.",
  alternates: {
    canonical: pageUrl,
  },
  openGraph: {
    title: "Top Real Estate Builders in Gurgaon",
    description:
      "Explore top real estate builders in Gurgaon with Neev Realty.",
    url: pageUrl,
    siteName: "Neev Realty",
    type: "website",
    images: [
      {
        url: "/images/neevlogo.png",
        width: 1200,
        height: 630,
        alt: "Neev Realty",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Top Real Estate Builders in Gurgaon",
    description:
      "Explore top real estate builders in Gurgaon with Neev Realty.",
    images: ["/images/neevlogo.png"],
  },
};

export default function TopBuildersPage() {
  const baseUrl = "https://www.neevrealty.com";

  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: baseUrl,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Top Builders in Gurgaon",
            item: pageUrl,
          },
        ],
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <Suspense fallback={<div className="p-10">Loading...</div>}>
        <BuildersClient />
      </Suspense>
    </>
  );
}
