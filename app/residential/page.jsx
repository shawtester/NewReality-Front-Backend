import { Suspense } from "react";
import ApartmentsPage from "./ResidentialClient";
import { getAllProperties } from "@/lib/firestore/products/read_server";


export const dynamic = "force-dynamic";

export const metadata = { 
  title: "Best Residential Projects in Gurgaon | Residential Property",
  description: "Explore the best residential projects in Gurgaon. Find luxury flats, apartments and top residential options. Visit our website to discover more.",
  keywords: [' best residential properties in gurgaon, best residential projects in gurgaon, residential properties in gurgaon, residential property in gurgaon'],
  alternates: {
    canonical: 'https://www.neevrealty.com/residential-property-in-gurgaon ',
  },
};

export default async function ResidentialPage() {
  const properties = await getAllProperties();
  return (
    <Suspense fallback={<div className="p-10">Loading...</div>}>
      <ApartmentsPage apartments={properties} />
    </Suspense>
  );
}
