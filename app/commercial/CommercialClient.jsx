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
          className="text-sm text-[#F5A300] font-medium pt-1 cursor-pointer"
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

// 💰 Extract min & max price from priceRange
const extractPriceRange = (priceRange = "") => {
  if (!priceRange) return { min: 0, max: 0 };

  const cleaned = priceRange
    .toLowerCase()
    .replace(/cr|crore|₹|,/g, "")
    .trim();

  if (cleaned.includes("-")) {
    const [min, max] = cleaned.split("-").map(Number);
    return {
      min: min || 0,
      max: max || min || 0,
    };
  }

  const value = parseFloat(cleaned) || 0;
  return { min: value, max: value };
};



// ✅ COMMERCIAL PRO FILTER ENGINE
const applyCommercialFilters = ({
  apartments = [],
  keyword = "",
  type = "",
  status = "",
  locality = "",
  budget = "",
  bhk = ""
}) => {
  let filtered = apartments.filter(
    (item) => !item.propertyType || item.propertyType === "commercial"
  );



  // 🔎 KEYWORD SEARCH
  if (keyword) {
    const lower = keyword.toLowerCase();
    filtered = filtered.filter((item) =>
      item.title?.toLowerCase().includes(lower) ||
      item.location?.toLowerCase().includes(lower) ||
      item.developer?.toLowerCase().includes(lower)
    );
  }

  // 🏢 TYPE
  if (type && COMMERCIAL_TYPE_MAP[type]) {
    filtered = filtered.filter(
      (item) => item[COMMERCIAL_TYPE_MAP[type]] === true
    );
  }

  // 🚧 STATUS
  if (status) {
  filtered = filtered.filter((item) => {
    if (status === "new-launch") return item.isNewLaunch;
    if (status === "ready-to-move") return item.isReadyToMove;
    if (status === "under-construction") return item.isUnderConstruction;
    if (status === "pre-launch") return item.isPreLaunch;
    return true;
  });
}


  // 📍 LOCALITY
  if (locality) {
    filtered = filtered.filter((item) =>
      item.location?.toLowerCase().includes(
        locality.replace(/-/g, " ").toLowerCase()
      )
    );
  }


  // 💰 BUDGET FILTER
if (budget) {
  filtered = filtered.filter((item) => {
    const { min: propertyMin, max: propertyMax } =
      extractPriceRange(item.priceRange);

    if (budget === "above-8-cr") {
      return propertyMax >= 8;
    }

    const [min, max] = budget
      .replace("-cr", "")
      .split("-")
      .map(Number);

    // ✅ Proper range overlap logic
    return propertyMax >= min && propertyMin <= max;
  });
}



  return filtered;
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
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [filteredApartments, setFilteredApartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const isFilterApplied = Boolean(
    searchParams.get("type") ||
    searchParams.get("status") ||
    searchParams.get("locality") ||
    searchParams.get("budget") ||
    searchParams.get("bhk") ||
    searchParams.get("q")
  );

  const apartmentsPerPage = 12;

  /* ================= UTILS ================= */
  const formatFilterName = (value) =>
    value?.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()) || "";

  /* ================= BANNER UTILITIES - FIXED ✅ ================= */
  const getCurrentImageLink = useCallback((index) => {
    // ✅ PRIORITY 1: Check imageLinks Object (main commercial page)
    if (banner?.imageLinks && typeof banner.imageLinks === 'object') {
      const imageLinksArray = Object.entries(banner.imageLinks);
      return imageLinksArray[index]?.[1] || null;
    }

    // ✅ PRIORITY 2: Check images array (retail/sco banners)
    if (banner?.images && Array.isArray(banner.images)) {
      return banner.images[index] || null;
    }

    // ✅ PRIORITY 3: Fallback single image
    return banner?.image || null;
  }, [banner]);

  const handleBannerImageClick = useCallback(() => {
    const link = getCurrentImageLink(currentImageIndex);
    console.log("🔗 Banner click - Image index:", currentImageIndex, "Link:", link);

    if (link) {
      window.open(link, '_blank', 'noopener,noreferrer');
    } else {
      console.warn("⚠️ No link found for image at index:", currentImageIndex, "Banner:", banner);
    }
  }, [currentImageIndex, getCurrentImageLink, banner]);

  /* ================= FILTER HANDLER ================= */
  const handleFilterChange = useCallback((filterName, value) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(filterName, value);
    } else {
      params.delete(filterName);
    }
    params.set('page', '1');
    router.push(`${BASE_ROUTE}?${params.toString()}`, { scroll: false });
  }, [searchParams, router]);

  const handleClearFilters = () => {
    router.push(BASE_ROUTE, { scroll: false });
  };


  /* ================= URL FILTER LOGIC ================= */
  useEffect(() => {
    const urlKeyword = searchParams.get("q") || "";
    const urlType = searchParams.get("type") || "";
    const urlStatus = searchParams.get("status") || "";
    const urlLocality = searchParams.get("locality") || "";
    const urlBudget = searchParams.get("budget") || "";
    const urlBhk = searchParams.get("bhk") || "";
    const urlPage = Number(searchParams.get("page")) || 1;

    setKeyword(urlKeyword);
    setType(urlType);
    setStatus(urlStatus);
    setLocality(urlLocality);
    setBudget(urlBudget);
    setBhk(urlBhk);

    let title = "Commercial Properties for Sale in Gurgaon";
    if (urlType) {
      title = `${formatFilterName(urlType)} for Sale in Gurgaon`;
    } else if (urlStatus) {
      title = `${formatFilterName(urlStatus)} Projects in Gurgaon`;
    } else if (urlLocality) {
      title = `${formatFilterName(urlLocality)} Properties in Gurgaon`;
    } else if (urlBudget) {
      title = `${urlBudget.replace(/-/g, " to ")} Properties in Gurgaon`;
    }
    setPageTitleDynamic(title);


    const filtered = applyCommercialFilters({
      apartments,
      keyword: urlKeyword,
      type: urlType,
      status: urlStatus,
      locality: urlLocality,
      budget: urlBudget,
      bhk: urlBhk
    });

    setFilteredApartments(filtered);
  }, [searchParams, apartments]);

  /* ================= BANNER FETCH - ROBUST ✅ ================= */
  useEffect(() => {
    let category = "commercial";
    const urlType = searchParams.get("type");

    if (urlType === "retail-shops") category = "retail";
    else if (urlType === "sco-plots") category = "sco";

    const fetchBanner = async () => {
      try {
        const data = await getBanner(category);
        console.log("📸", category, "banner data:", data);
        setBanner(data);

        if (data?.introText) setIntroText(data.introText);
        else setIntroText(DEFAULT_INTRO_TEXT);

        if (data?.pageTitle) setPageTitle(data.pageTitle);
        else setPageTitle(pageTitleDynamic);
      } catch (err) {
        console.error('Banner fetch failed:', category, err);
        setBanner(null);
      }
    };

    fetchBanner();
  }, [searchParams, pageTitleDynamic]);

  /* ================= AUTO-SCROLL ================= */
  useEffect(() => {
    if (!banner?.images || banner.images.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === banner.images.length - 1 ? 0 : prevIndex + 1
      );
    }, 4000);

    return () => clearInterval(interval);
  }, [banner?.images]);

  // ✅ LATEST CREATED FIRST SORTING
  const sortedApartments = useMemo(() => {
    return [...filteredApartments].sort((a, b) => {
      const dateA = a?.timestampCreate?.seconds || 0;
      const dateB = b?.timestampCreate?.seconds || 0;
      return dateB - dateA; // 🔥 Latest first
    });
  }, [filteredApartments]);

  /* ================= PAGINATION ================= */
  const handlePageChange = useCallback((newPage) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", newPage.toString());
    router.push(`${BASE_ROUTE}?${params.toString()}`, { scroll: false });
  }, [searchParams, router]);

  const totalPages = useMemo(
    () => Math.ceil(filteredApartments.length / apartmentsPerPage),
    [filteredApartments.length]
  );

  const currentPage = Number(searchParams.get("page")) || 1;
  const startIndex = (currentPage - 1) * apartmentsPerPage;
  const currentApartments = sortedApartments.slice(
    startIndex,
    startIndex + apartmentsPerPage
  );

  const displayTitle = banner?.pageTitle || pageTitleDynamic;
  const totalImages = banner?.images?.length || 0;

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
                {displayTitle}
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

      {/* ✅ FIXED BANNER - CLICK WORKS EVERYWHERE */}
      <section className="bg-white">
        <div className="max-w-[1440px] mx-auto px-4 ">
          <h2 className="text-center text-xl sm:text-2xl font-bold">
            Trending <span className="text-[#F5A300]">Projects</span>
          </h2>

          <div className="
                   relative w-full 
            h-[120px] 
            sm:h-[180px] 
            md:h-[210px] 
            lg:h-[280px] 
            xl:h-[360px] 
            rounded-2xl 
            overflow-hidden 
           bg-transparent
             ">
            {banner?.images && totalImages > 0 ? (
              <>
                {/* Images Layer */}
                <div className="absolute inset-0 w-full h-full pointer-events-none">
                  {banner.images.map((imageUrl, index) => (
                    <div
                      key={`${imageUrl}-${index}`}
                      className="absolute inset-0 w-full h-full flex items-center justify-center"
                      style={{
                        opacity: currentImageIndex === index ? 1 : 0,
                        transition: "opacity 1000ms ease-in-out"
                      }}
                    >
                      <Image
                        src={imageUrl}
                        alt={`Trending Project ${index + 1}`}
                        fill
                        sizes="120vw"
                        className="
                                             object-contain 
                                             object-center 
                                             w-full 
                                             h-full
                                         "
                        priority={index === 0}
                      />
                    </div>
                  ))}
                </div>

                {/* Click Overlay */}
                <div
                  className="absolute inset-0 w-full h-full z-20 bg-transparent  transition-all duration-300 cursor-pointer rounded-2xl"
                  onClick={handleBannerImageClick}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      handleBannerImageClick();
                    }
                  }}
                  title={`Click to visit project (Image ${currentImageIndex + 1})`}
                />

                {/* Dots */}
                {/* <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2 z-30 backdrop-blur-md bg-black/40 rounded-full px-3 py-1.5">
                             {banner.images.map((_, index) => (
                                 <button
                                     key={index}
                                     onClick={() => setCurrentImageIndex(index)}
                                     className={`w-3 h-3 rounded-full transition-all duration-300 ${
                                         currentImageIndex === index
                                             ? "bg-[#F5A300] scale-125"
                                             : "bg-white/80 hover:bg-white"
                                     }`}
                                     aria-label={`Go to slide ${index + 1}`}
                                 />
                             ))}
                         </div> */}
              </>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <Image
                  src={banner?.image || "/default-banner.jpg"}
                  alt="Trending Banner"
                  fill
                  sizes="100vw"
                  className="object-contain object-center w-full h-full"
                  priority
                />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* HERO + SEARCH */}
      <section className="lg:bg-[#F6FBFF] pt-4 relative">
        {/* Mobile Hero Text */}
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

          {/* Mobile Search */}
          <div className="lg:hidden mt-8 mb-12">
            <div className="bg-white shadow-2xl p-3 w-full flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center md:gap-2 md:p-4 rounded-2xl max-w-full">
              <input
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleFilterChange("q", keyword || null);
                  }
                }}
                placeholder="Enter Keyword"
                className="w-full px-3 py-2.5 rounded-full bg-gray-50 outline-none text-sm flex-1 min-w-0"
              />
              <select
                value={type}
                onChange={(e) => handleFilterChange('type', e.target.value)}
                className="w-full px-3 py-2.5 rounded-full bg-gray-50 text-sm md:w-28 flex-shrink-0"
              >
                <option value="" disabled hidden>Type</option>
                <option value="retail-shops">Retail Shops</option>
                <option value="sco-plots">SCO Plots</option>
              </select>
              <select
                value={status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="w-full px-3 py-2.5 rounded-full bg-gray-50 text-sm md:w-28 flex-shrink-0"
              >
                <option value="" disabled hidden>Status</option>
                <option value="new-launch">New Launch</option>
                <option value="ready-to-move">Ready to Move</option>
                <option value="under-construction">Under Construction</option>
                <option value="pre-launch">Pre Launch</option>
              </select>
              <select
                value={locality}
                onChange={(e) => handleFilterChange('locality', e.target.value)}
                className="w-full px-3 py-2.5 rounded-full bg-gray-50 text-sm md:w-28 flex-shrink-0"
              >
                <option value="" disabled hidden>Localities</option>
                <option value="dwarka-expressway">Dwarka Expressway</option>
                <option value="golf-course-road">Golf Course Road</option>
                <option value="golf-course-extension-road">Golf Course Extension Road</option>
                <option value="sohna-road">Sohna Road</option>
                <option value="new-gurgaon">New Gurgaon</option>
                <option value="old-gurgaon">Old Gurgaon</option>
                <option value="spr">SPR</option>
                <option value="nh8">NH8</option>
              </select>
              <select
                value={budget}
                onChange={(e) => handleFilterChange('budget', e.target.value)}
                className="w-full px-3 py-2.5 rounded-full bg-gray-50 text-sm md:w-28 flex-shrink-0"
              >
                <option value="" disabled hidden>Budget</option>
                <option value="1-2-cr">1 – 2 Cr</option>
                <option value="2-3-cr">2 – 3 Cr</option>
                <option value="3-4-cr">3 – 4 Cr</option>
                <option value="4-5-cr">4 – 5 Cr</option>
                <option value="5-6-cr">5 – 6 Cr</option>
                <option value="6-7-cr">6 – 7 Cr</option>
                <option value="7-8-cr">7 – 8 Cr</option>
                <option value="above-8-cr">Above 8 Cr</option>
              </select>
              <select
                value={bhk}
                onChange={(e) => handleFilterChange('bhk', e.target.value)}
                className="w-full px-3 py-2.5 rounded-full bg-gray-50 text-sm md:w-28 flex-shrink-0"
              >
                <option value="" disabled hidden>Size</option>
                <option value="above-5-bhk">Large Spaces</option>
              </select>
              {isFilterApplied ? (
                <button
                  onClick={handleClearFilters}
                  className="w-full px-4 py-2.5 rounded-full bg-gray-200 text-gray-700 font-medium text-sm md:w-24 flex-shrink-0"
                >
                  Clear
                </button>
              ) : (
                <button
                  onClick={() => handleFilterChange('q', keyword || null)}
                  className="w-full px-4 py-2.5 rounded-full bg-[#F5A300] text-white font-medium text-sm md:w-24 flex-shrink-0"
                >
                  Search
                </button>
              )}

            </div>
          </div>

          {/* Desktop Search */}
          <div className="hidden lg:block absolute bottom-[100px] left-0 right-0 mx-auto w-full max-w-[950px] z-20 px-4">

            <div className="bg-white shadow-2xl px-4 py-3 flex flex-wrap lg:flex-nowrap items-center justify-center gap-2 rounded-3xl border border-yellow-400">

              <input
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleFilterChange("q", keyword || null);
                  }
                }}

                placeholder="Enter Keyword"
                className="flex-1 px-5 py-3 rounded-full bg-gray-50 outline-none text-sm min-w-0"
              />

              <div className="relative flex-1 min-w-[110px]">

                <select
                  value={type}
                  onChange={(e) => handleFilterChange('type', e.target.value)}
                  className="w-full px-3 py-3 rounded-full bg-gray-50 text-sm appearance-none pr-6"
                >
                  <option value="" disabled hidden>Type</option>
                  <option value="retail-shops">Retail Shops</option>
                  <option value="sco-plots">SCO Plots</option>
                </select>
                <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">▾</span>
              </div>

              <div className="relative flex-1 min-w-[110px]">
                <select
                  value={status}
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                  className="w-full px-3 py-3 rounded-full bg-gray-50 text-sm appearance-none pr-6"
                >
                  <option value="" disabled hidden>Status</option>
                  <option value="new-launch">New Launch</option>
                  <option value="ready-to-move">Ready to Move</option>
                  <option value="under-construction">Under Construction</option>
                  <option value="pre-launch">Pre Launch</option>
                </select>
                <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">▾</span>
              </div>

              <div className="relative flex-1 min-w-[110px]">
                <select
                  value={locality}
                  onChange={(e) => handleFilterChange('locality', e.target.value)}
                  className="w-full px-3 py-3 rounded-full bg-gray-50 text-sm appearance-none pr-6"
                >
                  <option value="" disabled hidden>Localities</option>
                  <option value="dwarka-expressway">Dwarka Expressway</option>
                  <option value="golf-course-road">Golf Course Road</option>
                  <option value="golf-course-extension-road">Golf Course Extension Road</option>
                  <option value="sohna-road">Sohna Road</option>
                  <option value="new-gurgaon">New Gurgaon</option>
                  <option value="old-gurgaon">Old Gurgaon</option>
                  <option value="spr">SPR</option>
                  <option value="nh8">NH8</option>
                </select>
                <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">▾</span>
              </div>

              <div className="relative flex-1 min-w-[110px]">

                <select
                  value={budget}
                  onChange={(e) => handleFilterChange('budget', e.target.value)}
                  className="w-full px-3 py-3 rounded-full bg-gray-50 text-sm appearance-none pr-6"
                >
                  <option value="" disabled hidden>Budget</option>
                  <option value="1-2-cr">1 – 2 Cr</option>
                  <option value="2-3-cr">2 – 3 Cr</option>
                  <option value="3-4-cr">3 – 4 Cr</option>
                  <option value="4-5-cr">4 – 5 Cr</option>
                  <option value="5-6-cr">5 – 6 Cr</option>
                  <option value="6-7-cr">6 – 7 Cr</option>
                  <option value="7-8-cr">7 – 8 Cr</option>
                  <option value="above-8-cr">Above 8 Cr</option>
                </select>
                <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">▾</span>
              </div>

              <div className="relative flex-1 min-w-[110px]">
                <select
                  value={bhk}
                  onChange={(e) => handleFilterChange('bhk', e.target.value)}
                  className="w-full px-3 py-3 rounded-full bg-gray-50 text-sm appearance-none pr-6"
                >
                  <option value="" disabled hidden>Size</option>
                  <option value="above-5-bhk">Large Spaces</option>
                </select>
                <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">▾</span>
              </div>
              {isFilterApplied ? (
                <button
                  onClick={handleClearFilters}
                  className="w-24 px-4 py-3 rounded-full bg-gray-200 text-gray-700 font-medium text-sm flex-shrink-0 hover:bg-gray-300 transition"
                >
                  Clear
                </button>
              ) : (
                <button
                  onClick={() => handleFilterChange('q', keyword || null)}
                  className="w-24 px-4 py-3 rounded-full bg-[#F5A300] text-white font-medium text-sm flex-shrink-0"
                >
                  Search
                </button>
              )}

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
                builder: item.developer,
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
