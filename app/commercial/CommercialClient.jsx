








"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useCallback, useMemo, useRef } from "react";
import Image from "next/image";
import Header from "../components/Header";
import { getBanner } from "@/lib/firestore/banners/read";
import Footer from "../components/Footer";
import PropertyCard from "../components/property/PropertyCard";
import Pagination from "../components/property/Pagination";

/* ================= EXPANDABLE TEXT ================= */
const ExpandableText = ({ children: text, maxLines = 2, className = "" }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const textRef = useRef(null);

  useEffect(() => {
    if (textRef.current) {
      const element = textRef.current;
      const lineHeight = parseFloat(getComputedStyle(element).lineHeight);
      const maxHeight = lineHeight * maxLines;
      setIsOverflowing(element.scrollHeight > maxHeight);
    }
  }, [text, maxLines]);

  return (
    <div className={`space-y-1 ${className}`}>
      <div
        ref={textRef}
        className="leading-relaxed transition-all duration-300"
        style={{
          display: "-webkit-box",
          WebkitLineClamp: isExpanded ? "unset" : maxLines,
          WebkitBoxOrient: "vertical",
          overflow: isExpanded ? "visible" : "hidden",
        }}
      >
        {text}
      </div>

      {isOverflowing && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-sm text-[#F5A300] font-medium pt-1"
        >
          {isExpanded ? "Read Less" : "Read More"}
        </button>
      )}
    </div>
  );
};

/* ================= COMMERCIAL FILTER FUNCTIONS ================= */
const COMMERCIAL_TYPE_MAP = {
  "retail-shops": "isRetail",
  "sco-plots": "isSCO",
};

const filterForCommercial = (list = []) =>
  list.filter(
    (item) => !item.propertyType || item.propertyType === "commercial"
  );

const filterCommercialByType = (list = [], type) => {
  const field = COMMERCIAL_TYPE_MAP[type];
  if (!field) return filterForCommercial(list);
  return list.filter(
    (item) =>
      (!item.propertyType || item.propertyType === "commercial") &&
      item[field] === true
  );
};

/* ================= PAGE ================= */
export default function CommercialPage({ apartments = [] }) {
  const BASE_ROUTE = "/commercial";
  const router = useRouter();
  const searchParams = useSearchParams();

  /* ================= STATES ================= */
  const DEFAULT_INTRO_TEXT = `Strategic commercial properties in prime Gurgaon locations with excellent ROI potential.
Explore high-demand retail shops and SCO plots along Dwarka Expressway, Golf Course Road,
and NH-8. Perfect investment opportunities in Gurgaon's thriving commercial real estate market.`;

  const [banner, setBanner] = useState(null);
  const [introText, setIntroText] = useState(DEFAULT_INTRO_TEXT);
  const [pageTitleDynamic, setPageTitleDynamic] = useState(
    "Commercial Properties for Sale in Gurgaon"
  );
  const [pageTitle, setPageTitle] = useState(
    "Commercial Properties for Sale in Gurgaon"
  );

  const [keyword, setKeyword] = useState("");
  const [type, setType] = useState("");
  const [status, setStatus] = useState("");
  const [locality, setLocality] = useState("");
  const [budget, setBudget] = useState("");
  const [bhk, setBhk] = useState("");
  const [page, setPage] = useState(1);
  const [filteredApartments, setFilteredApartments] = useState([]);
  const [loading, setLoading] = useState(false);

  const apartmentsPerPage = 12;

  /* ================= UTILS ================= */
  const formatFilterName = (value) =>
    value?.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()) || "";

  /* ================= URL FILTER LOGIC ================= */
  useEffect(() => {
    const urlKeyword = searchParams.get("q") || "";
    const urlType = searchParams.get("type") || "";
    const urlStatus = searchParams.get("status") || "";
    const urlLocality = searchParams.get("locality") || "";
    const urlBudget = searchParams.get("budget") || "";
    const urlPage = Number(searchParams.get("page")) || 1;

    setKeyword(urlKeyword);
    setType(urlType);
    setStatus(urlStatus);
    setLocality(urlLocality);
    setBudget(urlBudget);
    setPage(urlPage);

    let title = "Commercial Properties for Sale in Gurgaon";

    if (urlType) {
      title = `${formatFilterName(urlType)} for Sale in Gurgaon`;
    } else if (urlStatus) {
      title = `${formatFilterName(urlStatus)} Projects in Gurgaon`;
    } else if (urlLocality) {
      title = `${formatFilterName(urlLocality)} Properties in Gurgaon`;
    } else if (urlBudget) {
      title = `${urlBudget.replace(/-/g, " ")} Properties in Gurgaon`;
    }

    setPageTitleDynamic(title);

    if (urlType) {
      setFilteredApartments(filterCommercialByType(apartments, urlType));
    } else {
      setFilteredApartments(filterForCommercial(apartments));
    }
  }, [searchParams, apartments]);

  /* ================= BANNER + ADMIN OVERRIDE (RESIDENTIAL STYLE) ================= */
  useEffect(() => {
    let category = "commercial";
    const urlType = searchParams.get("type");

    if (urlType === "retail-shops") category = "retail";
    else if (urlType === "sco-plots") category = "sco";

    const fetchBanner = async () => {
      const data = await getBanner(category);
      setBanner(data);

      if (data?.introText) setIntroText(data.introText);
      else setIntroText(DEFAULT_INTRO_TEXT);

      if (data?.pageTitle) setPageTitle(data.pageTitle);
      else setPageTitle(pageTitleDynamic);
    };

    fetchBanner();
  }, [searchParams, pageTitleDynamic]);

  /* ================= SEARCH ================= */
  const handleSearch = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        q: keyword || undefined,
        type: type || undefined,
        status: status || undefined,
        locality: locality || undefined,
        budget: budget || undefined,
      });

      for (const [k, v] of params) if (!v) params.delete(k);

      const res = await fetch(`/api/search?${params.toString()}`);
      const data = await res.json();
      const safeData = Array.isArray(data) ? data : [];
      setFilteredApartments(filterCommercialByType(safeData, type));
      setPage(1);
    } catch {
      setFilteredApartments(filterForCommercial(apartments));
    } finally {
      setLoading(false);
    }
  }, [keyword, type, status, locality, budget, apartments]);

  const handlePageChange = useCallback(
    (newPage) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("page", newPage.toString());
      router.push(`${BASE_ROUTE}?${params.toString()}`, { scroll: false });
    },
    [searchParams, router]
  );

  /* ================= PAGINATION ================= */
  const totalPages = useMemo(
    () => Math.ceil(filteredApartments.length / apartmentsPerPage),
    [filteredApartments.length]
  );

  const currentPage = Number(searchParams.get("page")) || page;
  const startIndex = (currentPage - 1) * apartmentsPerPage;
  const currentApartments = filteredApartments.slice(
    startIndex,
    startIndex + apartmentsPerPage
  );

  /* ================= RENDER ================= */
  return (
    <>
      <Header />

      {/* PAGE INTRO */}
      <section className="bg-[#F6FBFF]">
        <div className="max-w-[1240px] mx-auto px-4 py-6">
          <div className="text-sm text-gray-500 mb-3">Commercial</div>
          <div className="flex flex-col lg:flex-row lg:justify-between gap-4">
            <div className="max-w-4xl">
              <h1 className="text-xl sm:text-2xl md:text-[26px] font-semibold text-gray-900">
                {banner?.pageTitle || pageTitleDynamic}
              </h1>

              <ExpandableText
                maxLines={2}
                className="mt-2 text-sm sm:text-[15px] text-gray-600"
              >
                {introText}
              </ExpandableText>
            </div>

            <div className="text-sm text-gray-500">
              {filteredApartments.length} results
            </div>
          </div>
        </div>
      </section>

      {/* TRENDING BANNER */}
      <section className="bg-white py-6">
        <div className="max-w-[1440px] mx-auto px-4">
          <h2 className="text-center text-2xl font-bold mb-4">
            Trending <span className="text-[#F5A300]">Projects</span>
          </h2>
          <div className="relative w-full h-[250px] rounded-lg overflow-hidden">
            <Image
              src={banner?.image || "/default-banner.jpg"}
              alt="Trending Banner"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </section>

       {/* ================= 3. HERO SECTION ================= */}
            <section className="lg:bg-[#F6FBFF] pt-4 relative">
                {/* MOBILE HERO TEXT */}
                <div className="lg:hidden mb-6 text-center px-2">
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 leading-tight">
                        Your <span className="text-[#F5A300]">Property</span>, <br />
                        Our Priority.
                    </h1>
                </div>

                <div className="max-w-[1240px] mx-auto px-4">
                    <div className="relative hidden lg:flex items-start gap-10">
                        <div className="flex-1 ml-10">
                            <h1 className="text-[42px] sm:text-[52px] font-extrabold text-gray-900 leading-tight">
                                Your <span className="text-[#F5A300]">Property</span>, <br />
                                Our Priority.
                            </h1>
                        </div>
                        <div className="flex-1 flex p-4 justify-center self-end relative z-10">
                            <div className="relative w-[240px] h-[240px] sm:w-[310px] sm:h-[310px] md:w-[370px] md:h-[370px] lg:w-[450px] lg:h-[420px] rounded-[40px] lg:rounded-[60px] overflow-hidden shadow-xl">
                                <Image src="/images/residental.jpg" alt="Commercial Property collage" fill className="object-cover" priority />
                            </div>
                        </div>
                    </div>

                    {/* ✅ MOBILE SEARCH - 6 SELECTS EXACT SAME */}
                    <div className="lg:hidden mt-8 mb-12">
                        <div className="bg-white shadow-2xl p-3 w-full flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center md:gap-2 md:p-4 rounded-2xl max-w-full">
                            <input value={keyword} onChange={(e) => setKeyword(e.target.value)} placeholder="Enter Keyword" className="w-full px-3 py-2.5 rounded-full bg-gray-50 outline-none text-sm flex-1 min-w-0" />
                            <select value={type} onChange={(e) => handleFilterChange('type', e.target.value)} className="w-full px-3 py-2.5 rounded-full bg-gray-50 text-sm md:w-28 flex-shrink-0">
                                <option>Type</option><option value="commercial">Commercial Property</option><option value="retail-shops">Retail Shops</option><option value="sco-plots">SCO Plots</option>
                            </select>
                            <select value={status} onChange={(e) => handleFilterChange('status', e.target.value)} className="w-full px-3 py-2.5 rounded-full bg-gray-50 text-sm md:w-28 flex-shrink-0">
                                <option>Status</option><option value="new-launch">New Launch Project</option><option value="ready-to-move">Ready to Move Project</option><option value="under-construction">Under Construction Project</option><option value="pre-launch">Pre Launch Project</option>
                            </select>
                            <select value={locality} onChange={(e) => handleFilterChange('locality', e.target.value)} className="w-full px-3 py-2.5 rounded-full bg-gray-50 text-sm md:w-28 flex-shrink-0">
                                <option>Localities</option><option value="dwarka-expressway">Dwarka Expressway</option><option value="golf-course-road">Golf Course Road</option><option value="golf-course-extension-road">Golf Course Extension Road</option><option value="sohna-road">Sohna Road</option><option value="new-gurgaon">New Gurgaon</option><option value="old-gurgaon">Old Gurgaon</option><option value="spr">SPR</option><option value="nh8">NH8</option>
                            </select>
                            <select value={budget} onChange={(e) => handleFilterChange('budget', e.target.value)} className="w-full px-3 py-2.5 rounded-full bg-gray-50 text-sm md:w-28 flex-shrink-0">
                                <option>Budget</option><option value="1-2-cr">1 – 2 Cr</option><option value="2-3-cr">2 – 3 Cr</option><option value="3-4-cr">3 – 4 Cr</option><option value="4-5-cr">4 – 5 Cr</option><option value="5-6-cr">5 – 6 Cr</option><option value="6-7-cr">6 – 7 Cr</option><option value="7-8-cr">7 – 8 Cr</option><option value="above-8-cr">Above 8 Cr</option>
                            </select>
                            <select value={bhk} onChange={(e) => handleFilterChange('bhk', e.target.value)} className="w-full px-3 py-2.5 rounded-full bg-gray-50 text-sm md:w-28 flex-shrink-0">
                                <option value="">Size</option><option value="1-bhk">1 BHK</option><option value="1.5-bhk">1.5 BHK</option><option value="2-bhk">2 BHK</option><option value="2.5-bhk">2.5 BHK</option><option value="3-bhk">3 BHK</option><option value="3.5-bhk">3.5 BHK</option><option value="4-bhk">4 BHK</option><option value="4.5-bhk">4.5 BHK</option><option value="5-bhk">5 BHK</option><option value="above-5-bhk">Above 5 BHK</option>
                            </select>
                            <button className="w-full px-4 py-2.5 rounded-full bg-[#F5A300] text-white font-medium text-sm md:w-24 flex-shrink-0">Search</button>
                        </div>
                    </div>

                    {/* ✅ DESKTOP SEARCH - EXACT POSITIONING */}
                    <div className="hidden lg:block absolute bottom-40 right-1 -translate-x-1/2 w-full max-w-[950px] z-20 px-4">
                        <div className="
  bg-white relative
  lg:left-[44%]
  xl:left-[10%]
  2xl:right-[28%]
  shadow-2xl px-5 py-3
  flex items-center gap-3
  rounded-full
  border border-yellow-400
">                             <input value={keyword} onChange={(e) => setKeyword(e.target.value)} placeholder="Enter Keyword" className="flex-1 px-5 py-3 rounded-full bg-gray-50 outline-none text-sm flex-shrink-0 min-w-0" />
                            <select value={type} onChange={(e) => handleFilterChange('type', e.target.value)} className="w-28 px-3 py-3 rounded-full bg-gray-50 text-sm flex-shrink-0">
                                <option>Type</option><option value="commercial">Commercial Property</option><option value="retail-shops">Retail Shops</option><option value="sco-plots">SCO Plots</option>
                            </select>
                            <select value={status} onChange={(e) => handleFilterChange('status', e.target.value)} className="w-28 px-3 py-3 rounded-full bg-gray-50 text-sm flex-shrink-0">
                                <option>Status</option><option value="new-launch">New Launch Project</option><option value="ready-to-move">Ready to Move Project</option><option value="under-construction">Under Construction Project</option><option value="pre-launch">Pre Launch Project</option>
                            </select>
                            <select value={locality} onChange={(e) => handleFilterChange('locality', e.target.value)} className="w-28 px-3 py-3 rounded-full bg-gray-50 text-sm flex-shrink-0">
                                <option>Localities</option><option value="dwarka-expressway">Dwarka Expressway</option><option value="golf-course-road">Golf Course Road</option><option value="golf-course-extension-road">Golf Course Extension Road</option><option value="sohna-road">Sohna Road</option><option value="new-gurgaon">New Gurgaon</option><option value="old-gurgaon">Old Gurgaon</option><option value="spr">SPR</option><option value="nh8">NH8</option>
                            </select>
                            <select value={budget} onChange={(e) => handleFilterChange('budget', e.target.value)} className="w-28 px-3 py-3 rounded-full bg-gray-50 text-sm flex-shrink-0">
                                <option>Budget</option><option value="1-2-cr">1 – 2 Cr</option><option value="2-3-cr">2 – 3 Cr</option><option value="3-4-cr">3 – 4 Cr</option><option value="4-5-cr">4 – 5 Cr</option><option value="5-6-cr">5 – 6 Cr</option><option value="6-7-cr">6 – 7 Cr</option><option value="7-8-cr">7 – 8 Cr</option><option value="above-8-cr">Above 8 Cr</option>
                            </select>
                            <select value={bhk} onChange={(e) => handleFilterChange('bhk', e.target.value)} className="w-28 px-3 py-3 rounded-full bg-gray-50 text-sm flex-shrink-0">
                                <option value="">Size</option><option value="1-bhk">1 BHK</option><option value="1.5-bhk">1.5 BHK</option><option value="2-bhk">2 BHK</option><option value="2.5-bhk">2.5 BHK</option><option value="3-bhk">3 BHK</option><option value="3.5-bhk">3.5 BHK</option><option value="4-bhk">4 BHK</option><option value="4.5-bhk">4.5 BHK</option><option value="5-bhk">5 BHK</option><option value="above-5-bhk">Above 5 BHK</option>
                            </select>
                            <button className="w-24 px-4 py-3 rounded-full bg-[#F5A300] text-white font-medium text-sm flex-shrink-0">Search</button>
                        </div>
                    </div>
                </div>
            </section>

      {/* LISTINGS */}
      <main className="py-10">
        <div className="max-w-[1240px] mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentApartments.map((item) => (
            <PropertyCard
              key={item.id}
              baseRoute="commercial"
              property={{
                title: item.title,
                developer: item.developer,
                location: item.location,
                bhk: item.configurations?.join(", "),
                size: item.areaRange,
                price: item.priceRange,
                img: item.mainImage?.url || "/placeholder.jpg",
                slug: item.slug || item.id,
                isTrending: item.isTrending,
                isNewLaunch: item.isNewLaunch,
                isRera: item.isRera,
              }}
            />
          ))}
        </div>

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </main>

      <Footer />
    </>
  );
}
