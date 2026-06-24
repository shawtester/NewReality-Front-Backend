import { Suspense } from "react";
import BuilderDetailClient from "./BuilderDetailClient";
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

  return {
    title: builder.metaTitle || `${builder.name} - Builder Details | Neev Realty`,
    description: builder.metaDescription || defaultDescription,
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
