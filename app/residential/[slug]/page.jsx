import { notFound } from "next/navigation";
import { getAllProperties } from "@/lib/firestore/products/read_server";
import { getBuilderById } from "@/lib/firestore/builders/read_server";
import { getPropertyBySlugOrId } from "@/lib/firestore/products/read_server";
import { getAmenitiesByIds } from "@/lib/firestore/amenities/read_server";

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
import DeveloperSection from "./components/DeveloperSection";
import SimilarProjectsSection from "./components/SimilarProjectsSection";
import DisclaimerSection from "./components/DisclaimerSection";
import RightSidebar from "./components/RightSidebar";
import Footer from "@/app/components/Footer";

export async function generateMetadata({ params }) {
  const property = await getPropertyBySlugOrId(params.slug);

  if (!property) {
    return {
      title: "Property Not Found",
      description: "",
    };
  }

  const title =
    property.metaTitle ||
    `${property.title} in ${property.location} | Price & Details`;

  const description =
    property.metaDescription ||
    `Explore ${property.title} located in ${property.location}. Check price, floor plans, amenities and payment plans.`;

  const keywords =
    property.metaKeywords ||
    `${property.title}, ${property.location}, real estate`;

  return {
    title,
    description,
    keywords,
    openGraph: {
      title,
      description,
      images: property.mainImage?.url
        ? [property.mainImage.url]
        : [],
    },
  };
}

export const dynamic = "force-dynamic";

export default async function PropertyPage({ params }) {
  const slug = params.slug;

  const property = await getPropertyBySlugOrId(slug);
  if (!property) return notFound();

  const allProjects = await getAllProperties();

  /* ✅ SAFE BUILDER FETCH */
  let builder = null;
  if (property.builderId) {
    builder = await getBuilderById(property.builderId);
  }

  const amenitiesData = await getAmenitiesByIds(
    property.amenities || []
  );

  const locationString =
    [property.sector, property.locationName]
      .filter(Boolean)
      .join(", ") || property.location || "";

  /* ================= CLEAN PROPERTY ================= */
  const cleanProperty = {
    id: property.id,
    slug: property.slug,
    title: property.title,
    location: locationString,
    sector: property.sector || "",
    locationName: property.locationName || "",
    builderId: property.builderId || null,
    builderName: property.developer || "",
    configurations: property.configurations || [],
    bhk: (property.configurations || []).join(", "),
    price: property.priceRange,
    size: property.areaRange,
    rera: property.reraNumber,
    updatedAt: property.lastUpdated,

    brochure: property.brochure || null,

    /* 🔥 MAIN FIX — RIGHTSIDEBAR DATA */
    mainImage: property.mainImage || null,
    gallery: property.gallery || [],

    /* Mobile Gallery ke liye URLs array */
    images: [
      ...(property.mainImage?.url ? [property.mainImage.url] : []),
      ...(property.gallery?.map((g) => g.url) || []),
    ],

    video: property.video || null,
    overview: property.overview || {},
    floorPlans: property.floorPlans || [],
    paymentPlan: property.paymentPlan || [],
    amenities: amenitiesData,

    locationImage: property.locationImage?.url || "",
    mapQuery: property.mapQuery || property.location || "",
    locationPoints: property.locationPoints || [],

    faq: (property.faq || []).map((f) => ({
      q: f.question,
      a: f.answer,
    })),

    builder: builder && typeof builder === "object" ? builder : null,

    disclaimer: property.disclaimer || "",

    /* QUICK FACTS */
    projectArea: property.projectArea || "",
    projectType: property.projectType || "",
    projectStatus: property.projectStatus || "",
    projectElevation: property.projectElevation || "",
    possession: property.possession || "",
  };

  return (
    <ApartmentClient>
      <AutoPopup propertyTitle={cleanProperty.title} />

      <section className="max-w-[1240px] mx-auto px-4 md:px-6 lg:px-10 grid grid-cols-1 lg:grid-cols-3 gap-1">
        {/* LEFT */}
        <div className="lg:col-span-2 space-y-6">
          <MobileGallery
            images={cleanProperty.images}
            title={cleanProperty.title}
          />

          <TitleBlockWithBrochure property={cleanProperty} />

          <div className="sticky top-[96px] z-30 bg-white">
            <ScrollTabs />
          </div>

          <OverviewSection
            overview={cleanProperty.overview}
            propertyTitle={cleanProperty.title}
          />

          <FloorPlanSection floorPlans={cleanProperty.floorPlans} />

          <PaymentPlanSection
            paymentPlan={cleanProperty.paymentPlan}
          />

          <AmenitiesSection amenities={cleanProperty.amenities} />

          <LocationSection
            mapQuery={cleanProperty.mapQuery}
            locationImage={cleanProperty.locationImage}
            locationPoints={cleanProperty.locationPoints}
          />

          <EmiCalculatorSection />

          <FAQSection faq={cleanProperty.faq} />

          {cleanProperty.builder && (
            <DeveloperSection builder={cleanProperty.builder} />
          )}

          <SimilarProjectsSection
            projects={allProjects}
            currentSlug={cleanProperty.slug}
            currentDeveloper={cleanProperty.builderName}
          />

          <DisclaimerSection text={cleanProperty.disclaimer} />
        </div>

        {/* RIGHT */}
        {/* 🔥 MAIN FIX — NO DATA OVERRIDE */}
        <RightSidebar property={cleanProperty} />
      </section>

      <Footer />
    </ApartmentClient>
  );
}
