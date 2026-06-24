"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Building2,
  CalendarDays,
  CheckCircle2,
  Home,
  MapPin,
} from "lucide-react";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import PropertyCard from "../../components/property/PropertyCard";
import { db } from "@/lib/firebase";
import { toWebpUrl } from "@/lib/cloudinary/toWebpUrl";

const sanitizeSchemaHtml = (input = "") =>
  input
    .replace(
      /<script[^>]*type=["']application\/ld\+json["'][^>]*>[\s\S]*?<\/script>/gi,
      ""
    )
    .replace(/\sitemtype=["']https?:\/\/schema\.org\/\w+["']/gi, "")
    .replace(/\sitemscope\b/gi, "");

const stripHtml = (value = "") => value.replace(/<[^>]*>/g, " ").trim();

const getProjectCount = (builder) => {
  return Number(builder?.totalProjects) || 0;
};

function LogoBlock({ builder }) {
  if (builder?.logo?.url) {
    return (
      <Image
        src={builder.logo.url}
        alt={builder.name || "Builder logo"}
        width={92}
        height={92}
        className="h-[92px] w-[92px] object-contain"
      />
    );
  }

  const initials = (builder?.name || "NR")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();

  return (
    <div className="flex h-[92px] w-[92px] items-center justify-center bg-[#171717] text-xl font-semibold text-white">
      {initials || "NR"}
    </div>
  );
}

function Stat({ icon: Icon, label, value }) {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#F5A300] text-black">
        <Icon size={19} strokeWidth={2.2} />
      </div>
      <p className="mt-4 text-[11px] font-medium uppercase tracking-wide text-gray-500">
        {label}
      </p>
      <p className="mt-2 text-sm font-semibold text-gray-900">
        {value || 0}
      </p>
    </div>
  );
}

function ProfileSkeleton() {
  return (
    <div className="mx-auto mt-10 max-w-[1240px] px-4">
      <div className="rounded-[8px] border border-gray-100 bg-white p-6 shadow-[0_12px_28px_rgba(15,23,42,0.06)]">
        <div className="flex gap-6">
          <div className="h-[110px] w-[110px] rounded bg-gray-100" />
          <div className="flex-1">
            <div className="h-6 w-52 rounded bg-gray-100" />
            <div className="mt-4 h-3 w-80 max-w-full rounded bg-gray-100" />
            <div className="mt-2 h-3 w-[70%] rounded bg-gray-100" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function BuilderDetailClient({ builderId }) {
  const router = useRouter();
  const [builder, setBuilder] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    if (!builderId) return;

    let cancelled = false;

    const loadBuilderDetails = async () => {
      setLoading(true);

      try {
        const builderSnap = await getDoc(doc(db, "builders", builderId));
        const builderData = builderSnap.exists()
          ? { id: builderSnap.id, ...builderSnap.data() }
          : null;

        const projectsByBuilderId = await getDocs(
          query(collection(db, "properties"), where("builderId", "==", builderId))
        );

        let projectDocs = projectsByBuilderId.docs;

        if (!projectDocs.length && builderData?.name) {
          const projectsByDeveloperName = await getDocs(
            query(
              collection(db, "properties"),
              where("developer", "==", builderData.name)
            )
          );

          projectDocs = projectsByDeveloperName.docs;
        }

        const projectList = projectDocs
          .map((projectDoc) => {
            const data = projectDoc.data();
            return {
              id: projectDoc.id,
              ...data,
              mainImage: data?.mainImage?.url
                ? { ...data.mainImage, url: toWebpUrl(data.mainImage.url) }
                : data?.mainImage,
              timestampCreate: data?.timestampCreate?.seconds || 0,
            };
          })
          .filter((project) => project.isActive !== false)
          .sort((a, b) => (b.timestampCreate || 0) - (a.timestampCreate || 0));

        if (!cancelled) {
          setBuilder(builderData);
          setProjects(projectList);
        }
      } catch (error) {
        console.error("Builder detail load failed:", error);
        if (!cancelled) {
          setBuilder(null);
          setProjects([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadBuilderDetails();

    return () => {
      cancelled = true;
    };
  }, [builderId]);

  const description = sanitizeSchemaHtml(builder?.description || "");
  const hasDescription = stripHtml(description).length > 0;
  const totalProjects = useMemo(
    () => getProjectCount(builder),
    [builder]
  );

  return (
    <>
      <Header />

      <div className="mx-auto max-w-[1240px] px-4 py-3">
        <nav className="flex flex-wrap items-center gap-2 text-[13px] text-gray-700">
          <button
            type="button"
            onClick={() => router.push("/")}
            className="transition hover:text-[#DBA40D]"
          >
            Home
          </button>
          <span className="text-gray-400">/</span>
          <button
            type="button"
            onClick={() => router.push("/top-builders-in-gurgaon")}
            className="transition hover:text-[#DBA40D]"
          >
            Top Builders in Gurgaon
          </button>
          {builder?.name && (
            <>
              <span className="text-gray-400">/</span>
              <span>{builder.name}</span>
            </>
          )}
        </nav>
      </div>

      {loading ? (
        <ProfileSkeleton />
      ) : builder ? (
        <main className="bg-white pb-14">
          <section className="mx-auto mt-8 max-w-[1240px] px-4">
            <div className="rounded-[8px] border border-gray-100 bg-white p-5 shadow-[0_14px_34px_rgba(15,23,42,0.07)] md:p-6">
              <div className="flex flex-col gap-5 md:flex-row md:items-start">
                <div className="flex h-[118px] w-[118px] shrink-0 items-center justify-center rounded-[4px] border border-gray-100 bg-white shadow-sm">
                  <LogoBlock builder={builder} />
                </div>

                <div className="min-w-0 flex-1">
                  <h1 className="text-2xl font-semibold text-gray-900 md:text-[28px]">
                    {builder.name}
                  </h1>

                  <div className="mt-2 flex flex-wrap gap-2">
                    <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
                      <CheckCircle2 size={13} className="text-[#DBA40D]" />
                      RERA Certified
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
                      <Home size={13} className="text-[#DBA40D]" />
                      Luxury Developer
                    </span>
                  </div>

                  <div className="mt-4 max-w-[860px] text-sm leading-6 text-gray-700">
                    {hasDescription ? (
                      <>
                        <div
                          className={expanded ? "" : "line-clamp-3"}
                          dangerouslySetInnerHTML={{ __html: description }}
                        />
                        <button
                          type="button"
                          onClick={() => setExpanded((value) => !value)}
                          className="mt-1 text-xs font-semibold text-[#DBA40D]"
                        >
                          {expanded ? "Read Less" : "Read More"}
                        </button>
                      </>
                    ) : (
                      <p>
                        Explore projects by {builder.name}, one of Gurgaon's
                        leading real estate developers.
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="my-6 h-px w-full bg-gray-100" />

              <div className="grid grid-cols-2 gap-7 md:grid-cols-4">
                <Stat
                  icon={CalendarDays}
                  label="Established"
                  value={builder.establishedYear || "-"}
                />
                <Stat icon={Building2} label="Total Projects" value={totalProjects} />
                <Stat
                  icon={Home}
                  label="Ongoing Projects"
                  value={builder.ongoingProjects || 0}
                />
                <Stat
                  icon={MapPin}
                  label="Cities Present"
                  value={builder.citiesPresent || 0}
                />
              </div>
            </div>
          </section>

          <section className="mx-auto mt-8 max-w-[1240px] px-4">
            <h2 className="text-2xl font-semibold text-gray-800">
              Properties by {builder.name}
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Explore curated luxury residences and commercial spaces.
            </p>

            {projects.length > 0 ? (
              <div className="mt-7 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {projects.map((item) => (
                  <PropertyCard
                    key={item.id}
                    property={{
                      title: item.title,
                      builder: item.developer || builder.name,
                      locationName: item.location,
                      sector: item.sector,
                      bhk: item.configurations?.join(", "),
                      size: item.areaRange,
                      price: item.priceRange,
                      img: item.mainImage?.url || "/placeholder.jpg",
                      slug: item.slug || item.id,
                      propertyType: item.propertyType,
                      isTrending: item.isTrending,
                      isNewLaunch: item.isNewLaunch,
                      isRera: item.isRera,
                    }}
                  />
                ))}
              </div>
            ) : (
              <div className="mt-7 rounded-[6px] border border-gray-100 bg-gray-50 px-6 py-10 text-center">
                <h3 className="text-base font-semibold text-gray-900">
                  No projects found
                </h3>
                <p className="mt-2 text-sm text-gray-500">
                  Projects for this builder will appear here once added.
                </p>
              </div>
            )}
          </section>
        </main>
      ) : (
        <main className="mx-auto max-w-[700px] px-4 py-16 text-center">
          <h1 className="text-2xl font-semibold text-gray-900">
            Builder not found
          </h1>
          <button
            type="button"
            onClick={() => router.push("/top-builders-in-gurgaon")}
            className="mt-5 rounded-sm bg-[#DBA40D] px-5 py-2 text-sm font-medium text-white"
          >
            Back to Builders
          </button>
        </main>
      )}

      <Footer />
    </>
  );
}
