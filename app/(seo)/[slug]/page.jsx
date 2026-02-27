import FooterSeoPageClient from "./FooterSeoPageClient";
import { getAllProperties } from "@/lib/firestore/products/read_server";
import { getFooterSeoBySlug } from "@/lib/firestore/footer/read_server";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

/* ================= METADATA ================= */
export async function generateMetadata({ params }) {
  const { slug } = params;

  const seoData = await getFooterSeoBySlug(slug);

  if (!seoData) {
    return {
      title: "404 - Page Not Found",
    };
  }

  return {
    title: seoData.metaTitle || seoData.heading || slug,
    description: seoData.metaDescription || "",
    keywords: seoData.metaKeywords || "",
  };
}

/* ================= PAGE ================= */
export default async function Page({ params }) {
  const { slug } = params;

  // ✅ 1. VALIDATE SLUG FIRST
  const seoData = await getFooterSeoBySlug(slug);

  if (!seoData) {
    notFound();   // 🔥 INSTANT 404 (NO FLICKER)
  }

  // ✅ 2. THEN FETCH PROPERTIES
  const properties = await getAllProperties();

  const safeProperties = properties.map((p) => ({
    ...p,
    timestampCreate: p.timestampCreate ?? null,
  }));

  return (
    <FooterSeoPageClient
      params={params}
      properties={safeProperties}
      seoData={seoData}   // 🔥 PASS SEO DATA DIRECTLY
    />
  );
}