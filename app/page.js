import Header from "./components/Header";
import Footer from "./components/Footer";
import NewLaunchProjects from "./components/property/NewLaunchProjects";
import TrendingProjects from "./components/property/TrendingProjects";
import { getAllProperties } from "@/lib/firestore/products/read_server";

export const dynamic = "force-dynamic";

export default async function Home() {
  const properties = await getAllProperties();
    

  console.log("HOME PROPERTIES 👉", properties);

  return (
    <main className="w-screen h-screen overflow-x-hidden overflow-y-auto">
      <Header />

      <NewLaunchProjects properties={properties} />
      <TrendingProjects properties={properties} />

      <Footer />
    </main>
  );
}
