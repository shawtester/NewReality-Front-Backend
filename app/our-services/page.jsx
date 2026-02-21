import Navbar from "../components/Header";
import Footer from "../components/Footer";

import Hero from "./components/Hero";
import OurServices from "./components/OurServices";
import BigServices from "./components/BigServices";

import { getSEO } from "@/lib/firestore/seo/read";

/* ✅ PROFESSIONAL DYNAMIC SEO */
export async function generateMetadata() {
  const slug = "our-services"; // 🔥 Must match Firestore document ID

  try {
    const seo = await getSEO(slug);

    const title =
      seo?.title || "Our Services — Neev Realty";

    const description =
      seo?.description ||
      "Explore premium real estate services offered by Neev Realty including residential and commercial property consulting in Gurgaon.";

    const canonicalURL =
      seo?.canonical ||
      "https://www.neevrealty.com/our-services";

    const keywords = Array.isArray(seo?.keywords)
      ? seo.keywords
      : seo?.keywords?.split(",").map((k) => k.trim()) || [
          "real estate services gurgaon",
          "property consultancy",
          "neev realty services",
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
      title: "Our Services — Neev Realty",
      description:
        "Explore real estate services provided by Neev Realty in Gurgaon.",
    };
  }
}

export default function OurServicesPage() {
  return (
    <main className="bg-white text-gray-900 overflow-x-hidden">
      <Navbar />

      <section className="w-full">
        <div className="max-w-[1480px] mx-auto px-4 sm:px-6 lg:px-8">
          <Hero />
          <OurServices />
          <BigServices />
        </div>
      </section>

      <Footer />
    </main>
  );
}