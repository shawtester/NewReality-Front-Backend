import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import PropertyCard from "@/app/components/property/PropertyCard";

import { getAllProperties } from "@/lib/firestore/products/read_server";

export const dynamic = "force-dynamic";

export default async function NewLaunchPage() {
  const properties = await getAllProperties();

  const newLaunch = properties.filter((p) => p?.isNewLaunch === true);

  return (
    <>
      <Header />

      <section className="max-w-[1240px] mx-auto px-4 py-16">
        {/* HEADER */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-semibold text-gray-900">
            New Launch <span className="text-[#DBA40D]">Projects</span>
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Explore all newly launched residential & commercial projects
          </p>
        </div>

        {/* GRID */}
        {newLaunch.length === 0 ? (
          <p className="text-center text-gray-500">
            No new launch projects available
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {newLaunch.map((p) => (
              <PropertyCard
                key={p.id}
                property={{
                  title: p.title,
                  builder: p.developer,
                  location: p.location,
                  bhk: p.configurations?.join(", "),
                  size: p.areaRange,
                  price: p.priceRange,
                  img: p.mainImage?.url || "/images/placeholder.jpg",
                  slug: p.id,
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
