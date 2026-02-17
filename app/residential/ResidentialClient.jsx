"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useCallback, useMemo, useRef } from "react";
import Image from "next/image";
import Header from "../components/Header";
import { getBanner } from "@/lib/firestore/banners/read";
import Footer from "../components/Footer";
import PropertyCard from "../components/property/PropertyCard";
import Pagination from "../components/property/Pagination";

// ✅ EXPANDABLE TEXT (UNCHANGED)
const ExpandableText = ({ children: html, maxLines = 2, className = "" }) => {
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
    }, [html, maxLines]);

    return (
        <div className={`space-y-1 ${className}`}>
            <div
                ref={textRef}
                className="leading-relaxed [&>p]:mb-2 [&>h1]:text-lg [&>h1]:font-semibold [&>h1]:mt-2 [&>h1]:mb-2"
                style={{
                    display: "-webkit-box",
                    WebkitLineClamp: isExpanded ? "unset" : maxLines,
                    WebkitBoxOrient: "vertical",
                    overflow: isExpanded ? "visible" : "hidden",
                }}
                dangerouslySetInnerHTML={{ __html: html }}
            />

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


// ✅ FILTER FUNCTIONS (UNCHANGED)
const PROPERTY_TYPE_MAP = {
    apartment: "isApartment",
    "builder-floor": "isBuilderFloor",
    villa: "isVilla",
    plot: "isPlot",
};

const STATUS_FLAG_MAP = {
    "ready-to-move": "isReadyToMove",
    "under-construction": "isUnderConstruction",
    "pre-launch": "isPreLaunch",
    "new-launch": "isNewLaunch",
};

const filterByPropertyType = (list = [], type) => {
    const field = PROPERTY_TYPE_MAP[type];
    if (!field) return list;
    return list.filter((item) => item[field] === true);
};

const filterByStatus = (list = [], status) => {
    const field = STATUS_FLAG_MAP[status];
    if (!field) return list;
    return list.filter((item) => item[field] === true);
};

// ✅ PRO FILTER ENGINE (NEW)
const applyAllFilters = ({
    apartments = [],
    keyword = "",
    type = "",
    status = "",
    locality = "",
    budget = "",
    bhk = ""
}) => {
    let filtered = apartments.filter(
        (item) => item.propertyType === "residential"
    );

    // 💰 Convert price string like "2.5 Cr" or "1.8 - 2.2 Cr" to numeric value in Crores
    const extractPriceRange = (priceRange = "") => {
        if (!priceRange) return null;

        const cleaned = priceRange
            .toLowerCase()
            .replace(/₹/g, "")
            .replace(/cr|crore/g, "")
            .replace(/onwards/g, "")
            .replace(/\+/g, "")
            .replace(/\*/g, "")
            .replace(/,/g, "")
            .trim();

        if (!/\d/.test(cleaned)) return null;

        if (cleaned.includes("-")) {
            const [min, max] = cleaned.split("-").map((v) => parseFloat(v.trim()));
            return {
                min: min || 0,
                max: max || min || 0,
            };
        }

        const value = parseFloat(cleaned);
        return { min: value, max: value };
    };




    // 🔎 KEYWORD SEARCH
    if (keyword) {
        const lower = keyword.toLowerCase();
        filtered = filtered.filter((item) =>
            item.title?.toLowerCase().includes(lower) ||
            item.location?.toLowerCase().includes(lower) ||
            item.sector?.toLowerCase().includes(lower) ||
            item.developer?.toLowerCase().includes(lower)
        );
    }

    // 🏢 TYPE FILTER
    if (type && PROPERTY_TYPE_MAP[type]) {
        filtered = filtered.filter(
            (item) => item[PROPERTY_TYPE_MAP[type]] === true
        );
    }

    // 🚧 STATUS FILTER
    if (status && STATUS_FLAG_MAP[status]) {
        filtered = filtered.filter(
            (item) => item[STATUS_FLAG_MAP[status]] === true
        );
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
            const range = extractPriceRange(item.priceRange);
            if (!range) return false;

            const { min: propertyMin, max: propertyMax } = range;

            if (budget === "above-8-cr") {
                return propertyMax >= 8;
            }

            const [min, max] = budget
                .replace("-cr", "")
                .split("-")
                .map(Number);

            return propertyMax >= min && propertyMin <= max;
        });
    }




    // 🛏️ BHK
    if (bhk) {
        filtered = filtered.filter((item) => {
            if (!item.configurations) return false;

            // Handle "above-5-bhk"
            if (bhk === "above-5-bhk") {
                return item.configurations.some((config) => {
                    const match = config.match(/\d+(\.\d+)?/);
                    if (!match) return false;
                    const bhkValue = parseFloat(match[0]);
                    return bhkValue > 5;
                });
            }

            // Normal BHK (1,2,3,4 etc)
            const selectedBhk = parseFloat(bhk);

            return item.configurations.some((config) => {
                const match = config.match(/\d+(\.\d+)?/);
                if (!match) return false;
                const bhkValue = parseFloat(match[0]);
                return bhkValue === selectedBhk;
            });
        });
    }


    return filtered;
};

export default function ResidentialPage({ apartments = [] }) {

    const BASE_ROUTE = "/residential";
    const router = useRouter();
    const searchParams = useSearchParams();

    // ✅ STATES
    const [banner, setBanner] = useState(null);
    const [introText, setIntroText] = useState("");
    const [pageTitleDynamic, setPageTitleDynamic] = useState("Residential Apartments Property for Sale in Gurgaon");
    const [pageTitle, setPageTitle] = useState("Residential Apartments Property for Sale in Gurgaon");
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [keyword, setKeyword] = useState("");
    const [type, setType] = useState("");
    const [status, setStatus] = useState("");
    const [locality, setLocality] = useState("");
    const [budget, setBudget] = useState("");
    const [bhk, setBhk] = useState("");
    const [page, setPage] = useState(1);
    const [filteredApartments, setFilteredApartments] = useState([]);
    const [loading, setLoading] = useState(false);
    const isFilterApplied =
        searchParams.get("type") ||
        searchParams.get("status") ||
        searchParams.get("locality") ||
        searchParams.get("budget") ||
        searchParams.get("bhk") ||
        searchParams.get("q");


    const apartmentsPerPage = 12;

    // ✅ UTILITY FUNCTIONS
    const filterForResidential = (list = []) => {
        return list.filter((item) => {
            if (!item.propertyType) return true;
            return item.propertyType === "residential";
        });
    };

    const getBhkDisplayName = (bhkValue) => {
        const bhkMap = {
            "1-bhk": "1 BHK", "1.5-bhk": "1.5 BHK", "2-bhk": "2 BHK", "2.5-bhk": "2.5 BHK",
            "3-bhk": "3 BHK", "3.5-bhk": "3.5 BHK", "4-bhk": "4 BHK", "4.5-bhk": "4.5 BHK",
            "5-bhk": "5 BHK", "above-5-bhk": "5+ BHK"
        };
        return bhkMap[bhkValue] || "All Properties";
    };

    const formatFilterName = (value) =>
        value?.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()) || "";

    // ✅ FIXED: Matches YOUR exact Firebase structure {imageUrl: linkUrl}
    const getCurrentImageLink = useCallback((index) => {
        if (!banner?.images?.[index] || !banner?.imageLinks) {
            console.log("❌ No image or imageLinks at index:", index);
            return null;
        }

        const currentImageUrl = banner.images[index];
        const link = banner.imageLinks[currentImageUrl];

        console.log(`🔍 Image ${index}:`, currentImageUrl);
        console.log(`🔗 Link found:`, link);

        return link || null;
    }, [banner?.images, banner?.imageLinks]);

    const handleBannerImageClick = useCallback(() => {
        const link = getCurrentImageLink(currentImageIndex);
        console.log("🔗 Banner click - Image index:", currentImageIndex, "Link:", link);

        if (link) {
            window.open(link, '_blank', 'noopener,noreferrer');
        } else {
            console.warn("⚠️ No link found for image at index:", currentImageIndex);
        }
    }, [currentImageIndex, getCurrentImageLink]);

    // ✅ FILTER HANDLER
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


    // ✅ URL FILTER LOGIC
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
        setPage(urlPage);

        let title = "Residential Apartments Property for Sale in Gurgaon";
        if (urlBhk) {
            title = `${getBhkDisplayName(urlBhk)} Properties for Sale in Gurgaon`;
        } else if (urlType) {
            title = `${formatFilterName(urlType)} Properties for Sale in Gurgaon`;
        } else if (urlStatus) {
            title = `${formatFilterName(urlStatus)} Projects in Gurgaon`;
        } else if (urlLocality) {
            title = `${formatFilterName(urlLocality)} Properties in Gurgaon`;
        } else if (urlBudget) {
            title = `${urlBudget.replace(/-/g, " to ")} Properties in Gurgaon`;
        }
        setPageTitleDynamic(title);

        const filtered = applyAllFilters({
            apartments,
            keyword: urlKeyword,
            type: urlType,
            status: urlStatus,
            locality: urlLocality,
            budget: urlBudget,
            bhk: urlBhk
        });

        /* 🔥 SORT BY LATEST FIRST (SAME AS ADMIN) */
        const sorted = [...filtered].sort(
            (a, b) =>
                (b.timestampCreate || 0) -
                (a.timestampCreate || 0)
        );

        setFilteredApartments(sorted);

    }, [searchParams, apartments]);

    // ✅ BANNER FETCH
    useEffect(() => {
        let category = "residential";
        const urlType = searchParams.get("type");

        if (urlType === "apartment") category = "apartment";
        else if (urlType === "builder-floor") category = "builder-floor";
        else if (urlType === "villa") category = "villa";
        else if (urlType === "plot") category = "plot";

        const fetchBanner = async () => {
            try {
                const data = await getBanner(category);
                console.log("📸 Banner data:", data);
                console.log("🔗 imageLinks:", data?.imageLinks);
                console.log("🖼️ images:", data?.images);
                setBanner(data);

                if (data?.introText) setIntroText(data.introText);
                if (data?.pageTitle) setPageTitle(data.pageTitle);
                else setPageTitle(pageTitleDynamic);
            } catch (err) {
                console.error('Banner fetch failed:', err);
            }
        };

        fetchBanner();
    }, [searchParams, pageTitleDynamic]);

    // ✅ AUTO-SCROLL
    useEffect(() => {
        if (!banner?.images || banner.images.length <= 1) return;

        const interval = setInterval(() => {
            setCurrentImageIndex((prevIndex) =>
                prevIndex === banner.images.length - 1 ? 0 : prevIndex + 1
            );
        }, 4000);

        return () => clearInterval(interval);
    }, [banner?.images]);

    // ✅ PAGINATION
    const handlePageChange = useCallback((newPage) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("page", newPage.toString());
        router.push(`${BASE_ROUTE}?${params.toString()}`, { scroll: false });
    }, [searchParams, router]);

    const totalPages = useMemo(
        () => Math.ceil(filteredApartments.length / apartmentsPerPage),
        [filteredApartments.length]
    );

    const startIndex = (page - 1) * apartmentsPerPage;
    const currentPage = page;

    const currentApartments = filteredApartments.slice(startIndex, startIndex + apartmentsPerPage);

    const displayTitle = banner?.pageTitle || pageTitleDynamic;
    const totalImages = banner?.images?.length || 0;

    return (
        <>
            <Header />

            {/* PAGE INTRO */}
            <section className="bg-[#F6FBFF]">
                <div className="max-w-[1240px] mx-auto px-4 py-6">

                    {/* Top Row: Title + Results */}
                    <div className="flex items-start justify-between gap-4">
                        <h1 className="text-xl sm:text-2xl md:text-[26px] font-semibold text-gray-900">
                            {displayTitle}
                        </h1>

                        <div className="text-sm text-gray-500 whitespace-nowrap pt-1">
                            {filteredApartments.length} results
                        </div>
                    </div>

                    {/* Expandable Text Below */}
                    <ExpandableText
                        maxLines={2}
                        className="mt-3 text-sm sm:text-[15px] text-gray-600"
                    >
                        {introText || "Loading..."}
                    </ExpandableText>

                </div>
            </section>


            {/* ✅ FIXED BANNER - EXACT REFERENCE SIZING */}

            <section className="bg-white">
                <div className="max-w-[1440px] mx-auto px-4 ">
                    <h2 className="text-center text-3xl sm:text-2xl font-bold ">
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
                                <Image src="/images/residental.jpg" alt="Residential Property collage" fill className="object-cover" priority />
                            </div>
                        </div>
                    </div>

                    {/* Mobile Search */}
                    <div className="lg:hidden mt-8 mb-12">
                        <div className="bg-white shadow-2xl p-3 w-full flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center md:gap-2 md:p-4 rounded-2xl max-w-full">
                            <input value={keyword} onChange={(e) => setKeyword(e.target.value)} onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    handleFilterChange("q", keyword || null);
                                }
                            }} placeholder="Enter Keyword" className="w-full px-3 py-2.5 rounded-full bg-gray-50 outline-none text-sm flex-1 min-w-0" />
                            <select value={type} onChange={(e) => handleFilterChange('type', e.target.value)} className="w-full px-3 py-2.5 rounded-full bg-gray-50 text-sm md:w-28 flex-shrink-0">
                                <option value="" disabled hidden>Type</option><option value="apartment">Apartments</option><option value="builder-floor">Builder Floor</option>
                            </select>
                            <select value={status} onChange={(e) => handleFilterChange('status', e.target.value)} className="w-full px-3 py-2.5 rounded-full bg-gray-50 text-sm md:w-28 flex-shrink-0">
                                <option value="" disabled hidden>Status</option><option value="new-launch">New Launch</option><option value="ready-to-move">Ready to Move</option><option value="under-construction">Under Construction</option><option value="pre-launch">Pre Launch</option>
                            </select>
                            <select value={locality} onChange={(e) => handleFilterChange('locality', e.target.value)} className="w-full px-3 py-2.5 rounded-full bg-gray-50 text-sm md:w-28 flex-shrink-0">
                                <option value="" disabled hidden>Localities</option><option value="dwarka-expressway">Dwarka Expressway</option><option value="golf-course-road">Golf Course Road</option><option value="golf-course-extension-road">Golf Course Extension Road</option><option value="sohna-road">Sohna Road</option><option value="new-gurgaon">New Gurgaon</option><option value="old-gurgaon">Old Gurgaon</option><option value="spr">SPR</option><option value="nh8">NH8</option>
                            </select>
                            <select value={budget} onChange={(e) => handleFilterChange('budget', e.target.value)} className="w-full px-3 py-2.5 rounded-full bg-gray-50 text-sm md:w-28 flex-shrink-0">
                                <option value="" disabled hidden>Budget</option><option value="1-2-cr">1 – 2 Cr</option><option value="2-3-cr">2 – 3 Cr</option><option value="3-4-cr">3 – 4 Cr</option><option value="4-5-cr">4 – 5 Cr</option><option value="5-6-cr">5 – 6 Cr</option><option value="6-7-cr">6 – 7 Cr</option><option value="7-8-cr">7 – 8 Cr</option><option value="above-8-cr">Above 8 Cr</option>
                            </select>
                            <select value={bhk} onChange={(e) => handleFilterChange('bhk', e.target.value)} className="w-full px-3 py-2.5 rounded-full bg-gray-50 text-sm md:w-28 flex-shrink-0">
                                <option value="" disabled hidden>BHK</option><option value="1-bhk">1 BHK</option><option value="1.5-bhk">1.5 BHK</option><option value="2-bhk">2 BHK</option><option value="2.5-bhk">2.5 BHK</option><option value="3-bhk">3 BHK</option><option value="3.5-bhk">3.5 BHK</option><option value="4-bhk">4 BHK</option><option value="4.5-bhk">4.5 BHK</option><option value="5-bhk">5 BHK</option><option value="above-5-bhk">Above 5 BHK</option>
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

                            {/* TYPE */}
                            <div className="relative flex-1 min-w-[110px]">
                                <select
                                    value={type}
                                    onChange={(e) => handleFilterChange('type', e.target.value)}
                                    className="w-full px-3 py-3 rounded-full bg-gray-50 text-sm appearance-none pr-6"
                                >
                                    <option value="" disabled hidden>Type</option>
                                    <option value="apartment">Luxury Apartments</option>
                                    <option value="builder-floor">Builder Floor</option>
                                </select>
                                <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">▾</span>
                            </div>

                            {/* STATUS */}
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

                            {/* LOCALITY */}
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

                            {/* BUDGET */}
                            <div className="relative flex-1 min-w-[110px]">
                                <select
                                    value={budget || ""}
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

                            {/* BHK */}
                            <div className="relative flex-1 min-w-[110px]">
                                <select
                                    value={bhk}
                                    onChange={(e) => handleFilterChange('bhk', e.target.value)}
                                    className="w-full px-3 py-3 rounded-full bg-gray-50 text-sm appearance-none pr-6"
                                >
                                    <option value="" disabled hidden>BHK</option>
                                    <option value="1-bhk">1 BHK</option>
                                    <option value="1.5-bhk">1.5 BHK</option>
                                    <option value="2-bhk">2 BHK</option>
                                    <option value="2.5-bhk">2.5 BHK</option>
                                    <option value="3-bhk">3 BHK</option>
                                    <option value="3.5-bhk">3.5 BHK</option>
                                    <option value="4-bhk">4 BHK</option>
                                    <option value="4.5-bhk">4.5 BHK</option>
                                    <option value="5-bhk">5 BHK</option>
                                    <option value="above-5-bhk">Above 5 BHK</option>
                                </select>
                                <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">▾</span>
                            </div>

                            {isFilterApplied ? (
                                <button
                                    onClick={handleClearFilters}
                                    className="w-24 px-4 py-3 rounded-full bg-gray-200 text-gray-700 font-medium text-sm hover:bg-gray-300 transition"
                                >
                                    Clear
                                </button>
                            ) : (
                                <button
                                    onClick={() => handleFilterChange('q', keyword || null)}
                                    className="w-24 px-4 py-3 rounded-full bg-[#F5A300] text-white font-medium text-sm"
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
                            baseRoute="residential"
                            property={{
                                title: item.title,
                                builder: item.developer,
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
                <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
            </main>

            <Footer />
        </>
    );
}
