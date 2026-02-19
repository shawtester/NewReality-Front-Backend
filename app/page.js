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

export async function generateMetadata() {
  const seo = await getSEOServer("home");

  const title = seo?.title || "Default Home Title";
  const description = seo?.description || "Default Home Description";
  const canonicalURL = seo?.canonical || "https://yourdomain.com/";

  return {
    title,
    description,
    keywords: seo?.keywords || "home, real estate, property",
    openGraph: { title, description },
    twitter: { card: "summary", title, description },
    alternates: { canonical: canonicalURL },
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
