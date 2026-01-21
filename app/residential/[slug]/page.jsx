import { notFound } from "next/navigation";
import {getPropertyBySlug} from "../../../lib/firestore/products/read_server";
// UI COMPONENTS
import Hero from "./components/Hero";
import BigServices from "./components/BigServices";
import OurServices from "./components/OurServices";
import ValueAdded from "./components/ValueAdded";

export const dynamic = "force-dynamic";

export default async function PropertyPage({ params }) {
  const { slug } = params;

  const property = await getPropertyBySlug(slug);

  if (!property) return notFound();

  return (
    <main className="w-full overflow-x-hidden">
      <Hero property={property} />
      <BigServices property={property} />
      <OurServices property={property} />
      <ValueAdded property={property} />
    </main>
  );
}
