import { Suspense } from "react";
import ApartmentsPage from "./CommercialClient";
import { getAllProperties } from "@/lib/firestore/products/read_server";

export const dynamic = "force-dynamic";

export default async function CommercialPage() {
  const properties = await getAllProperties();

  return (
    <Suspense fallback={<div className="p-10">Loading...</div>}>
      <ApartmentsPage apartments={properties} />
    </Suspense>
  );
}

