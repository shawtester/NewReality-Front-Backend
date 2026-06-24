import { Suspense } from "react";
import BuilderDetailClient from "./BuilderDetailClient";

export const metadata = {
  title: "Builder Details | Neev Realty",
  description:
    "Explore builder details, project stats, and properties in Gurgaon.",
};

export default function BuilderDetailPage({ params }) {
  return (
    <Suspense fallback={<div className="p-10">Loading...</div>}>
      <BuilderDetailClient builderId={params.id} />
    </Suspense>
  );
}
