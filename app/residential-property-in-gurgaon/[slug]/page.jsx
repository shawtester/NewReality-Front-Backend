import { notFound } from "next/navigation";
import { getAllProperties } from "@/lib/firestore/products/read_server";
import { getBuilderById } from "@/lib/firestore/builders/read_server";
import { getPropertyBySlugOrId } from "@/lib/firestore/products/read_server";
import { getAmenitiesByIds } from "@/lib/firestore/amenities/read_server";

import Link from "next/link";
import Script from "next/script";
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

import { getSEO } from "@/lib/firestore/seo/read";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  console.log("🔥 METADATA FUNCTION CALLED");
  try {
    const slug = params.slug;
    const parentSlug = "residential-property-in-gurgaon";

    const propertyRaw = await getPropertyBySlugOrId(slug);
    const property = JSON.parse(JSON.stringify(propertyRaw));
    const seoRaw = await getSEO(slug);
    const seo = JSON.parse(JSON.stringify(seoRaw));

    if (!property) {
      return {
        title: "Property Not Found",
        description: "This property does not exist.",
      };
    }

    const getValid = (v) =>
      typeof v === "string" && v.trim() !== "" ? v : null;

    const title =
      getValid(seo?.title) ||
      getValid(property.metaTitle) ||
      `${property.title} in ${property.location} | Price & Details`;

    const description =
      getValid(seo?.description) ||
      getValid(property.metaDescription) ||
      `Explore ${property.title} located in ${property.location}. Check price, floor plans, amenities and more.`;

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
      `https://www.neevrealty.com/${parentSlug}/${property.slug}`;

    console.log("SEO:", seo);
    console.log("PROPERTY:", property);
    console.log("FINAL KEYWORDS:", keywords);
    console.log("FINAL CANONICAL:", canonicalURL);

    return {
      metadataBase: new URL("https://www.neevrealty.com"),
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
        siteName: "Neev Realty",
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
      },
    };
  } catch (error) {
    console.error("❌ METADATA ERROR:", error);

    return {
      title: "Error Loading Page",
      description: "Something went wrong",
    };
  }
}

export default async function PropertyPage({ params }) {
  console.log("🔥 RESIDENTIAL PAGE HIT");
  const slug = params.slug;

  const property = await getPropertyBySlugOrId(slug);
  if (!property) return notFound();

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

  const schemaImages = (cleanProperty.images || []).filter(
    (img) => typeof img === "string" && /^https?:\/\//.test(img)
  );

  const productSchema = {
    "@type": "Product",
    name: cleanProperty.title,
    description: `${cleanProperty.title} located in ${cleanProperty.location}. Explore price, floor plans, amenities and more.`,
    brand: {
      "@type": "Brand",
      name: cleanProperty.builderName || "Neev Realty",
    },
  };

  if (schemaImages.length > 0) {
    productSchema.image = schemaImages;
  }

  return (
    <>
      <Script
        id="property-schema"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                productSchema,
                {
                  "@type": "BreadcrumbList",
                  itemListElement: [
                  {
                    "@type": "ListItem",
                    position: 1,
                    name: "Home",
                    item: "https://www.neevrealty.com",
                  },
                  {
                    "@type": "ListItem",
                    position: 2,
                    name: "Residential",
                    item: "https://www.neevrealty.com/residential-property-in-gurgaon",
                  },
                  {
                    "@type": "ListItem",
                    position: 3,
                    name: cleanProperty.title,
                  },
                ],
              },
            ],
          }),
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

              <span className="text-gray-400">/</span>

              <Link
                href="/residential-property-in-gurgaon"
                className="hover:text-[#F5A300]"
              >
                Residential
              </Link>

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
                    href={`/residential-property-in-gurgaon?locality=${cleanProperty.locationName
                      .toLowerCase()
                      .replace(/\s+/g, "-")}`}
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
          <div className="lg:col-span-2 space-y-6">
            <MobileGallery
              images={cleanProperty.images}
              title={cleanProperty.title}
            />

            <TitleBlockWithBrochure property={cleanProperty} />

            <div className="sticky top-[64px] md:top-[96px] z-30 bg-white">
              <ScrollTabs />
            </div>

            <OverviewSection
              overview={cleanProperty.overview}
              propertyTitle={cleanProperty.title}
            />

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
