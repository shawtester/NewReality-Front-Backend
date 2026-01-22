import { notFound } from "next/navigation";
import { getPropertyById } from "@/lib/firestore/products/read_server";
import ApartmentClient from "./components/ApartmentClient";
import MobileGallery from "./components/MobileGallery";
import TitleBlockWithBrochure from "./components/TitleBlockWithBrochure"
import OverviewSection from "./components/OverviewSection";

export const dynamic = "force-dynamic";

export default async function PropertyPage({ params }) {
  // 1️⃣ slug
  const slug = params.slug;

  // 2️⃣ Firestore se raw data
  const property = await getPropertyById(slug);

  if (!property) {
    return notFound();
  }

  // =================================================
  // 3️⃣ 🔥 YAHI CLEAN PROPERTY BANTI HAI 🔥
  // =================================================
  const cleanProperty = {
    id: property.id,
    title: property.title,
    location: property.location,

    // FIELD MAPPING
    builder: property.developer,
    price: property.priceRange,
    updatedAt: property.lastUpdated,
    size: property.areaRange,
    rera: property.reraNumber,



    // IMAGES (gallery fallback logic)
    images:
      property.gallery && property.gallery.length > 0
        ? property.gallery
        : property.image?.url
          ? [property.image.url]
          : property.mainImage?.url
            ? [property.mainImage.url]
            : [],

    // OTHER SAFE FIELDS
    overview: property.overview || {},
    floorPlans: property.floorPlans || [],
    amenities: property.amenities || [],
    faq: property.faq || [],
    disclaimer: property.disclaimer || "",
  };

  // 4️⃣ RETURN — sirf cleanProperty use hoti hai
  return (
    <ApartmentClient>
      <MobileGallery
        images={cleanProperty.images}
        title={cleanProperty.title}
      />

      <TitleBlockWithBrochure property={cleanProperty} />
      {/* OVERVIEW */}
      <OverviewSection
        overview={cleanProperty.overview}
        propertyTitle={cleanProperty.title}
      />
    </ApartmentClient>
  );
}
