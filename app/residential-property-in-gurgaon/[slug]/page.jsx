import { notFound } from "next/navigation";
import { getAllProperties } from "@/lib/firestore/products/read_server";
import { getBuilderById } from "@/lib/firestore/builders/read_server";
import { getPropertyBySlugOrId } from "@/lib/firestore/products/read_server";
import { getAmenitiesByIds } from "@/lib/firestore/amenities/read_server";

import Link from "next/link";

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

  // 🔥 Parent Category Detection
  const parentSlug = "residential-property-in-gurgaon";
  // If in future you create dynamic parent routing,
  // replace this with actual parent slug logic.

  const SLUG_LABEL_MAP = {
    "residential-property-in-gurgaon": "Residential",
    "luxury-apartments-in-gurgaon": "Luxury Apartments",
    "builder-floor-in-gurgaon": "Builder Floor",
  };

  const currentSlugLabel =
    SLUG_LABEL_MAP[parentSlug] || "Residential";

  const currentBaseRoute = `/${parentSlug}`;

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
  console.log("🔥 RESIDENTIAL PAGE HIT");
  const slug = params.slug;



  // 🔥 Detect Parent Category from URL
  const pathnameParts = params?.slug ? [] : [];

  // 1️⃣ Fetch property
  const property = await getPropertyBySlugOrId(slug);
  if (!property) return notFound();

  // 🔥 NOW detect parent (after property exists)
  let parentSlug = "residential-property-in-gurgaon";
  let parentLabel = "Residential";

  if (property?.isApartment) {
    parentSlug = "luxury-apartments-in-gurgaon";
    parentLabel = "Luxury Apartments";
  }

  if (property?.isBuilderFloor) {
    parentSlug = "builder-floor-in-gurgaon";
    parentLabel = "Builder Floor";
  }

  const currentBaseRoute = `/${parentSlug}`;

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
    <>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [

              // ✅ PRODUCT SCHEMA
              {
                "@type": "Product",
                "name": cleanProperty.title,
                "image": cleanProperty.images,
                "description": `${cleanProperty.title} located in ${cleanProperty.location}. Explore price, floor plans, amenities and more.`,
                "brand": {
                  "@type": "Brand",
                  "name": "Neev Realty"
                },
                "offers": {
                  "@type": "Offer",
                  "priceCurrency": "INR",
                  "price": cleanProperty.price || "",
                  "availability": "https://schema.org/InStock",
                  "url": `https://www.neevrealty.com/residential/${cleanProperty.slug}`
                }
              },

              // ✅ BREADCRUMB SCHEMA
              {
                "@type": "BreadcrumbList",
                "itemListElement": [
                  {
                    "@type": "ListItem",
                    "position": 1,
                    "name": "Home",
                    "item": "https://www.neevrealty.com"
                  },
                  {
                    "@type": "ListItem",
                    "position": 2,
                    "name": "Residential",
                    "item": "https://www.neevrealty.com/residential-property-in-gurgaon"
                  },
                  ...(parentSlug !== "residential-property-in-gurgaon"
                    ? [{
                      "@type": "ListItem",
                      "position": 3,
                      "name": parentLabel,
                      "item": `https://www.neevrealty.com${currentBaseRoute}`
                    }]
                    : []),
                  {
                    "@type": "ListItem",
                    "position": parentSlug !== "residential-property-in-gurgaon" ? 4 : 3,
                    "name": cleanProperty.title
                  }
                ]
              }

            ]
          })
        }}
      />


      <ApartmentClient>
        <AutoPopup propertyTitle={cleanProperty.title} />


        {/* ✅ BREADCRUMB */}
        <section className="bg-white ml-12">
          <div className="max-w-[1240px] mx-auto px-4 py-3 text-sm text-gray-600">
            <nav className="flex flex-wrap items-center gap-2">

              <Link href="/" className="hover:text-[#F5A300]">
                Home
              </Link>

              <span className="text-gray-400">/</span>

              {/* Residential Always */}
              <Link
                href="/residential-property-in-gurgaon"
                className="hover:text-[#F5A300]"
              >
                Residential
              </Link>

              {/* Sub Category (Only if not base residential) */}
              {parentSlug !== "residential-property-in-gurgaon" && (
                <>
                  <span className="text-gray-400">/</span>
                  <Link
                    href={currentBaseRoute}
                    className="hover:text-[#F5A300]"
                  >
                    {parentLabel}
                  </Link>
                </>
              )}

              {cleanProperty.locationName && (
                <>
                  <span className="text-gray-400">/</span>
                  <Link
                    href={`/residential-property-in-gurgaon?locality=${cleanProperty.locationName.toLowerCase().replace(/\s+/g, "-")}`}
                    className="hover:text-[#F5A300]"
                  >
                    {cleanProperty.locationName}
                  </Link>
                </>
              )}

              <span className="text-gray-400">/</span>

              <span className="text-gray-800 font-medium">
                {cleanProperty.title}
              </span>

            </nav>
          </div>
        </section>

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
    </>
  );
}
