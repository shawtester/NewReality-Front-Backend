import Navbar from "../components/Header";
import Footer from "../components/Footer";

import Hero from "./components/Hero";
import OurServices from "./components/OurServices";
import BigServices from "./components/BigServices";

import { getSEO } from "@/lib/firestore/seo/read";

export async function generateMetadata() {
  const slug = "our-services";

  try {
    const seo = await getSEO(slug);

    return {
      title: seo?.title || "Services — Neev Realty",
      description: seo?.description || "Explore our real estate services.",
      keywords: seo?.keywords || "real estate services, property",
      alternates: {
        canonical: seo?.canonical || "https://yourdomain.com/our-services",
      },
    };
  } catch (error) {
    return {
      title: "Services — Neev Realty",
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
