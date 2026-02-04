import Header from "./components/Header";
import Footer from "./components/Footer";
import SearchCard from "./components/SearchCard";
import NewLaunchProjects from "./components/property/NewLaunchProjects";
import TrendingProjects from "./components/property/TrendingProjects";
import WhyChooseNeev from "./components/WhyChooseNeev";
import DevelopersSection from "./components/DevelopersSection";
import BlogSection from "./components/BlogSection";
import StatsBar from "@/app/components/StatsBar";
import { getAllProperties } from "@/lib/firestore/products/read_server";
import { getBlogsForHome } from "@/lib/firestore/blogs/read";

export const dynamic = "force-dynamic";

export default async function Home() {
  const properties = await getAllProperties();
  const blogs = await getBlogsForHome();
 

  return (
    <main className="w-screen overflow-x-hidden">
      <Header />

      {/* 🔍 HERO + SEARCH */}
      <SearchCard />

      {/* 🆕 NEW LAUNCH (Admin Driven)*/}
      <NewLaunchProjects properties={properties} />

      {/* 🔥 TRENDING (Admin Driven) */}
      <TrendingProjects properties={properties} />

      {/* ⭐ WHY CHOOSE */}
      <WhyChooseNeev />
      


      {/* 🏗 DEVELOPERS */}
      <DevelopersSection />

      {/* 📰 BLOGS (ADMIN DRIVEN) */}
      <BlogSection blogs={blogs} />
      
      {/* Stats */}
      <StatsBar />
      <Footer />
    </main>
  );
}
