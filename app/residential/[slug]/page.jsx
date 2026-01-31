import { notFound } from "next/navigation";
import {
  getPropertyById,
  getAllProperties,
} from "@/lib/firestore/products/read_server";
import AutoPopup from "./components/AutoPopup";
import ApartmentClient from "./components/ApartmentClient";
import MobileGallery from "./components/MobileGallery";
import TitleBlockWithBrochure from "./components/TitleBlockWithBrochure";
import ScrollTabs from "./components/ScrollTabs";
import OverviewSection from "./components/OverviewSection";
import FloorPlanSection from "./components/FloorPlanSection";
import PaymentPlanSection from "./components/PaymentPlanSection";
import AmenitiesSection from "./components/AmenitiesSection";
import LocationSection from "./components/LocationSection";
import EmiCalculatorSection from "./components/EmiCalculatorSection";
import FAQSection from "./components/FAQSection";
import SimilarProjectsSection from "./components/SimilarProjectsSection";
import DisclaimerSection from "./components/DisclaimerSection";
import RightSidebar from "./components/RightSidebar";
import Footer from "@/app/components/Footer";

export const dynamic = "force-dynamic";

export default async function PropertyPage({ params }) {
  const slug = params.slug;

  const property = await getPropertyById(slug);
  if (!property) return notFound();

  const allProjects = await getAllProperties();

  const cleanProperty = {
    id: property.id,
    slug: property.slug,
    title: property.title,
    location: property.location,
    builder: property.developer,
    price: property.priceRange,
    size: property.areaRange,
    rera: property.reraNumber,
    updatedAt: property.lastUpdated,

    brochureUrl: property.brochure?.url || "",

    
    images:
    property.gallery?.length > 0
      ? property.gallery.map((g) => g.url)
      : property.mainImage?.url
      ? [property.mainImage.url]
      : property.image?.url
      ? [property.image.url]
      : [],

    overview: property.overview || {},
    floorPlans: property.floorPlans || [],
    amenities: property.amenities || [],
    mapQuery: property.mapQuery || property.location || "",
    locationPoints: property.locationPoints || [],
    faq: (property.faq || []).map((f) => ({
      q: f.question,
      a: f.answer,
    })),
    disclaimer: property.disclaimer || "",
  };

  return (
    <ApartmentClient>
      {/*  AUTO POPUP (2.5s after page load) */}
      <AutoPopup propertyTitle={cleanProperty.title} />

      {/* ================= PAGE GRID ================= */}
      <section className="max-w-[1240px] mx-auto px-4 grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* ================= LEFT CONTENT ================= */}
        <div className="lg:col-span-2 space-y-6">

          {/* GALLERY */}
          <MobileGallery
            images={cleanProperty.images}
            title={cleanProperty.title}
          />

          {/* TITLE */}
          <TitleBlockWithBrochure property={cleanProperty} />

          {/* 🔥 STICKY SCROLL TABS 🔥 */}
          <div className="sticky top-[96px] z-30 bg-white">
            <ScrollTabs />
          </div>

          {/* SECTIONS */}
          <OverviewSection
            overview={cleanProperty.overview}
            propertyTitle={cleanProperty.title}
          />

          <FloorPlanSection floorPlans={cleanProperty.floorPlans} />

          <PaymentPlanSection plans={cleanProperty.paymentPlans} />

          <AmenitiesSection amenities={cleanProperty.amenities} />

          <LocationSection
            mapQuery={cleanProperty.mapQuery}
            locationPoints={cleanProperty.locationPoints}
          />

          <EmiCalculatorSection />

          <FAQSection faq={cleanProperty.faq} />

          <SimilarProjectsSection
            projects={allProjects}
            currentSlug={cleanProperty.slug}
          />

          <DisclaimerSection text={cleanProperty.disclaimer} />
        </div>

        {/* ================= RIGHT SIDEBAR ================= */}
        <RightSidebar property={cleanProperty} />
      </section>
      <Footer />
    </ApartmentClient>
  );
}

