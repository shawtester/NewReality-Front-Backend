import { notFound } from "next/navigation";
import { getFooterSeoBySlug } from "@/lib/firestore/footer/read_server";
import { getPropertyBySlugOrId, getAllProperties } from "@/lib/firestore/products/read_server";

import FooterSeoPageClient from "./FooterSeoPageClient";
import PropertyPage from "@/app/residential-property-in-gurgaon/[slug]/page"; // ✅ DEFAULT IMPORT

export const dynamic = "force-dynamic";

/* ================= METADATA ================= */
export async function generateMetadata({ params }) {
  const { slug } = params;

  // 🔥 1️⃣ PROPERTY FIRST
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

  // 🔥 2️⃣ SEO SECOND
  const seoData = await getFooterSeoBySlug(slug);

  if (seoData) {
    return {
      title: seoData.metaTitle || seoData.heading || slug,
      description: seoData.metaDescription || "",
      keywords: seoData.metaKeywords || "",
    };
  }

  return {
    title: "404 - Page Not Found",
  };
}

/* ================= PAGE ================= */
export default async function Page({ params }) {
  const { slug } = params;

  // 🔥 1️⃣ PROPERTY CHECK
  const property = await getPropertyBySlugOrId(slug);

  if (property) {
    // ✅ Directly render residential detail page
    return <PropertyPage params={params} />;
  }

  // 🔥 2️⃣ SEO PAGE CHECK
  const seoData = await getFooterSeoBySlug(slug);

  if (seoData) {
    const properties = await getAllProperties();

    const safeProperties = properties.map((p) => ({
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

  // 🔥 3️⃣ NOTHING FOUND
  notFound();
}