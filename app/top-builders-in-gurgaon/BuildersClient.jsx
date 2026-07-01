"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { useBuilders } from "@/lib/firestore/builders/read";
import { useActiveBuilderProjectCounts } from "@/lib/firestore/products/count/read_client";
import Header from "../components/Header";
import Footer from "../components/Footer";

const introText =
  "Gurgaon has become one of the most searched residential markets in North India, and the reason is simple. The city offers jobs, infrastructure, and lifestyle in one place. Over the years, planned sectors, wide roads, metro connectivity, and corporate hubs have completely changed how people look at property investment in Gurgaon.";

const getProjectCount = (builder, activeProjectCounts) => {
  return (activeProjectCounts[builder.id] ?? Number(builder?.totalProjects)) || 0;
};

function BuilderLogo({ builder }) {
  if (builder?.logo?.url) {
    return (
      <Image
        src={builder.logo.url}
        alt={builder.name || "Builder logo"}
        width={58}
        height={58}
        className="h-[58px] w-[58px] rounded-full object-contain"
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
    <div className="flex h-[58px] w-[58px] items-center justify-center rounded-full border border-[#EFE7D6] bg-[#FAFAFA] text-sm font-semibold text-[#C6900A]">
      {initials || "NR"}
    </div>
  );
}

function BuilderCard({ builder, activeProjectCounts }) {
  const projectCount = getProjectCount(builder, activeProjectCounts);
  const projectLabel = `${projectCount} ${
    projectCount === 1 ? "Project" : "Projects"
  } in Gurgaon`;
  const href = `/builder/${builder?.slug || builder?.id || ""}`;

  return (
    <Link
      href={href}
      className="relative flex min-h-[154px] flex-col items-center justify-end rounded-[4px] border border-gray-100 bg-white px-5 pb-5 pt-12 shadow-[0_12px_28px_rgba(15,23,42,0.04)] transition hover:-translate-y-1 hover:shadow-[0_16px_34px_rgba(15,23,42,0.08)]"
    >
      <div className="absolute -top-8 flex h-[86px] w-[86px] items-center justify-center rounded-full border border-gray-100 bg-white shadow-[0_10px_22px_rgba(15,23,42,0.06)]">
        <BuilderLogo builder={builder} />
      </div>

      <h2 className="mt-3 max-w-full text-center text-[15px] font-semibold leading-snug text-gray-900">
        {builder?.name || "Neev Realty"}
      </h2>

      <p className="mt-1 text-center text-[11px] font-medium text-gray-600">
        {projectLabel}
      </p>

      <span
        className="mt-5 flex h-8 w-full max-w-[250px] items-center justify-center rounded-full border border-[#E9A91B] text-[11px] font-medium text-gray-800 transition hover:bg-[#E9A91B] hover:text-white"
      >
        View More
      </span>
    </Link>
  );
}

export default function BuildersClient({ builders: initialBuilders = [], pageContent }) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState(false);
  const { builders: liveBuilders, isLoading } = useBuilders();
  const { counts: activeProjectCounts } = useActiveBuilderProjectCounts();
  const builders = liveBuilders?.length ? liveBuilders : initialBuilders;

  const filteredBuilders = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();
    const list = builders.filter((builder) => builder?.isActive !== false);

    if (!normalizedSearch) return list;

    return list.filter((builder) =>
      builder?.name?.toLowerCase().includes(normalizedSearch)
    );
  }, [builders, search]);

  return (
    <>
      <Header />

      <div className="mx-auto max-w-[1240px] px-4 py-3">
        <nav className="flex items-center gap-2 text-[13px] text-gray-700">
          <button
            type="button"
            onClick={() => router.push("/")}
            className="transition hover:text-[#DBA40D]"
          >
            Home
          </button>
          <span className="text-gray-400">/</span>
          <span>Top Builders in gurgaon</span>
        </nav>
      </div>

      <section className="bg-[#F6FBFF]">
        <div className="mx-auto max-w-[1240px] px-4 py-6">
          <div className="flex items-start justify-between gap-4">
            <h1 className="text-xl font-semibold text-gray-900 sm:text-2xl md:text-[26px]">
              Top Real Estate Builders in Gurgaon
            </h1>
            <div className="whitespace-nowrap pt-1 text-sm text-gray-500">
              {isLoading && !builders.length
                ? "Loading..."
                : `${filteredBuilders.length} results`}
            </div>
          </div>

          <div className="mt-3 max-w-[980px] text-[13px] leading-6 text-gray-800">
            {pageContent ? (
              <div 
                className={expanded ? "" : "line-clamp-2 prose prose-sm max-w-none"}
                dangerouslySetInnerHTML={{ __html: pageContent }} 
              />
            ) : (
              <p className={expanded ? "" : "line-clamp-2"}>{introText}</p>
            )}
            <button
              type="button"
              onClick={() => setExpanded((value) => !value)}
              className="mt-1 text-[12px] font-medium text-[#E9A91B]"
            >
              {expanded ? "Read Less" : "Read More"}
            </button>
          </div>
        </div>
      </section>

      <main className="bg-white pb-14 pt-16 md:pt-20">
        <div className="mx-auto max-w-[1240px] px-4">
          <div className="mx-auto mb-20 flex h-11 w-full max-w-[500px] items-center rounded-full bg-[#F1F3F5] px-6">
            <Search aria-hidden="true" size={15} className="mr-3 text-gray-400" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search Developers by name..."
              className="h-full min-w-0 flex-1 bg-transparent text-[12px] text-gray-700 outline-none placeholder:text-gray-400"
            />
          </div>

          {filteredBuilders.length > 0 ? (
            <div className="mx-auto grid max-w-[900px] grid-cols-1 gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
              {filteredBuilders.map((builder) => (
                <BuilderCard
                  key={builder.id}
                  builder={builder}
                  activeProjectCounts={activeProjectCounts}
                />
              ))}
            </div>
          ) : isLoading ? (
            <div className="mx-auto grid max-w-[900px] grid-cols-1 gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={index}
                  className="relative min-h-[154px] rounded-[4px] border border-gray-100 bg-white shadow-[0_12px_28px_rgba(15,23,42,0.04)]"
                >
                  <div className="absolute left-1/2 top-0 h-[86px] w-[86px] -translate-x-1/2 -translate-y-8 rounded-full border border-gray-100 bg-gray-50" />
                  <div className="mx-auto mt-16 h-3 w-28 rounded-full bg-gray-100" />
                  <div className="mx-auto mt-3 h-2 w-24 rounded-full bg-gray-100" />
                  <div className="mx-auto mt-6 h-8 w-[80%] rounded-full border border-[#E9A91B]/40" />
                </div>
              ))}
            </div>
          ) : (
            <div className="mx-auto max-w-[520px] rounded-[4px] border border-gray-100 bg-white px-6 py-10 text-center shadow-sm">
              <h2 className="text-base font-semibold text-gray-900">
                No builders found
              </h2>
              <p className="mt-2 text-sm text-gray-500">
                Try searching with another developer name.
              </p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}
