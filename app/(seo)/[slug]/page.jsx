import { notFound } from "next/navigation";
import { getFooterSeoBySlug } from "@/lib/firestore/footer/read_server";
import {
  getPropertyBySlugOrId,
  getAllProperties,
} from "@/lib/firestore/products/read_server";
import { getSEO } from "@/lib/firestore/seo/read";
import FooterSeoPageClient from "./FooterSeoPageClient";
import ResidentialPropertyPage from "@/app/residential-property-in-gurgaon/[slug]/page";
import CommercialPropertyPage from "@/app/commercial-property-in-gurgaon/[slug]/page";
import CommercialClient from "@/app/commercial-property-in-gurgaon/CommercialClient";
import ResidentialClient from "@/app/residential-property-in-gurgaon/ResidentialClient";
import Script from "next/script";

export const dynamic = "force-dynamic";

/* ================= METADATA ================= */
export async function generateMetadata({ params }) {
  const { slug } = params;

  // 1️⃣ PROPERTY FIRST
  const property = await getPropertyBySlugOrId(slug);

  if (property) {
    const canonicalUrl =
      property.canonical ||
      `https://www.neevrealty.com/${property.slug || slug}`;
    const title = property.metaTitle || `${property.title} in ${property.location} | Price & Details`;
    const description = property.metaDescription || `Explore ${property.title} located in ${property.location}.`;
    return {
      title,
      description,
      keywords:
        property.metaKeywords ||
        `${property.title}, property in ${property.location}, real estate ${property.location}`,
      alternates: {
        canonical: canonicalUrl,
      },
      openGraph: {
        title,
        description,
        url: canonicalUrl,
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

  // 2️⃣ COMMERCIAL TYPE META
  const COMMERCIAL_TYPE_MAP = {
    "retail-shops-in-gurgaon": "Retail Shops in Gurgaon",
    "sco-plots-in-gurgaon": "SCO Plots in Gurgaon",
    "office-space-in-gurgaon": "Office Space in Gurgaon",
  };

  if (COMMERCIAL_TYPE_MAP[slug]) {

    const seo = await getSEO(slug);

    const title = seo?.title || `${COMMERCIAL_TYPE_MAP[slug]} | Neev Realty`;
    const description = seo?.description || `Explore the best ${COMMERCIAL_TYPE_MAP[slug].toLowerCase()} available for sale in Gurgaon.`;
    const canonicalUrl = seo?.canonical || `https://www.neevrealty.com/${slug}`;

    return {
      title,
      description,
      keywords:
        seo?.keywords ||
        seo?.metaKeywords ||
        `${COMMERCIAL_TYPE_MAP[slug]}, commercial property in gurgaon, real estate gurgaon`,
      alternates: {
        canonical: canonicalUrl,
      },
      openGraph: {
        title,
        description,
        url: canonicalUrl,
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
        title,
        description,
        images: ["/images/neevlogo.png"],
      },
  const RESIDENTIAL_TYPE_META_MAP = {
    "luxury-apartments-in-gurgaon": "Luxury Apartments in Gurgaon",
    "builder-floor-in-gurgaon": "Builder Floors in Gurgaon",
  };
  if (RESIDENTIAL_TYPE_META_MAP[slug]) {

    const seo = await getSEO(slug);

    const title = seo?.title || `${RESIDENTIAL_TYPE_META_MAP[slug]} | Neev Realty`;
    const description = seo?.description || `Explore the best ${RESIDENTIAL_TYPE_META_MAP[slug].toLowerCase()} available for sale in Gurgaon.`;
    const canonicalUrl = seo?.canonical || `https://www.neevrealty.com/${slug}`;

    return {
      title,
      description,
      keywords:
        seo?.keywords ||
        seo?.metaKeywords ||
        `${RESIDENTIAL_TYPE_META_MAP[slug]}, property in gurgaon, real estate gurgaon`,
      alternates: {
        canonical: canonicalUrl,
      },
      openGraph: {
        title,
        description,
        url: canonicalUrl,
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
        title,
        description,
        images: ["/images/neevlogo.png"],
      },
  const seoData = await getFooterSeoBySlug(slug);

  if (seoData) {
    const title = seoData.metaTitle || seoData.heading || slug;
    const description = seoData.metaDescription || "";
    const canonicalUrl = seoData?.canonical || `https://www.neevrealty.com/${params.slug}`;
    
    return {
      title,
      description,
      keywords: seoData.metaKeywords || "",
      alternates: {
        canonical: canonicalUrl,
      },
      openGraph: {
        title,
        description,
        url: canonicalUrl,
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
        title,
        description,
        images: ["/images/neevlogo.png"],
      },
    };
  }

  return {
    title: "404 - Page Not Found",
  };
}

/* ================= PAGE ================= */
export default async function Page({ params }) {
  const { slug } = params;

  // 1️⃣ PROPERTY CHECK
  const property = await getPropertyBySlugOrId(slug);

  if (property) {
    if (property.propertyType === "commercial") {
      return <CommercialPropertyPage params={params} />;
    }

    return <ResidentialPropertyPage params={params} />;
  }

  const allProperties = await getAllProperties();

  /* ================= COMMERCIAL TYPE ================= */
  const COMMERCIAL_TYPE_FIELD_MAP = {
    "retail-shops-in-gurgaon": "isRetail",
    "sco-plots-in-gurgaon": "isSCO",
  };

  if (COMMERCIAL_TYPE_FIELD_MAP[slug]) {
    const field = COMMERCIAL_TYPE_FIELD_MAP[slug];

    const filtered = (allProperties || [])
      .filter((p) => p.propertyType === "commercial")
      .filter((p) => p[field] === true);

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
              name:
                slug === "sco-plots-in-gurgaon"
                  ? "SCO Plots in Gurgaon"
                  : slug === "retail-shops-in-gurgaon"
                    ? "Retail Shops in Gurgaon"
                    : "Commercial Property in Gurgaon",
              item: `${baseUrl}/${slug}`,
            },
          ],
        },
        {
          "@type": "ItemList",
          name:
            slug === "sco-plots-in-gurgaon"
              ? "SCO Plots in Gurgaon"
              : slug === "retail-shops-in-gurgaon"
                ? "Retail Shops in Gurgaon"
                : "Commercial Properties in Gurgaon",
          description: "Explore top commercial investment opportunities in Gurgaon.",
          url: `${baseUrl}/${slug}`,
          itemListElement: filtered.slice(0, 12).map((p, index) => ({
            "@type": "ListItem",
            position: index + 1,
            url: `${baseUrl}/commercial-property-in-gurgaon/${p.slug}`,
            name: p.title,
          })),
        },
        {
          "@type": "FAQPage",
          mainEntity: [
            {
              "@type": "Question",
              name: `What are the best ${slug.replaceAll("-", " ")}?`,
              acceptedAnswer: {
                "@type": "Answer",
                text: "Neev Realty offers top commercial properties for investment in Gurgaon.",
              },
            },
          ],
        },
      ],
    };

    return (
      <>
        <Script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />

        <CommercialClient
          apartments={filtered}
          forcedTypeSlug={slug}
        />
      </>
    );

  }

  /* ================= RESIDENTIAL TYPE ================= */
  const RESIDENTIAL_TYPE_FIELD_MAP = {
    "luxury-apartments-in-gurgaon": "isApartment",
    "builder-floor-in-gurgaon": "isBuilderFloor",
  };

  if (RESIDENTIAL_TYPE_FIELD_MAP[slug]) {
    const field = RESIDENTIAL_TYPE_FIELD_MAP[slug];

    const filtered = (allProperties || [])
      .filter((p) => p.propertyType === "residential")
      .filter((p) => p[field] === true);

    const baseUrl = "https://www.neevrealty.com";

    const pageTitle =
      slug === "luxury-apartments-in-gurgaon"
        ? "Luxury Apartments in Gurgaon"
        : slug === "builder-floor-in-gurgaon"
          ? "Builder Floors in Gurgaon"
          : "Residential Properties in Gurgaon";

    const pageUrl = `${baseUrl}/${slug}`;

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
              name: pageTitle,
              item: pageUrl,
            },
          ],
        },
        {
          "@type": "ItemList",
          name: pageTitle,
          description: `Explore the best ${pageTitle.toLowerCase()} available in Gurgaon.`,
          url: pageUrl,
          itemListElement: filtered.slice(0, 12).map((p, index) => ({
            "@type": "ListItem",
            position: index + 1,
            url: `${baseUrl}/residential-property-in-gurgaon/${p.slug}`,
            name: p.title,
          })),
        },
        {
          "@type": "FAQPage",
          mainEntity: [
            {
              "@type": "Question",
              name: `What are the best ${pageTitle.toLowerCase()}?`,
              acceptedAnswer: {
                "@type": "Answer",
                text: `Neev Realty offers top ${pageTitle.toLowerCase()} for living and investment in Gurgaon.`,
              },
            },
          ],
        },
      ],
    };

    return (
      <>
        <Script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />

        <ResidentialClient
          apartments={filtered}
          forcedTypeSlug={slug}
        />
      </>
    );
  }

  /* ================= COMMERCIAL MAIN ================= */
  if (slug === "commercial-property-in-gurgaon") {
    const filtered = (allProperties || []).filter(
      (p) => !p.propertyType || p.propertyType === "commercial"
    );

    return <CommercialClient apartments={filtered} />;
  }

  /* ================= RESIDENTIAL MAIN ================= */
  if (slug === "residential-property-in-gurgaon") {
    const filtered = (allProperties || []).filter(
      (p) => !p.propertyType || p.propertyType === "residential"
    );

    return <ResidentialClient apartments={filtered} />;
  }

  /* ================= FOOTER SEO PAGE ================= */
  const seoData = await getFooterSeoBySlug(slug);

  if (seoData) {
    const safeProperties = (allProperties || []).map((p) => ({
      ...p,
      timestampCreate: p.timestampCreate ?? null,
    }));

    return (
      <FooterSeoPageClient
        params={params}
        properties={safeProperties}
        seoData={seoData}
      />
    );
  }

  /* ================= FALLBACK FOR BUDGET/LOCATION SLUGS ================= */
  // If no SEO data but slug looks like a budget, location, or filter slug, show with default data
  const isBudgetSlug = slug.includes("cr");
  const isLocationSlug = ["dwarka-expressway", "golf-course-road", "golf-course-extension", "sohna-road", "new-gurgaon", "old-gurgaon", "spr", "nh8"].includes(slug);
  const isStatusSlug = ["new-launch", "ready-to-move", "under-construction", "pre-launch", "trending"].includes(slug);
  const isTypeSlug = ["retail-shops", "sco-plots", "builder-floor", "luxury-apartment"].includes(slug);
  const isBhkSlug = slug.includes("bhk");

  if (isBudgetSlug || isLocationSlug || isStatusSlug || isTypeSlug || isBhkSlug) {
    const safeProperties = (allProperties || []).map((p) => ({
      ...p,
      timestampCreate: p.timestampCreate ?? null,
    }));

    // Generate default SEO data for the slug
    const defaultSeoData = {
      metaTitle: slug.replaceAll("-", " "),
      metaDescription: `Browse ${slug.replaceAll("-", " ")} properties in Gurgaon`,
      metaKeywords: slug.replaceAll("-", " "),
      heading: slug.replaceAll("-", " "),
      description: `Explore ${slug.replaceAll("-", " ")} available in Gurgaon`,
    };

    return (
      <FooterSeoPageClient
        params={params}
        properties={safeProperties}
        seoData={defaultSeoData}
      />
    );
  }

  /* ================= NOT FOUND ================= */
  notFound();
}