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

import { getSEO } from "@/lib/firestore/seo/read";

export const dynamic = "force-dynamic";

/* ================== METADATA ================== */
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
  const canonicalURL =
seo?.canonical || `${baseUrl}/commercial/${property.slug}`;
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

  return {
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
      card: "summary",
      title,
      description,
    },
  };
}

/* ================== PAGE ================== */
export default async function PropertyPage({ params, searchParams }) {
const type = searchParams?.type || "";

  const property = await getPropertyBySlugOrId(slug);
  if (!property) return notFound();

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

  /* ================== CLEAN PROPERTY ================== */
  const cleanProperty = {
    id: property.id,
    slug: property.slug,
    title: property.title,
    location: locationString,
    builderName: property.developer || "",
    price: property.priceRange || "",
    images: [
      ...(property.mainImage?.url ? [property.mainImage.url] : []),
      ...(property.gallery?.map((g) => g.url) || []),
    ],
    overview: property.overview || {},
    faq: (property.faq || []).map((f) => ({
      q: f.question,
      a: f.answer,
    })),
  };

  /* ================== PRICE CLEANING ================== */
  const numericPrice =
    cleanProperty.price?.replace(/[^0-9]/g, "") || "";

  /* ================== SCHEMA ================== */

  const baseUrl = "https://www.neevrealty.com";
const propertyUrl = type
  ? `${baseUrl}/commercial/${cleanProperty.slug}?type=${type}`
  : `${baseUrl}/commercial/${cleanProperty.slug}`;

  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      /* ===== Breadcrumb ===== */
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
      item: `${baseUrl}/commercial`,
    },

    ...(type
      ? [
          {
            "@type": "ListItem",
            position: 3,
            name: type
              .replace(/-/g, " ")
              .replace(/\b\w/g, (l) => l.toUpperCase()),
            item: `${baseUrl}/commercial?type=${type}`,
          },
          {
            "@type": "ListItem",
            position: 4,
            name: cleanProperty.title,
            item: propertyUrl,
          },
        ]
      : [
          {
            "@type": "ListItem",
            position: 3,
            name: cleanProperty.title,
            item: propertyUrl,
          },
        ]),
  ],
},

      /* ===== Product ===== */
      {
        "@type": "Product",
        "@id": propertyUrl,
        name: cleanProperty.title,
        image: cleanProperty.images,
        description:
          cleanProperty.overview?.description ||
          cleanProperty.title,

        brand: {
          "@type": "Brand",
          name: cleanProperty.builderName || "Neev Realty",
        },

        offers: {
          "@type": "Offer",
          url: propertyUrl,
          priceCurrency: "INR",
          price: numericPrice,
          availability: "https://schema.org/InStock",
        },

        seller: {
          "@type": "RealEstateAgent",
          name: "Neev Realty",
          url: baseUrl,
        },
      },

      /* ===== FAQ ===== */
      cleanProperty.faq?.length > 0 && {
        "@type": "FAQPage",
        mainEntity: cleanProperty.faq.map((item) => ({
          "@type": "Question",
          name: item.q,
          acceptedAnswer: {
            "@type": "Answer",
            text: item.a,
          },
        })),
      },
    ].filter(Boolean),
  };

  /* ================== RENDER ================== */

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
              "name": "Commercial",
              "item": "https://www.neevrealty.com/commercial-property-in-gurgaon"
            },
            {
              "@type": "ListItem",
              "position": 3,
              "name": cleanProperty.title
            }
          ]
        }

      ]
    })
  }}
/>

    <ApartmentClient>
      {/* SCHEMA INJECTION */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schema),
        }}
      />

      <AutoPopup propertyTitle={cleanProperty.title} />

      <section className="max-w-[1240px] mx-auto px-4 md:px-6 lg:px-10 grid grid-cols-1 lg:grid-cols-3 gap-1">
        <div className="lg:col-span-2 space-y-6">
          <MobileGallery
            images={cleanProperty.images}
            title={cleanProperty.title}
          />

          <TitleBlockWithBrochure property={property} />
          <ScrollTabs />
          <OverviewSection overview={property.overview} />
          <FloorPlanSection floorPlans={property.floorPlans} />
          <PaymentPlanSection paymentPlan={property.paymentPlan} />
          <AmenitiesSection amenities={amenitiesData} />
          <LocationSection />
          <EmiCalculatorSection />
          <FAQSection faq={cleanProperty.faq} />

          {builder && <DeveloperSection builder={builder} />}

          <SimilarProjectsSection
            projects={allProjects}
            currentSlug={cleanProperty.slug}
          />

          <DisclaimerSection text={property.disclaimer} />
        </div>

        <RightSidebar property={property} />
      </section>

      <Footer />
    </ApartmentClient>
    </>
  );
}