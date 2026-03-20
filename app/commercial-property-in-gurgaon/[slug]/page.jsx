import { notFound } from "next/navigation";
import Link from "next/link";

import { getAllProperties } from "@/lib/firestore/products/read_server";
import { getBuilderById } from "@/lib/firestore/builders/read_server";
import { getPropertyBySlugOrId } from "@/lib/firestore/products/read_server";
import { getAmenitiesByIds } from "@/lib/firestore/amenities/read_server";
import { getSEO } from "@/lib/firestore/seo/read";

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

export const dynamic = "force-dynamic";

/* ================= METADATA ================= */

export async function generateMetadata({ params }) {
  const slug = params.slug;

  const property = await getPropertyBySlugOrId(slug);

  if (!property) {
    return {
      title: "Property Not Found",
      description: "",
    };
  }

  const seo = await getSEO(slug);

  const baseUrl = "https://www.neevrealty.com";

  const title =
    seo?.title ||
    property.metaTitle ||
    `${property.title} in ${property.location} | Price & Details`;

  const description =
    seo?.description ||
    property.metaDescription ||
    `Explore ${property.title} located in ${property.location}. Check price, floor plans, amenities and payment plans.`;

  let parentSlug = "commercial-property-in-gurgaon";
  if (property?.isRetail) parentSlug = "retail-shops-in-gurgaon";
  if (property?.isSCO) parentSlug = "sco-plots-in-gurgaon";

  const keywords =
    seo?.keywords
      ? Array.isArray(seo.keywords)
        ? seo.keywords.join(", ")
        : seo.keywords
      : property.metaKeywords || "";

  const canonicalURL =
    seo?.canonical ||
    `${baseUrl}/${parentSlug}/${property.slug}`;

  return {
    title,
    description,

    // ✅ FIX KEYWORDS
    keywords: keywords
      ? keywords.split(",").map((k) => k.trim())
      : [],

    // ✅ IMPORTANT: FULL URL USE KAR
    openGraph: {
      title,
      description,
      url: canonicalURL,
    },

    twitter: {
      card: "summary",
      title,
      description,
    },

    // ✅ MOST IMPORTANT (THIS FIXES CANONICAL)
    alternates: {
      canonical: canonicalURL,
    },
  };
}

/* ================= PAGE ================= */

export default async function PropertyPage({ params }) {
  console.log("🚀 COMMERCIAL PAGE HIT");

  const slug = params.slug;

  const property = await getPropertyBySlugOrId(slug);
  if (!property) return notFound();

  /* 🔥 Parent Category Detection */

  let parentSlug = "commercial-property-in-gurgaon";
  let parentLabel = "Commercial";

  if (property?.isRetail) {
    parentSlug = "retail-shops-in-gurgaon";
    parentLabel = "Retail Shops";
  }

  if (property?.isSCO) {
    parentSlug = "sco-plots-in-gurgaon";
    parentLabel = "SCO Plots";
  }

  const currentBaseRoute = `/${parentSlug}`;

  /* ================= FETCH DATA ================= */

  const allProjects = await getAllProperties();

  let builder = null;

  if (property.builderId) {
    builder = await getBuilderById(property.builderId);
  }

  const amenitiesData = await getAmenitiesByIds(property.amenities || []);

  /* ================= LOCATION STRING ================= */

  const locationString =
    [property.sector, property.locationName].filter(Boolean).join(", ") ||
    property.location ||
    "";

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

    mainImage: property.mainImage || null,
    gallery: property.gallery || [],

    images: Array.from(
      new Set([
        ...(property.mainImage?.url ? [property.mainImage.url] : []),
        ...(property.gallery?.map((g) => g.url) || []),
      ]),
    ),

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

  /* ================= SCHEMA ================= */

  const baseUrl = "https://www.neevrealty.com";

  const dedupeGraph = (graph) => {
    const seen = new Set();
    return graph.filter((item) => {
      const key = `${item["@type"]}-${item.name || item.item || JSON.stringify(item)}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  };

  const schema = {
    "@context": "https://schema.org",

    "@graph": dedupeGraph([
      {
        "@type": "Organization",
        "name": "Neev Realty",
        "url": "https://www.neevrealty.com",
        "logo": "https://www.neevrealty.com/logo.png",
        "image": "https://www.neevrealty.com/logo.png",
        "telephone": "+91-9999999999",
        "priceRange": "₹₹ - ₹₹₹"
      },
      {
        "@type": "Product",
        name: cleanProperty.title,
        image: cleanProperty.images,
        description: `${cleanProperty.title} located in ${cleanProperty.location}`,
        brand: {
          "@type": "Brand",
          name: "Neev Realty",
        },
        offers: {
          "@type": "Offer",
          priceCurrency: "INR",
          price: cleanProperty.price || "",
          availability: "https://schema.org/InStock",
          url: `${baseUrl}${currentBaseRoute}/${cleanProperty.slug}`,
        },
      },

      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: baseUrl,
          },

          {
            "@type": "ListItem",
            position: 2,
            name: "Commercial",
            item: `${baseUrl}/commercial-property-in-gurgaon`,
          },

          ...(parentSlug !== "commercial-property-in-gurgaon"
            ? [
                {
                  "@type": "ListItem",
                  position: 3,
                  name: parentLabel,
                  item: `${baseUrl}${currentBaseRoute}`,
                },
              ]
            : []),

          {
            "@type": "ListItem",
            position: parentSlug !== "commercial-property-in-gurgaon" ? 4 : 3,
            name: cleanProperty.title,
          },
        ],
      },
    ]),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      <ApartmentClient>
        <AutoPopup propertyTitle={cleanProperty.title} />

        {/* BREADCRUMB */}

        <section className="bg-white">
          <div className="max-w-[1240px] mx-auto px-4 py-3 text-sm text-gray-600">
            <nav className="flex flex-wrap items-center gap-2">
              <Link href="/" className="hover:text-[#F5A300]">
                Home
              </Link>

              <span>/</span>

              <Link
                href="/commercial-property-in-gurgaon"
                className="hover:text-[#F5A300]"
              >
                Commercial
              </Link>

              {parentSlug !== "commercial-property-in-gurgaon" && (
                <>
                  <span>/</span>

                  <Link
                    href={currentBaseRoute}
                    className="hover:text-[#F5A300]"
                  >
                    {parentLabel}
                  </Link>
                </>
              )}

              <span>/</span>

              <span className="font-medium text-gray-800">
                {cleanProperty.title}
              </span>
            </nav>
          </div>
        </section>

        {/* PAGE CONTENT */}

        <section className="max-w-[1240px] mx-auto px-4 md:px-6 lg:px-10 grid grid-cols-1 lg:grid-cols-3 gap-1">
          <div className="lg:col-span-2 space-y-6">
            <MobileGallery
              images={cleanProperty.images}
              title={cleanProperty.title}
            />

            <TitleBlockWithBrochure property={cleanProperty} />

            <div className="sticky top-[64px] md:top-[96px] z-30 bg-white">
              <ScrollTabs />
            </div>

            <OverviewSection overview={cleanProperty.overview} />

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

          <RightSidebar property={cleanProperty} />
        </section>

        <Footer />
      </ApartmentClient>
    </>
  );
}
