import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import PropertyCard from "@/app/components/property/PropertyCard";


import { getAllProperties } from "@/lib/firestore/properties/read_server";

export const dynamic = "force-dynamic";

export default async function ResidentialPage() {
  const properties = await getAllProperties();

  return (
    <main className="w-screen overflow-x-hidden">

      {/* HEADER */}
      <Header />

      {/* PAGE TITLE */}
      <section className="max-w-[1240px] mx-auto px-4 py-12">
        <h1 className="text-3xl font-semibold text-gray-900 text-center">
          Residential <span className="text-[#F5A300]">Projects</span>
        </h1>
        <p className="text-sm text-gray-600 text-center mt-2">
          Explore all residential projects with verified details
        </p>
      </section>

      {/* PROPERTY GRID */}
      <section className="max-w-[1240px] mx-auto px-4 pb-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">

          {properties.map((p) => (
            <PropertyCard
              key={p.id}
              property={{
                title: p.title,
                builder: p.developer,
                location: p.location,
                bhk: p.configurations?.join(", "),
                size: p.areaRange,
                price: p.priceRange,
                img: p.mainImage?.url || p.gallery?.[0]?.url,
                slug: p.id,
              }}
            />
          ))}

        </div>
      </section>

      {/* FOOTER */}
      <Footer />
    </main>
  );
}
