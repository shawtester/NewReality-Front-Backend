import { notFound } from "next/navigation";
import { getPropertyById } from "@/lib/firestore/products/read_server";
import ApartmentClient from "./components/ApartmentClient";
import MobileGallery from "./components/MobileGallery";


export const dynamic = "force-dynamic";

export default async function PropertyPage({ params }) {
  const slug = params.slug;

  // Firestore se property lao
  const property = await getPropertyById(slug);

  if (!property) {
    return notFound();
  }

  return (
    <ApartmentClient>
      {/* ================= GALLERY ================= */}
      {property.images && property.images.length > 0 && (
        <MobileGallery
          images={property.images}
          title={property.title}
        />
      )}
      {/* STEP-2 me sirf minimal render */}
      <main className="p-10">
        <h1 className="text-2xl font-bold">{property.title}</h1>
        <p className="text-gray-600">{property.location}</p>
        <p className="text-green-600 font-semibold">{property.price}</p>
      </main>
    </ApartmentClient>
  );
}
