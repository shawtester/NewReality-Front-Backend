import FooterSeoPageClient from "./FooterSeoPageClient";
import { getAllProperties } from "@/lib/firestore/products/read_server";
import { getFooterSeoBySlug } from "@/lib/firestore/footer/read_server";

export const dynamic = "force-dynamic";

/* ================= METADATA ================= */
export async function generateMetadata({ params }) {
  const { slug } = params;

  const seoData = await getFooterSeoBySlug(slug);

  if (!seoData) {
    return {
      title: "Properties",
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
  const properties = await getAllProperties();

  const safeProperties = properties.map((p) => ({
    ...p,
    timestampCreate: p.timestampCreate ?? null,
  }));

  return (
    <FooterSeoPageClient
      params={params}
      properties={safeProperties}
    />
  );
}