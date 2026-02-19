import { Suspense } from "react";
import ApartmentsPage from "./CommercialClient";
import { getAllProperties } from "@/lib/firestore/products/read_server";

export const dynamic = "force-dynamic";


export const metadata = { 
  title: "Commercial Property in Gurgaon | Best Commercial Real Estate",
  description: " Browse the best commercial properties and projects in Gurgaon. Find offices, retail spaces and commercial real estate options for sale in Gurugram.",
  keywords: ['commercial property in gurgaon, best commercial property in gurgaon, commercial property in gurugram, commercial projects in gurgaon, commercial property for sale in gurgaon'],
  alternates: {
    canonical: 'https://www.neevrealty.com/commercial-property-in-gurgaon ',
  },
};


export default async function CommercialPage() {
  const properties = await getAllProperties();

  return (
    <Suspense fallback={<div className="p-10">Loading...</div>}>
      <ApartmentsPage apartments={properties} />
    </Suspense>
  );
}

