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

// 🔥 Firebase SEO import
import { getSEO } from "@/lib/firestore/seo/read";

export const dynamic = "force-dynamic";

// ================== METADATA ==================
export async function generateMetadata({ params }) {
  const slug = params.slug;

  // 1️⃣ Fetch property
  const property = await getPropertyBySlugOrId(slug);

  if (!property) {
    return {
      title: "Property Not Found",
      description: "",
    };
  }

  // 2️⃣ Fetch Firebase SEO for this property
  const seo = await getSEO(slug);

  // 3️⃣ Use Firebase SEO if exists, otherwise fallback to property meta fields
  const title =
    seo?.title ||
    property.metaTitle ||
    `${property.title} in ${property.location} | Price & Details`;

  const description =
    seo?.description ||
    property.metaDescription ||
    `Explore ${property.title} located in ${property.location}. Check price, floor plans, amenities and payment plans.`;

  const keywords =
    seo?.keywords ||
    property.metaKeywords ||
    `${property.title}, ${property.location}, real estate`;

  // ✅ Replace OG image with canonical URL
  const canonicalURL =
    seo?.canonical || `https://yourdomain.com/residential/${property.slug}`;

  return {
    title,
    description,
    keywords,
    openGraph: {
      title,
      description,
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
    alternates: {
      canonical: canonicalURL,
    },
  };
}

// ================== PAGE COMPONENT ==================
export default async function PropertyPage({ params }) {
  const slug = params.slug;

  // 1️⃣ Fetch property
  const property = await getPropertyBySlugOrId(slug);
  if (!property) return notFound();

  // 2️⃣ Fetch all properties for "Similar Projects"
  const allProjects = await getAllProperties();

  // 3️⃣ Fetch builder safely
  let builder = null;
  if (property.builderId) {
    builder = await getBuilderById(property.builderId);
  }

  // 4️⃣ Fetch amenities
  const amenitiesData = await getAmenitiesByIds(property.amenities || []);

  // 5️⃣ Format location string
  const locationString =
    [property.sector, property.locationName].filter(Boolean).join(", ") ||
    property.location ||
    "";

  // 6️⃣ Clean property object
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

    mainImage: property.mainImage || null,
    gallery: property.gallery || [],
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

    projectArea: property.projectArea || "",
    projectType: property.projectType || "",
    projectStatus: property.projectStatus || "",
    projectElevation: property.projectElevation || "",
    possession: property.possession || "",
  };

  // ================== RENDER ==================
  return (
    <ApartmentClient>
      <AutoPopup propertyTitle={cleanProperty.title} />

      <section className="max-w-[1240px] mx-auto px-4 md:px-6 lg:px-10 grid grid-cols-1 lg:grid-cols-3 gap-1">
        {/* LEFT */}
        <div className="lg:col-span-2 space-y-6">
          <MobileGallery images={cleanProperty.images} title={cleanProperty.title} />

          <TitleBlockWithBrochure property={cleanProperty} />

          <div className="sticky top-[64px] md:top-[96px] z-30 bg-white">
            <ScrollTabs />
          </div>

          <OverviewSection overview={cleanProperty.overview} propertyTitle={cleanProperty.title} />

          <FloorPlanSection floorPlans={cleanProperty.floorPlans} />

          <PaymentPlanSection paymentPlan={cleanProperty.paymentPlan} />

          <AmenitiesSection amenities={cleanProperty.amenities} />

          <LocationSection
            mapQuery={cleanProperty.mapQuery}
            locationImage={cleanProperty.locationImage}
            locationPoints={cleanProperty.locationPoints}
          />

          <EmiCalculatorSection />

          <FAQSection faq={cleanProperty.faq} />

          {cleanProperty.builder && <DeveloperSection builder={cleanProperty.builder} />}

          <SimilarProjectsSection
            projects={allProjects}
            currentSlug={cleanProperty.slug}
            currentDeveloper={cleanProperty.builderName}
          />

          <DisclaimerSection text={cleanProperty.disclaimer} />
        </div>

        {/* RIGHT */}
        <RightSidebar property={cleanProperty} />
      </section>

      <Footer />
    </ApartmentClient>
  );
}
