import Navbar from "../components/Header";
import Career from "./components/section1";
import LifeAtNeev from "./components/section2";
import WhatWeOffer from "./components/section3";
import Footer from "../components/Footer";

import { getSEO } from "@/lib/firestore/seo/read";

export async function generateMetadata() {
  const slug = "careers";

  try {
    const seo = await getSEO(slug);

    return {
      title: seo?.title || "Careers — Neev Realty",
      description:
        seo?.description ||
        "Explore career opportunities at Neev Realty.",
      keywords:
        seo?.keywords ||
        "careers, jobs, real estate jobs",
      alternates: {
        canonical:
          seo?.canonical ||
          "https://yourdomain.com/careers",
      },
    };
  } catch (error) {
    return {
      title: "Careers — Neev Realty",
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
