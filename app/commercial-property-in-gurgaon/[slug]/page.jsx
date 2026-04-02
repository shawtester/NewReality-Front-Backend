import { notFound } from "next/navigation";
import Link from "next/link";
import Script from "next/script";
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

export async function generateMetadata({ params }) {
  console.log("🔥 METADATA FUNCTION CALLED");
  try {
    const slug = params.slug;

    const propertyRaw = await getPropertyBySlugOrId(slug);
    const property = JSON.parse(JSON.stringify(propertyRaw));
    const seoRaw = await getSEO(slug);
    const seo = JSON.parse(JSON.stringify(seoRaw));

    if (!property) {
      return {
        title: "Property Not Found",
        description: "",
      };
    }

    const baseUrl = "https://www.neevrealty.com";

    const getValid = (v) =>
      typeof v === "string" && v.trim() !== "" ? v : null;

    let parentSlug = "commercial-property-in-gurgaon";
    if (property?.isRetail) parentSlug = "retail-shops-in-gurgaon";
    if (property?.isSCO) parentSlug = "sco-plots-in-gurgaon";

    const title =
      getValid(seo?.title) ||
      getValid(property.metaTitle) ||
      `${property.title} in ${property.location} | Price & Details`;

    const description =
      getValid(seo?.description) ||
      getValid(property.metaDescription) ||
      `Explore ${property.title} located in ${property.location}.`;

    const keywordsRaw =
      getValid(seo?.metaKeywords) ||
      getValid(property.metaKeywords) ||
      "";

    const keywords = keywordsRaw
      ? keywordsRaw.split(",").map((k) => k.trim()).filter(Boolean)
      : [];

    const canonicalURL =
      getValid(seo?.canonical) ||
      getValid(property.canonical) ||
      `${baseUrl}/${parentSlug}/${property.slug}`;

    console.log("FINAL KEYWORDS:", keywords);
    console.log("FINAL CANONICAL:", canonicalURL);

    return {
      metadataBase: new URL(baseUrl),
      title,
      description,
      keywords,
      alternates: {
        canonical: canonicalURL,
      },
      openGraph: {
        title,
        description,
        url: canonicalURL,
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
      },
    };
  } catch (err) {
    console.error("❌ METADATA ERROR:", err);

    return {
      title: "Error",
      description: "Something went wrong",
    };
  }
}

export default async function PropertyPage({ params }) {
  console.log("🚀 COMMERCIAL PAGE HIT");

  const slug = params.slug;
  const property = await getPropertyBySlugOrId(slug);
  if (!property) return notFound();

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
  const allProjects = await getAllProperties();

  let builder = null;
  if (property.builderId) {
    builder = await getBuilderById(property.builderId);
  }

  const amenitiesData = await getAmenitiesByIds(property.amenities || []);

  const locationString =
    [property.sector, property.locationName].filter(Boolean).join(", ") ||
    property.location ||
    "";

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

  const baseUrl = "https://www.neevrealty.com";

  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Product",
        name: cleanProperty.title,
        image: cleanProperty.images,
        description: `${cleanProperty.title} located in ${cleanProperty.location}.`,
        brand: {
          "@type": "Brand",
          name: cleanProperty.builderName || "Neev Realty",
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
                  item: `${baseUrl}/${parentSlug}`,
                },
              ]
            : []),
          {
            "@type": "ListItem",
            position:
              parentSlug !== "commercial-property-in-gurgaon" ? 4 : 3,
            name: cleanProperty.title,
          },
        ],
      },
    ],
  };

  return (
    <>
      <Script
        id="property-schema"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schema),
        }}
      />

      <ApartmentClient>
        <AutoPopup propertyTitle={cleanProperty.title} />

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
