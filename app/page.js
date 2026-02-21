import Header from "./components/Header";
import Footer from "./components/Footer";
import SearchCard from "./components/SearchCard";
import NewLaunchProjects from "./components/property/NewLaunchProjects";
import TrendingProjects from "./components/property/TrendingProjects";
import WhyChooseNeev from "./components/WhyChooseNeev";
import DevelopersSection from "./components/DevelopersSection";
import BlogSection from "./components/BlogSection";
import StatsBar from "./components/StatsBar";

import { getAllProperties } from "@/lib/firestore/products/read_server";
import { getBlogsForHome } from "@/lib/firestore/blogs/read";
import { getSEOServer } from "@/lib/firestore/seo/read_server_rest";

export const dynamic = "force-dynamic";

/* ✅ PROFESSIONAL DYNAMIC SEO */
export async function generateMetadata() {
  const seo = await getSEOServer("home");

  const title =
    seo?.title || "Neev Realty | Best Real Estate Company in Gurgaon";

  const description =
    seo?.description ||
    "Neev Realty offers premium flats, apartments and commercial spaces in Gurgaon.";

  const canonicalURL =
    seo?.canonical || "https://www.neevrealty.com/";

  const keywords = Array.isArray(seo?.keywords)
    ? seo.keywords
    : seo?.keywords?.split(",").map((k) => k.trim()) || [
        "real estate",
        "property in gurgaon",
        "neev realty",
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
}

export default async function Home() {
  const properties = await getAllProperties();
  const blogs = await getBlogsForHome();

  return (
    <main className="w-full overflow-x-hidden">
      <Header />
      <SearchCard />
      <NewLaunchProjects properties={properties} />
      <TrendingProjects properties={properties} />
      <WhyChooseNeev />
      <DevelopersSection />
      <BlogSection blogs={blogs} />
      <StatsBar />
      <Footer />
    </main>
  );
}