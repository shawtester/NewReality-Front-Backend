import { notFound } from "next/navigation";
import { getFooterSeoBySlug } from "@/lib/firestore/footer/read_server";
import {
  getPropertyBySlugOrId,
  getAllProperties,
} from "@/lib/firestore/products/read_server";

import FooterSeoPageClient from "./FooterSeoPageClient";
import ResidentialPropertyPage from "@/app/residential-property-in-gurgaon/[slug]/page";
import CommercialPropertyPage from "@/app/commercial-property-in-gurgaon/[slug]/page";
import CommercialClient from "@/app/commercial-property-in-gurgaon/CommercialClient";
import ResidentialClient from "@/app/residential-property-in-gurgaon/ResidentialClient";

export const dynamic = "force-dynamic";

/* ================= METADATA ================= */
export async function generateMetadata({ params }) {
  const { slug } = params;

  // 1️⃣ PROPERTY FIRST
  const property = await getPropertyBySlugOrId(slug);

  if (property) {
    return {
      title:
        property.metaTitle ||
        `${property.title} in ${property.location} | Price & Details`,
      description:
        property.metaDescription ||
        `Explore ${property.title} located in ${property.location}.`,
    };
  }

  // 2️⃣ COMMERCIAL TYPE META
  const COMMERCIAL_TYPE_MAP = {
    "retail-shops-in-gurgaon": "Retail Shops in Gurgaon",
    "sco-plots-in-gurgaon": "SCO Plots in Gurgaon",
    "office-space-in-gurgaon": "Office Space in Gurgaon",
  };

  if (COMMERCIAL_TYPE_MAP[slug]) {
    return {
      title: `${COMMERCIAL_TYPE_MAP[slug]} | Neev Realty`,
      description: `Explore the best ${COMMERCIAL_TYPE_MAP[
        slug
      ].toLowerCase()} available for sale in Gurgaon.`,
    };
  }

  // 3️⃣ RESIDENTIAL TYPE META  🔥 (NEW FIX)
  const RESIDENTIAL_TYPE_META_MAP = {
    "luxury-apartments-in-gurgaon": "Luxury Apartments in Gurgaon",
    "builder-floor-in-gurgaon": "Builder Floors in Gurgaon",
  };

  if (RESIDENTIAL_TYPE_META_MAP[slug]) {
    return {
      title: `${RESIDENTIAL_TYPE_META_MAP[slug]} | Neev Realty`,
      description: `Explore the best ${RESIDENTIAL_TYPE_META_MAP[
        slug
      ].toLowerCase()} available for sale in Gurgaon.`,
    };
  }

  // 4️⃣ FOOTER SEO
  const seoData = await getFooterSeoBySlug(slug);

  if (seoData) {
    return {
      title: seoData.metaTitle || seoData.heading || slug,
      description: seoData.metaDescription || "",
      keywords: seoData.metaKeywords || "",
      alternates: {
      canonical: seoData?.canonical || `https://www.neevrealty.com/${params.slug}`,
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

    return (
      <CommercialClient
        apartments={filtered}
        forcedTypeSlug={slug}
      />
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

    return (
      <ResidentialClient
        apartments={filtered}
        forcedTypeSlug={slug}
      />
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

  /* ================= NOT FOUND ================= */
  notFound();
}