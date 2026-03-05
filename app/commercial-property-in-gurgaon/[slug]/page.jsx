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
    return { title: "Property Not Found" };
  }

  const seo = await getSEO(slug);

  const baseUrl = "https://www.neevrealty.com";

  const canonicalURL =
    seo?.canonical ||
    `${baseUrl}/commercial-property-in-gurgaon/${property.slug}`;

  const title =
    seo?.title ||
    property.metaTitle ||
    `${property.title} in ${property.location} | Price & Details`;

  const description =
    seo?.description ||
    property.metaDescription ||
    `Explore ${property.title} located in ${property.location}. Check price, floor plans, amenities and payment plans.`;

  return {
    title,
    description,
    alternates: { canonical: canonicalURL },
    openGraph: { title, description },
    twitter: { card: "summary", title, description },
  };
}

/* ================= PAGE ================= */
export default async function PropertyPage({ params }) {
   console.log("🚀 COMMERCIAL PAGE HIT");
  const slug = params.slug;
  const property = await getPropertyBySlugOrId(slug);
  if (!property) return notFound();

  const allProjects = await getAllProperties();

  let builder = null;
  if (property.builderId) {
    builder = await getBuilderById(property.builderId);
  }

  const amenitiesData = await getAmenitiesByIds(property.amenities || []);

  /* 🔥 Parent Detection (Commercial Version) */
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

  /* ================= CLEAN PROPERTY ================= */
  const cleanProperty = {
    ...property,
    images: [
      ...(property.mainImage?.url ? [property.mainImage.url] : []),
      ...(property.gallery?.map((g) => g.url) || []),
    ],
    amenities: amenitiesData,
    builder: builder || null,
    faq: (property.faq || []).map((f) => ({
      q: f.question,
      a: f.answer,
    })),
  };

  /* ================= SCHEMA ================= */
  const baseUrl = "https://www.neevrealty.com";

  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Product",
        name: cleanProperty.title,
        image: cleanProperty.images,
        description: `${cleanProperty.title} located in ${cleanProperty.location}`,
        brand: { "@type": "Brand", name: "Neev Realty" },
        offers: {
          "@type": "Offer",
          priceCurrency: "INR",
          price: cleanProperty.priceRange || "",
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      <ApartmentClient>
        <AutoPopup propertyTitle={cleanProperty.title} />

        {/* ✅ BREADCRUMB (Residential Style) */}
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

        {/* PAGE CONTENT SAME AS BEFORE */}
        <section className="max-w-[1240px] mx-auto px-4 md:px-6 lg:px-10 grid grid-cols-1 lg:grid-cols-3 gap-1">
          <div className="lg:col-span-2 space-y-6">
            <MobileGallery
              images={cleanProperty.images}
              title={cleanProperty.title}
            />

            <TitleBlockWithBrochure property={cleanProperty} />
            <ScrollTabs />
            <OverviewSection overview={cleanProperty.overview} />
            <FloorPlanSection floorPlans={cleanProperty.floorPlans} />
            <PaymentPlanSection paymentPlan={cleanProperty.paymentPlan} />
            <AmenitiesSection amenities={cleanProperty.amenities} />
            <LocationSection />
            <EmiCalculatorSection />
            <FAQSection faq={cleanProperty.faq} />

            {cleanProperty.builder && (
              <DeveloperSection builder={cleanProperty.builder} />
            )}

            <SimilarProjectsSection
              projects={allProjects}
              currentSlug={cleanProperty.slug}
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