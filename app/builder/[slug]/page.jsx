import { Suspense } from "react";
import BuilderDetailClient from "../../top-builders-in-gurgaon/[slug]/BuilderDetailClient";
import { getBuilderBySlugOrId } from "@/lib/firestore/builders/read_server";
import { notFound } from "next/navigation";

export async function generateMetadata({ params }) {
  const builder = await getBuilderBySlugOrId(params.slug);

  if (!builder) {
    return {
      title: "Builder Not Found | Neev Realty",
    };
  }

  const defaultDescription = builder.description
    ? builder.description.replace(/<[^>]+>/g, '').substring(0, 160)
    : "Explore builder details, project stats, and properties in Gurgaon.";

  const pageUrl = builder.canonicalUrl?.trim() || `https://www.neevrealty.com/builder/${params.slug}`;

  return {
    title: builder.metaTitle || `${builder.name} - Builder Details | Neev Realty`,
    description: builder.metaDescription || defaultDescription,
    keywords: builder.metaKeywords || "real estate, builders, gurgaon, property",
    alternates: {
      canonical: pageUrl,
    },
    openGraph: {
      title: builder.metaTitle || `${builder.name} - Builder Details | Neev Realty`,
      description: builder.metaDescription || defaultDescription,
      url: pageUrl,
      siteName: "Neev Realty",
      type: "website",
    },
  };
}

export default async function BuilderDetailPage({ params }) {
  const builder = await getBuilderBySlugOrId(params.slug);

  if (!builder) {
    notFound();
  }

  return (
    <Suspense fallback={<div className="p-10">Loading...</div>}>
      <BuilderDetailClient builderId={builder.id} />
    </Suspense>
  );
}
