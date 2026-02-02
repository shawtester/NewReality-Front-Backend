"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useCallback, useMemo, useRef } from "react";
import Image from "next/image";
import Header from "../components/Header";
import Footer from "../components/Footer";
import PropertyCard from "../components/property/PropertyCard";
import Pagination from "../components/property/Pagination";

// ✅ FIXED EXPANDABLE TEXT COMPONENT
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

    const toggleExpanded = () => {
        setIsExpanded(!isExpanded);
    };

    return (
        <div className={`space-y-1 ${className}`}>
            <div
                ref={textRef}
                className={`
                    transition-all duration-300 ease-in-out
                    ${isExpanded ? 'max-h-none overflow-visible' : `max-h-[${maxLines * 1.4}em] overflow-hidden`}
                    leading-relaxed
                `}
                style={{
                    display: '-webkit-box',
                    WebkitLineClamp: isExpanded ? 'unset' : maxLines,
                    WebkitBoxOrient: 'vertical',
                }}
            >
                {text}
            </div>
            
            {isOverflowing && (
                <button
                    onClick={toggleExpanded}
                    className="text-sm text-[#F5A300] font-medium hover:text-yellow-600 transition-all duration-200 flex items-center gap-1 pt-1 cursor-pointer"
                >
                    {isExpanded ? (
                        <>
                            Read Less 
                            <span className="w-3 h-3 border-b-2 border-r-2 rotate-225 -translate-y-[1px] transition-transform duration-200" />
                        </>
                    ) : (
                        <>
                            Read More 
                            <span className="w-3 h-3 border-b-2 border-r-2 rotate-45 translate-y-[1px] transition-transform duration-200" />
                        </>
                    )}
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

const filterForCommercial = (list = []) => {
    return list.filter((item) => {
        if (!item.propertyType) return true;
        return item.propertyType === "commercial";
    });
};

const filterCommercialByType = (list = [], type) => {
    const field = COMMERCIAL_TYPE_MAP[type];
    if (!field) return filterForCommercial(list);
    return list.filter(
        (item) =>
            (!item.propertyType || item.propertyType === "commercial") &&
            item[field] === true
    );
};

/* ================= PAGE COMPONENT ================= */
export default function CommercialPage({ apartments = [] }) {
    const BASE_ROUTE = "/commercial";
    const router = useRouter();
    const searchParams = useSearchParams();

    /* ================= STATES ================= */
    const [keyword, setKeyword] = useState("");
    const [type, setType] = useState("");
    const [status, setStatus] = useState("");
    const [locality, setLocality] = useState("");
    const [budget, setBudget] = useState("");
    const [bhk, setBhk] = useState("");
    const [page, setPage] = useState(1);
    const [filteredApartments, setFilteredApartments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [pageTitle, setPageTitle] = useState("Commercial Properties for Sale in Gurgaon");

    const apartmentsPerPage = 12;

    /* ================= UTILS ================= */
    const formatFilterName = (value) =>
        value?.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()) || "";

    /* ================= YOUR EXISTING LOGIC - UNCHANGED ================= */
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
        setPageTitle(title);

        const hasFilters = urlKeyword || urlType || urlStatus || urlLocality || urlBudget;

        if (urlType) {
            setFilteredApartments(filterCommercialByType(apartments, urlType));
            return;
        }

        if (hasFilters) {
            handleSearch();
        } else {
            setFilteredApartments(filterForCommercial(apartments));
        }
    }, [searchParams, apartments]);

    const handleSearch = useCallback(async () => {
        // YOUR EXISTING SEARCH LOGIC - UNCHANGED
        try {
            setLoading(true);
            const params = new URLSearchParams({
                q: keyword || undefined,
                type: type || undefined,
                status: status || undefined,
                locality: locality || undefined,
                budget: budget || undefined,
            });

            for (const [k, v] of params) {
                if (!v) params.delete(k);
            }

            const res = await fetch(`/api/search?${params.toString()}`);
            const data = await res.json();
            const safeData = Array.isArray(data) ? data : [];
            const commercialOnly = filterCommercialByType(safeData, type);

            if (commercialOnly.length === 0) {
                setFilteredApartments(filterForCommercial(apartments));
            } else {
                setFilteredApartments(commercialOnly);
            }
            setPage(1);
        } catch (err) {
            console.error("Search error ❌");
            setFilteredApartments(filterForCommercial(apartments));
        } finally {
            setLoading(false);
        }
    }, [keyword, type, status, locality, budget, apartments]);

    const handleFilterChange = useCallback((filterName, value) => {
        const params = new URLSearchParams(searchParams.toString());
        if (value) params.set(filterName, value);
        else params.delete(filterName);
        params.set("page", "1");
        router.push(`${BASE_ROUTE}?${params.toString()}`, { scroll: false });
    }, [searchParams, router]);

    const clearFilters = () => {
        router.push(BASE_ROUTE, { scroll: false });
    };

    const handlePageChange = useCallback((newPage) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("page", newPage.toString());
        router.push(`${BASE_ROUTE}?${params.toString()}`, { scroll: false });
    }, [searchParams, router]);

    /* ================= EXACT SAME PAGINATION ================= */
    const totalPages = useMemo(() => {
        return Math.ceil(filteredApartments.length / apartmentsPerPage);
    }, [filteredApartments.length]);

    const currentPage = Number(searchParams.get("page")) || page;
    const startIndex = (currentPage - 1) * apartmentsPerPage;
    const endIndex = startIndex + apartmentsPerPage;
    const currentApartments = filteredApartments.slice(startIndex, endIndex);

    /* ================= ✅ UPDATED LAYOUT WITH EXPANDABLE TEXT ================= */
    return (
        <>
            <Header />

            {/* ================= 1. PAGE INTRO ================= */}
            <section className="bg-[#F6FBFF]">
                <div className="max-w-[1240px] mx-auto px-4 py-6">
                    <div className="text-sm text-gray-500 mb-3">Commercial</div>
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                        <div className="max-w-4xl">
                            <h1 className="text-xl sm:text-2xl md:text-[26px] font-semibold text-gray-900">
                                {pageTitle}
                            </h1>
                            {/* ✅ EXPANDABLE TEXT - REPLACED p TAG */}
                            <ExpandableText 
                                maxLines={2}
                                className="mt-2 text-sm sm:text-[15px] text-gray-600"
                            >
                                Strategic commercial properties in prime Gurgaon locations with excellent ROI potential. 
                                Explore high-demand retail shops and SCO plots along Dwarka Expressway, Golf Course Road, 
                                and NH-8. Perfect investment opportunities in Gurgaon's thriving commercial real estate market.
                            </ExpandableText>
                        </div>
                        <div className="text-sm text-gray-500">
                            {filteredApartments.length} results
                        </div>
                    </div>
                </div>
            </section>

            {/* ================= 2. TRENDING BANNER ================= */}
            <section className="bg-white py-6 sm:py-10 md:py-5">
                <div className="max-w-[1440px] mx-auto px-4 sm:px-6">
                    <h2 className="text-center text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-4 sm:mb-6 md:mb-4 lg:mb-4">
                        Trending <span className="text-[#F5A300]">Projects</span>
                    </h2>
                    <div className="w-full h-24 md:h-38 md:w-[90%] md:mx-auto md:text-center md:text-2xl md:bg-blue-100 md:rounded-lg bg-blue-100 rounded-lg flex items-center justify-center text-lg">
                        Banner
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
                        <div className="flex-1 flex justify-center self-end relative z-10">
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
                        <div className="bg-white relative left-20 shadow-2xl px-5 py-3 flex items-center gap-3 rounded-full border border-yellow-400">
                            <input value={keyword} onChange={(e) => setKeyword(e.target.value)} placeholder="Enter Keyword" className="flex-1 px-5 py-3 rounded-full bg-gray-50 outline-none text-sm flex-shrink-0 min-w-0" />
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

            {/* ================= 4. LISTINGS ================= */}
            <main className="py-10 lg:pt-20">
                <div className="max-w-[1240px] mx-auto px-4 lg:px-12">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {currentApartments.map((item) => (
                            <PropertyCard key={item.id} property={{
                                title: item.title, developer: item.developer, location: item.location,
                                bhk: item.configurations?.join(", "), size: item.areaRange, price: item.priceRange,
                                img: item.mainImage?.url || "/placeholder.jpg", slug: item.slug || item.id,
                                isTrending: item.isTrending, isNewLaunch: item.isNewLaunch, isRera: p.isRera,
                            }} />
                        ))}
                    </div>
                </div>
                <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
            </main>

            <Footer />
        </>
    );
}