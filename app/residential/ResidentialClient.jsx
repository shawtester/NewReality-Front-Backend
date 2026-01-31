"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useCallback, useMemo } from "react";
import Image from "next/image";
import Header from "../components/Header";
import Footer from "../components/Footer";
import PropertyCard from "../components/property/PropertyCard";
import Pagination from "../components/property/Pagination";

const PROPERTY_TYPE_MAP = {
    apartment: "isApartment",
    "builder-floor": "isBuilderFloor",
    villa: "isVilla",
    plot: "isPlot",
};

const filterByPropertyType = (list = [], type) => {
    const field = PROPERTY_TYPE_MAP[type];
    if (!field) return list;
    return list.filter((item) => item[field] === true);
};

const filterApartments = (list = []) => {
    return list.filter((item) => item.isApartment === true);
};


export default function ResidentialPage({ apartments = [] }) {
    const BASE_ROUTE = "/residential";
    const router = useRouter();
    const searchParams = useSearchParams();

    const [keyword, setKeyword] = useState("");
    const [type, setType] = useState("");
    const [status, setStatus] = useState("");
    const [locality, setLocality] = useState("");
    const [budget, setBudget] = useState("");
    const [bhk, setBhk] = useState("");
    const [page, setPage] = useState(1);
    const [filteredApartments, setFilteredApartments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [pageTitle, setPageTitle] = useState("Residential Apartments Property for Sale in Gurgaon");

    const apartmentsPerPage = 12;

    const filterForResidential = (list = []) => {
        return list.filter((item) => {
            // case 1: propertyType hi nahi hai → dono me show
            if (!item.propertyType) return true;

            // case 2: explicitly residential
            return item.propertyType === "residential";
        });
    };


    /* ================= UTILITY FUNCTIONS ================= */
    const getBhkDisplayName = (bhkValue) => {
        const bhkMap = {
            "1-bhk": "1 BHK", "1.5-bhk": "1.5 BHK", "2-bhk": "2 BHK", "2.5-bhk": "2.5 BHK",
            "3-bhk": "3 BHK", "3.5-bhk": "3.5 BHK", "4-bhk": "4 BHK", "4.5-bhk": "4.5 BHK",
            "5-bhk": "5 BHK", "above-5-bhk": "5+ BHK"
        };
        return bhkMap[bhkValue] || "All Properties";
    };

    const formatFilterName = (filterValue) => {
        return filterValue?.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) || '';
    };

    /* ================= 🔥 MAIN URL SYNC + DYNAMIC HEADING ================= */
    useEffect(() => {
        const urlKeyword = searchParams.get("q") || "";
        const urlType = searchParams.get("type") || "";
        const urlStatus = searchParams.get("status") || "";
        const urlLocality = searchParams.get("locality") || "";
        const urlBudget = searchParams.get("budget") || "";
        const urlBhk = searchParams.get("bhk") || "";
        const urlPage = Number(searchParams.get("page")) || 1;

        // Update states
        setKeyword(urlKeyword);
        setType(urlType);
        setStatus(urlStatus);
        setLocality(urlLocality);
        setBudget(urlBudget);
        setBhk(urlBhk);
        setPage(urlPage);

        // ✅ DYNAMIC TITLE - Priority: BHK > Type > Status > Locality > Budget
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
            title = `${urlBudget.replace(/-/g, ' ')} Properties in Gurgaon`;
        }
        setPageTitle(title);

        // Auto search OR fallback to all properties
        const hasFilters = urlType || urlStatus || urlLocality || urlBudget || urlBhk || urlKeyword;
        if (urlType && PROPERTY_TYPE_MAP[urlType]) {
            const filtered = filterByPropertyType(apartments, urlType);
            setFilteredApartments(filtered);
            return;
        }


        if (hasFilters) {
            handleSearch();
        } else {
            // Show all properties when no filters
            setFilteredApartments(filterForResidential(apartments));

        }
    }, [searchParams, apartments]);

    /* ================= SEARCH FUNCTION WITH FALLBACK ================= */
    const handleSearch = useCallback(async () => {
        try {
            setLoading(true);

            const params = new URLSearchParams({
                q: keyword || undefined,
                type: type || undefined,
                status: status || undefined,
                locality: locality || undefined,
                budget: budget || undefined,
                bhk: bhk || undefined,
            });

            for (const [key, value] of params) {
                if (!value) params.delete(key);
            }

            const res = await fetch(`/api/search?${params.toString()}`);
            const data = await res.json();

            let finalData = Array.isArray(data) ? data : [];

            if (type && PROPERTY_TYPE_MAP[type]) {
                finalData = filterByPropertyType(finalData, type);
            }

            setFilteredApartments(finalData);



            // ✅ RESIDENTIAL FILTER APPLIED HERE
            const residentialOnly = filterForResidential(safeData);

            // fallback
            if (residentialOnly.length === 0) {
                setFilteredApartments(filterForResidential(apartments));
            } else {
                setFilteredApartments(residentialOnly);
            }

            setPage(1);
        } catch (err) {
            console.error("❌ API Error - Using fallback");
            setFilteredApartments(filterForResidential(apartments));
        } finally {
            setLoading(false);
        }
    }, [keyword, type, status, locality, budget, bhk, apartments]);


    /* ================= FILTER CHANGE HANDLER ================= */
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

    /* ================= CLEAR FILTERS ================= */
    const clearFilters = () => {
        router.push(BASE_ROUTE, { scroll: false });
    };

    /* ================= PAGINATION ================= */
    const totalPages = useMemo(() => {
        return Math.ceil(filteredApartments.length / apartmentsPerPage);
    }, [filteredApartments.length]);

    const currentPage = Number(searchParams.get('page')) || page;
    const startIndex = (currentPage - 1) * apartmentsPerPage;
    const endIndex = startIndex + apartmentsPerPage;
    const currentApartments = filteredApartments.slice(startIndex, endIndex);

    const handlePageChange = useCallback((newPage) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set('page', newPage.toString());
        router.push(`${BASE_ROUTE}?${params.toString()}`, { scroll: false });
    }, [searchParams, router]);

    return (
        <>
            <Header />

            {/* ================= PAGE INTRO ================= */}
            <section className="bg-[#F6FBFF]">
                {/* TRENDING BANNER */}
                <section className="bg-white py-6 sm:py-10 md:py-5">
                    <div className="max-w-[1440px] mx-auto px-4 sm:px-6">
                        <h2 className="text-center text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-4 sm:mb-6">
                            Trending <span className="text-[#F5A300]">Projects</span>
                        </h2>
                        <div className="w-full h-24 md:h-38 md:w-[90%] md:mx-auto md:bg-blue-100 md:rounded-lg bg-blue-100 rounded-lg flex items-center justify-center text-lg">
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

                        {/* MOBILE SEARCH */}
                        <div className="lg:hidden mt-8 mb-12">
                            <div className="bg-white shadow-2xl p-3 w-full flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center md:gap-2 md:p-4 rounded-2xl">
                                <input
                                    value={keyword}
                                    onChange={(e) => setKeyword(e.target.value)}
                                    placeholder="Enter Keyword"
                                    className="w-full px-3 py-2.5 rounded-full bg-gray-50 outline-none text-sm flex-1 min-w-0"
                                />
                                <select value={type} onChange={(e) => handleFilterChange('type', e.target.value)} className="w-full px-3 py-2.5 rounded-full bg-gray-50 text-sm md:w-28 flex-shrink-0">
                                    <option>Type</option>
                                    <option value="residential">Residential</option>
                                    <option value="commercial">Commercial</option>
                                    <option value="sco-plots">SCO Plots</option>
                                </select>
                                <select value={status} onChange={(e) => handleFilterChange('status', e.target.value)} className="w-full px-3 py-2.5 rounded-full bg-gray-50 text-sm md:w-28 flex-shrink-0">
                                    <option>Status</option>
                                    <option value="new-launch">New Launch</option>
                                    <option value="ready-to-move">Ready to Move</option>
                                </select>
                                <button onClick={handleSearch} disabled={loading} className="w-full px-4 py-2.5 rounded-full bg-[#F5A300] text-white font-medium text-sm md:w-24 flex-shrink-0 disabled:opacity-50">
                                    {loading ? "Searching..." : "Search"}
                                </button>
                            </div>
                        </div>

                        {/* DESKTOP SEARCH */}
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
                                    <option value="residential">Residential</option>
                                    <option value="commercial">Commercial</option>
                                    <option value="sco-plots">SCO Plots</option>
                                </select>
                                <select value={status} onChange={(e) => handleFilterChange('status', e.target.value)} className="w-28 px-3 py-3 rounded-full bg-gray-50 text-sm flex-shrink-0">
                                    <option>Status</option>
                                    <option value="new-launch">New Launch</option>
                                    <option value="ready-to-move">Ready to Move</option>
                                </select>
                                <select value={bhk} onChange={(e) => handleFilterChange('bhk', e.target.value)} className="w-28 px-3 py-3 rounded-full bg-gray-50 text-sm flex-shrink-0">
                                    <option>Size</option>
                                    <option value="1-bhk">1 BHK</option>
                                    <option value="2-bhk">2 BHK</option>
                                    <option value="3-bhk">3 BHK</option>
                                </select>
                                <button onClick={handleSearch} disabled={loading} className="w-24 px-4 py-3 rounded-full bg-[#F5A300] text-white font-medium text-sm flex-shrink-0 disabled:opacity-50">
                                    {loading ? "Searching..." : "Search"}
                                </button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ✅ FIXED RESULTS HEADER */}
                <div className="max-w-[1240px] mx-auto px-4 py-6">
                    <div className="text-sm text-gray-500 mb-3">
                        {bhk ? getBhkDisplayName(bhk) :
                            type ? formatFilterName(type) :
                                status ? formatFilterName(status) :
                                    locality ? formatFilterName(locality) :
                                        budget ? budget.replace(/-/g, ' ') : "Residential"} in Gurgaon
                    </div>

                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                        <div className="max-w-4xl">
                            <h1 className="text-xl sm:text-2xl md:text-[26px] font-semibold text-gray-900">
                                {pageTitle}
                            </h1>
                            <p className="mt-2 text-sm sm:text-[15px] text-gray-600">
                                {bhk ? `Discover premium ${getBhkDisplayName(bhk).toLowerCase()} properties in Gurgaon.` :
                                    type ? `Find ${formatFilterName(type).toLowerCase()} properties with excellent ROI potential.` :
                                        status ? `Explore ${formatFilterName(status).toLowerCase()} opportunities in Gurgaon.` :
                                            locality ? `Premium properties in ${formatFilterName(locality)}.` :
                                                "Booming residential market in Gurgaon offering excellent investment returns."}
                            </p>
                        </div>
                        <div className="text-sm text-gray-500">
                            {filteredApartments.length} results
                            {totalPages > 1 && `| Page ${currentPage} of ${totalPages}`}
                        </div>
                    </div>

                    {/* Active Filters */}
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

            {/* LISTINGS */}
            <main className="py-10 lg:pt-20">
                <div className="max-w-[1240px] mx-auto px-4 lg:px-12">
                    {loading ? (
                        <div className="text-center py-20">
                            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#F5A300]"></div>
                            <p className="mt-4 text-gray-600">Loading properties...</p>
                        </div>
                    ) : filteredApartments.length === 0 ? (
                        <div className="text-center py-20">
                            <p className="text-xl text-gray-500 mb-4">No specific matches found</p>
                            <p className="text-gray-600 mb-6">Showing all available properties in Gurgaon</p>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {filterForResidential(apartments).slice(0, 6).map((item) => (

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
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {currentApartments.length === 0 && type ? (
                                <div className="col-span-full text-center py-20">
                                    <p className="text-xl font-semibold text-gray-600">
                                        No {type.replace("-", " ")} properties available
                                    </p>
                                    <p className="text-sm text-gray-500 mt-2">
                                        Please try another property type or clear filters.
                                    </p>
                                </div>
                            ) : (
                                currentApartments.map((item) => (
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
                                ))
                            )}


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
