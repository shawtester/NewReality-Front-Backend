import Navbar from "../components/Header";
import Career from "./components/section1";
import LifeAtNeev from "./components/section2";
import WhatWeOffer from "./components/section3";
import Footer from "../components/Footer";

import { getSEO } from "@/lib/firestore/seo/read";

/* ✅ PROFESSIONAL DYNAMIC SEO */
export async function generateMetadata() {
  const slug = "careers"; // 🔥 Must match Firestore document ID

  try {
    const seo = await getSEO(slug);

    const title =
      seo?.title || "Careers — Neev Realty";

    const description =
      seo?.description ||
      "Explore exciting career opportunities at Neev Realty and grow with a leading real estate advisory in Gurgaon.";

    const canonicalURL =
      seo?.canonical ||
      "https://www.neevrealty.com/careers";

    const keywords = Array.isArray(seo?.keywords)
      ? seo.keywords
      : seo?.keywords?.split(",").map((k) => k.trim()) || [
          "careers neev realty",
          "real estate jobs gurgaon",
          "property consultant jobs",
        ];

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
    return {
      title: "Careers — Neev Realty",
      description:
        "Explore career opportunities at Neev Realty.",
    };
  }
}

export default function CareerPage() {
  return (
    <div>
      <Navbar />
      <Career />
      <LifeAtNeev />
      <WhatWeOffer />
      <Footer />
    </div>
  );
}