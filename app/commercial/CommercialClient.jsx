"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useCallback, useMemo } from "react";
import Image from "next/image";
import Header from "../components/Header";
import Footer from "../components/Footer";
import PropertyCard from "../components/property/PropertyCard";
import Pagination from "../components/property/Pagination";

/* ================= PROPERTY TYPE MAP ================= */
const COMMERCIAL_TYPE_MAP = {
    "retail-shops": "isRetail",
    "sco-plots": "isSCO",
};

/* ================= FILTER FUNCTIONS ================= */
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
    const [pageTitle, setPageTitle] = useState(
        "Commercial Properties for Sale in Gurgaon"
    );

    const apartmentsPerPage = 12;

    /* ================= UTILS ================= */
    const formatFilterName = (value) =>
        value?.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()) ||
        "";

    /* ================= URL SYNC ================= */
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

        /* ===== Dynamic Title ===== */
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

        const hasFilters =
            urlKeyword || urlType || urlStatus || urlLocality || urlBudget;

        if (urlType) {
            setFilteredApartments(
                filterCommercialByType(apartments, urlType)
            );
            return;
        }

        if (hasFilters) {
            handleSearch();
        } else {
            setFilteredApartments(filterForCommercial(apartments));
        }
    }, [searchParams, apartments]);

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

            for (const [k, v] of params) {
                if (!v) params.delete(k);
            }

            const res = await fetch(`/api/search?${params.toString()}`);
            const data = await res.json();

            const safeData = Array.isArray(data) ? data : [];

            const commercialOnly = filterCommercialByType(
                safeData,
                type
            );

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

    /* ================= FILTER CHANGE ================= */
    const handleFilterChange = useCallback(
        (filterName, value) => {
            const params = new URLSearchParams(searchParams.toString());

            if (value) params.set(filterName, value);
            else params.delete(filterName);

            params.set("page", "1");

            router.push(`${BASE_ROUTE}?${params.toString()}`, {
                scroll: false,
            });
        },
        [searchParams, router]
    );

    /* ================= CLEAR FILTERS ================= */
    const clearFilters = () => {
        router.push(BASE_ROUTE, { scroll: false });
    };

    /* ================= PAGINATION ================= */
    const totalPages = useMemo(() => {
        return Math.ceil(filteredApartments.length / apartmentsPerPage);
    }, [filteredApartments.length]);

    const currentPage = Number(searchParams.get("page")) || page;
    const startIndex = (currentPage - 1) * apartmentsPerPage;
    const endIndex = startIndex + apartmentsPerPage;

    const currentApartments = filteredApartments.slice(
        startIndex,
        endIndex
    );

    const handlePageChange = useCallback(
        (newPage) => {
            const params = new URLSearchParams(searchParams.toString());
            params.set("page", newPage.toString());

            router.push(`${BASE_ROUTE}?${params.toString()}`, {
                scroll: false,
            });
        },
        [searchParams, router]
    );

    return (
        <>
            <Header />

            {/* ================= PAGE INTRO ================= */}
            <section className="bg-[#F6FBFF]">
                {/* TRENDING BANNER */}
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

                {/* HERO SECTION */}
                <section className="lg:bg-[#F6FBFF] pt-4 relative">
                    <div className="max-w-[1240px] mx-auto px-4">
                        <div className="relative hidden lg:flex items-start gap-10">
                            <div className="flex-1 ml-10">
                                <h1 className="text-[42px] sm:text-[52px] font-extrabold text-gray-900 leading-tight">
                                    Your <span className="text-[#F5A300]">Property</span>, <br />
                                    Our Priority.
                                </h1>
                            </div>
                            <div className="flex-1 flex justify-center self-end">
                                <div className="relative w-[240px] h-[240px] sm:w-[310px] sm:h-[310px] md:w-[370px] md:h-[370px] lg:w-[450px] lg:h-[420px] rounded-[40px] lg:rounded-[60px] overflow-hidden shadow-xl">
                                    <Image
                                        src="/images/residental.jpg"
                                        alt="Property collage"
                                        fill
                                        className="object-cover"
                                        priority
                                    />
                                </div>
                            </div>
                        </div>

                        {/* MOBILE/TABLET SEARCH */}
                        <div className="lg:hidden mt-8 mb-12">
                            <div className="bg-white shadow-2xl p-3 w-full flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center md:gap-2 md:p-4 rounded-2xl max-w-full">
                                <input
                                    value={keyword}
                                    onChange={(e) => setKeyword(e.target.value)}
                                    placeholder="Enter Keyword"
                                    className="w-full px-3 py-2.5 rounded-full bg-gray-50 outline-none text-sm flex-1 min-w-0"
                                />
                                <select value={type} onChange={(e) => handleFilterChange('type', e.target.value)} className="w-full px-3 py-2.5 rounded-full bg-gray-50 text-sm md:w-28 flex-shrink-0">
                                    <option>Type</option>
                                    <option value="commercial">Commercial Property</option>
                                    <option value="retail-shops">Retail Shops</option>
                                    <option value="sco-plots">SCO Plots</option>
                                </select>
                                <select value={status} onChange={(e) => handleFilterChange('status', e.target.value)} className="w-full px-3 py-2.5 rounded-full bg-gray-50 text-sm md:w-28 flex-shrink-0">
                                    <option>Status</option>
                                    <option value="new-launch">New Launch Project</option>
                                    <option value="ready-to-move">Ready to Move Project</option>
                                    <option value="under-construction">Under Construction Project</option>
                                    <option value="pre-launch">Pre Launch Project</option>
                                </select>
                                <select value={locality} onChange={(e) => handleFilterChange('locality', e.target.value)} className="w-full px-3 py-2.5 rounded-full bg-gray-50 text-sm md:w-28 flex-shrink-0">
                                    <option>Localities</option>
                                    <option value="dwarka-expressway">Dwarka Expressway</option>
                                    <option value="golf-course-road">Golf Course Road</option>
                                    <option value="golf-course-extension-road">Golf Course Extension Road</option>
                                    <option value="sohna-road">Sohna Road</option>
                                    <option value="new-gurgaon">New Gurgaon</option>
                                </select>
                                <button onClick={handleSearch} disabled={loading} className="w-full px-4 py-2.5 rounded-full bg-[#F5A300] text-white font-medium text-sm md:w-24 flex-shrink-0 disabled:opacity-50">
                                    {loading ? "Searching..." : "Search"}
                                </button>
                            </div>
                        </div>

                        {/* DESKTOP SEARCH BAR */}
                        <div className="hidden lg:block relative bottom-40 left-1/2 -translate-x-[60%] w-full max-w-[950px]">
                            <div className="bg-white shadow-2xl px-5 py-3 flex items-center gap-3 rounded-full border border-yellow-400">
                                <input
                                    value={keyword}
                                    onChange={(e) => setKeyword(e.target.value)}
                                    placeholder="Enter Keyword"
                                    className="flex-1 px-5 py-3 rounded-full bg-gray-50 outline-none text-sm"
                                />
                                <select value={type} onChange={(e) => handleFilterChange('type', e.target.value)} className="w-28 px-3 py-3 rounded-full bg-gray-50 text-sm flex-shrink-0">
                                    <option>Type</option>
                                    <option value="commercial">Commercial Property</option>
                                    <option value="retail-shops">Retail Shops</option>
                                    <option value="sco-plots">SCO Plots</option>
                                </select>
                                <select value={status} onChange={(e) => handleFilterChange('status', e.target.value)} className="w-28 px-3 py-3 rounded-full bg-gray-50 text-sm flex-shrink-0">
                                    <option>Status</option>
                                    <option value="new-launch">New Launch Project</option>
                                    <option value="ready-to-move">Ready to Move Project</option>
                                </select>
                                <select value={locality} onChange={(e) => handleFilterChange('locality', e.target.value)} className="w-28 px-3 py-3 rounded-full bg-gray-50 text-sm flex-shrink-0">
                                    <option>Localities</option>
                                    <option value="dwarka-expressway">Dwarka Expressway</option>
                                    <option value="golf-course-road">Golf Course Road</option>
                                    <option value="golf-course-extension-road">Golf Course Extension Road</option>
                                </select>
                                <button onClick={handleSearch} disabled={loading} className="w-24 px-4 py-3 rounded-full bg-[#F5A300] text-white font-medium text-sm flex-shrink-0 disabled:opacity-50">
                                    {loading ? "Searching..." : "Search"}
                                </button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ✅ RESULTS HEADER + ACTIVE FILTERS */}
                <div className="max-w-[1240px] mx-auto px-4 py-6">
                    <div className="text-sm text-gray-500 mb-3">
                        {bhk ? getBhkDisplayName(bhk) :
                            type ? formatFilterName(type) :
                                status ? formatFilterName(status) :
                                    locality ? formatFilterName(locality) :
                                        budget ? budget.replace(/-/g, ' ') : "Commercial"} in Gurgaon
                    </div>

                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                        <div className="max-w-4xl">
                            <h1 className="text-xl sm:text-2xl md:text-[26px] font-semibold text-gray-900">
                                {pageTitle}
                            </h1>
                            <p className="mt-2 text-sm sm:text-[15px] text-gray-600">
                                {type ? `Discover premium ${formatFilterName(type).toLowerCase()} properties in Gurgaon.` :
                                    bhk ? `Find ${getBhkDisplayName(bhk).toLowerCase()} commercial spaces.` :
                                        status ? `Explore ${formatFilterName(status).toLowerCase()} commercial opportunities.` :
                                            "Strategic commercial properties in prime Gurgaon locations with excellent ROI potential."}
                            </p>
                        </div>
                        <div className="text-sm text-gray-500">
                            {filteredApartments.length} results
                            {totalPages > 1 && ` | Page ${currentPage} of ${totalPages}`}
                        </div>
                    </div>

                    {/* ACTIVE FILTERS */}
                    {(type || status || locality || budget || bhk) && (
                        <div className="mt-4 flex flex-wrap items-center gap-2">
                            {type && (
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                                    {formatFilterName(type)}
                                    <button onClick={() => handleFilterChange('type', '')} className="ml-2 text-green-600 hover:text-green-800 font-bold text-xs">×</button>
                                </span>
                            )}
                            {status && (
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                                    {formatFilterName(status)}
                                    <button onClick={() => handleFilterChange('status', '')} className="ml-2 text-blue-600 hover:text-blue-800 font-bold text-xs">×</button>
                                </span>
                            )}
                            {locality && (
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-800">
                                    {formatFilterName(locality)}
                                    <button onClick={() => handleFilterChange('locality', '')} className="ml-2 text-orange-600 hover:text-orange-800 font-bold text-xs">×</button>
                                </span>
                            )}
                            {bhk && (
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                                    {getBhkDisplayName(bhk)}
                                    <button onClick={() => handleFilterChange('bhk', '')} className="ml-2 text-purple-600 hover:text-purple-800 font-bold text-xs">×</button>
                                </span>
                            )}
                            <button onClick={clearFilters} className="text-sm text-gray-500 hover:text-gray-700 underline">
                                Clear all filters
                            </button>
                        </div>
                    )}
                </div>
            </section>

            {/* ================= LISTINGS ================= */}
            <main className="py-10 lg:pt-20">
                <div className="max-w-[1240px] mx-auto px-4 lg:px-12">
                    {loading ? (
                        <div className="text-center py-20">
                            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#F5A300]"></div>
                            <p className="mt-4 text-gray-600">Loading properties...</p>
                        </div>
                    ) : filteredApartments.length === 0 ? (
                        <div className="text-center py-20">
                            <p className="text-xl text-gray-500 mb-4">No commercial matches found</p>
                            <p className="text-gray-600 mb-6">Showing available commercial properties in Gurgaon</p>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {filterForCommercial(apartments).slice(0, 6).map((item) => (
                                    <PropertyCard
                                        key={item.id}
                                        property={{
                                            title: item.title,
                                            developer: item.developer,
                                            location: item.location,
                                            bhk: item.configurations?.join(", "),
                                            size: item.areaRange,
                                            price: item.priceRange,
                                            img: item.mainImage?.url || "/placeholder.jpg",
                                            slug: item.id,
                                            isTrending: item.isTrending,
                                            isNewLaunch: item.isNewLaunch,
                                        }}
                                    />
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {currentApartments.map((item) => (
                                <PropertyCard
                                    key={item.id}
                                    property={{
                                        title: item.title,
                                        builder: item.developer,
                                        location: item.location,
                                        bhk: item.configurations?.join(", "),
                                        size: item.areaRange,
                                        price: item.priceRange,
                                        img: item.mainImage?.url || "/placeholder.jpg",
                                        slug: item.id,
                                        isTrending: item.isTrending,
                                        isNewLaunch: item.isNewLaunch,
                                    }}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {totalPages > 1 && (
                    <div className="max-w-[1240px] mx-auto px-4 lg:px-12 mt-12">
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={handlePageChange}
                        />
                    </div>
                )}
            </main>

            <Footer />
        </>
    );
}
