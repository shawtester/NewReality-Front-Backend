import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import PropertyCard from "@/app/components/property/PropertyCard";

import { getAllProperties } from "@/lib/firestore/products/read_server";

export const dynamic = "force-dynamic";

export default async function TrendingProjectsPage() {
  const properties = await getAllProperties();

  // ✅ Filter trending projects
  const trending = properties.filter((p) => p?.isTrending === true);

  return (
    <>
      <Header />

      <section className="max-w-[1240px] mx-auto px-4 py-16">
        {/* HEADER */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-semibold text-gray-900">
            Trending <span className="text-[#DBA40D]">Projects</span>
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Explore our most popular and in-demand projects
          </p>
        </div>

        {/* GRID */}
        {trending.length === 0 ? (
          <p className="text-center text-gray-500">
            No trending projects available
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {trending.map((p) => (
              <PropertyCard
                key={p.id}
                property={{
                  title: p.title,
                  builder: p.developer,
                  location: p.location,
                  bhk: p.configurations?.join(", "),
                  size: p.areaRange,
                  price: p.priceRange,
                  img: p.mainImage?.url || "/placeholder.png",
                  slug: p.slug || p.id,
                  isRera: p.isRera,
                }}
              />
            ))}
          </div>
        )}
      </section>

      <Footer />
    </>
  );
}
