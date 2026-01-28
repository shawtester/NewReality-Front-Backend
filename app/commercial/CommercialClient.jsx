"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import Header from "../components/Header";
import Footer from "../components/Footer";
import PropertyCard from "../components/property/PropertyCard";
import Pagination from "../components/property/Pagination";

const filterForCommercial = (list = []) => {
        return list.filter((item) => {
            // ❗ agar propertyType hi nahi hai → dono me dikhe
            if (!item.propertyType) return true;

            // ✅ sirf commercial wale
            return item.propertyType === "commercial";
        });
    };

export default function ApartmentsPage({ apartments = [] }) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const initialPage = Number(searchParams.get("page")) || 1;
    const [page, setPage] = useState(initialPage);

    /* ================= SEARCH & FILTER STATES ================= */
    const [keyword, setKeyword] = useState("");
    const [type, setType] = useState("");
    const [status, setStatus] = useState("");
    const [locality, setLocality] = useState("");
    const [budget, setBudget] = useState("");
    const [bhk, setBhk] = useState("");

    const [filteredApartments, setFilteredApartments] = useState(filterForCommercial(apartments));


    const [loading, setLoading] = useState(false);

    
    const apartmentsPerPage = 12;



    /* ================= ALGOLIA SEARCH ================= */
    const handleSearch = async () => {
        try {
            setLoading(true);

            const params = new URLSearchParams({
                q: keyword,
                type,
                status,
                locality,
                budget,
                bhk,
            });

            const res = await fetch(`/api/search?${params.toString()}`);
            const data = await res.json();

            const safeData = Array.isArray(data) ? data : [];

            // ✅ COMMERCIAL FILTER APPLY
            const commercialOnly = filterForCommercial(safeData);

            // fallback
            if (commercialOnly.length === 0) {
                setFilteredApartments(filterForCommercial(apartments));
            } else {
                setFilteredApartments(commercialOnly);
            }

            setPage(1);
        } catch (err) {
            console.error("Search error ❌", err);
            setFilteredApartments(filterForCommercial(apartments));
        } finally {
            setLoading(false);
        }
    };

    /* ================= PAGINATION ================= */
    const totalPages = Math.ceil(
        filteredApartments.length / apartmentsPerPage
    );

    const startIndex = (page - 1) * apartmentsPerPage;
    const endIndex = startIndex + apartmentsPerPage;

    const currentApartments = filteredApartments.slice(
        startIndex,
        endIndex
    );

    useEffect(() => {
        router.push(`?page=${page}`, { scroll: false });
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, [page]);

    return (
        <>
            <Header />

            {/* ================= PAGE INTRO ================= */}
            <section className="bg-[#F6FBFF]">
                <div className="max-w-[1240px] mx-auto px-4 py-6">
                    <div className="text-sm text-gray-500 mb-3">Commercial</div>

                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                        <div className="max-w-4xl">
                            <h1 className="text-xl sm:text-2xl md:text-[26px] font-semibold text-gray-900">
                                Commercial Apartments Property for Sale in Gurgaon
                            </h1>

                            <p className="mt-2 text-sm sm:text-[15px] text-gray-600">
                                Booming Micro Commercial Apartments Market in Gurgaon –
                                luxury apartments offering massive long-term capital gains.

                            </p>
                        </div>

                        <div className="text-sm text-gray-500">{filteredApartments.length} results</div>
                    </div>
                </div>
            </section>

            {/* ================= TRENDING BANNER ================= */}
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

            {/* ================= HERO SECTION ================= */}
            <section className="lg:bg-[#F6FBFF] pt-4  relative">
                {/* HERO TEXT – MOBILE & TABLET */}
                <div className="lg:hidden mb-6 text-center px-2">

                    <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 leading-tight">
                        Your <span className="text-[#F5A300]">Property</span>, <br />
                        Our Priority.
                    </h1>
                </div>

                <div className="max-w-[1240px] mx-auto px-4">
                    <div className="relative hidden lg:flex items-start gap-10">
                        {/* LEFT */}
                        <div className="flex-1 ml-10">


                            <h1 className="text-[42px] sm:text-[52px] font-extrabold text-gray-900 leading-tight">
                                Your <span className="text-[#F5A300]">Property</span>, <br />
                                Our Priority.
                            </h1>
                        </div>

                        <div className="flex-1 flex justify-center self-end">
                            <div className="
    relative
    w-[240px] h-[240px]
    sm:w-[310px] sm:h-[310px]
    md:w-[370px] md:h-[370px]
    lg:w-[450px] lg:h-[420px]
    rounded-[40px] lg:rounded-[60px]
    overflow-hidden shadow-xl
  ">
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

                            <select value={type} onChange={(e) => setType(e.target.value)} className="w-full px-3 py-2.5 rounded-full bg-gray-50 text-sm md:w-28 flex-shrink-0">
                                <option>Type</option>
                                <option value="residential">Residential Property</option>
                                <option value="commercial">Commercial Property</option>
                                <option value="luxury-apartment">Luxury Apartment</option>
                                <option value="builder-floor">Builder Floor</option>
                                <option value="retail-shops">Retail Shops</option>
                                <option value="sco-plots">SCO Plots</option>
                            </select>

                            <select value={status} onChange={(e) => setStatus(e.target.value)} className="w-full px-3 py-2.5 rounded-full bg-gray-50 text-sm md:w-28 flex-shrink-0">
                                <option>Status</option>
                                <option value="new-launch">New Launch Project</option>
                                <option value="ready-to-move">Ready to Move Project</option>
                                <option value="under-construction">Under Construction Project</option>
                                <option value="pre-launch">Pre Launch Project</option>
                            </select>

                            <select value={locality} onChange={(e) => setLocality(e.target.value)} className="w-full px-3 py-2.5 rounded-full bg-gray-50 text-sm md:w-28 flex-shrink-0">
                                <option>Localities</option>
                                <option value="dwarka-expressway">Dwarka Expressway</option>
                                <option value="golf-course-road">Golf Course Road</option>
                                <option value="golf-course-extension-road">
                                    Golf Course Extension Road
                                </option>
                                <option value="sohna-road">Sohna Road</option>
                                <option value="new-gurgaon">New Gurgaon</option>
                                <option value="old-gurgaon">Old Gurgaon</option>
                                <option value="spr">SPR</option>
                                <option value="nh8">NH8</option>
                            </select>

                            <select value={budget} onChange={(e) => setBudget(e.target.value)} className="w-full px-3 py-2.5 rounded-full bg-gray-50 text-sm md:w-28 flex-shrink-0">
                                <option>Budget</option>
                                <option value="1-2-cr">1 – 2 Cr</option>
                                <option value="2-3-cr">2 – 3 Cr</option>
                                <option value="3-4-cr">3 – 4 Cr</option>
                                <option value="4-5-cr">4 – 5 Cr</option>
                                <option value="5-6-cr">5 – 6 Cr</option>
                                <option value="6-7-cr">6 – 7 Cr</option>
                                <option value="7-8-cr">7 – 8 Cr</option>
                                <option value="above-8-cr">Above 8 Cr</option>
                            </select>

                            <select value={bhk} onChange={(e) => setBhk(e.target.value)} className="w-full px-3 py-2.5 rounded-full bg-gray-50 text-sm md:w-28 flex-shrink-0">
                                <option value="">Size</option>
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



                            <button onClick={handleSearch} className="w-full px-4 py-2.5 rounded-full bg-[#F5A300] text-white font-medium text-sm md:w-24 flex-shrink-0">
                                {loading ? "Searching..." : "Search"}
                            </button>
                        </div>
                    </div>

                    {/* DESKTOP SEARCH BAR */}
                    <div className="hidden lg:block relative bottom-40 left-1/2 -translate-x-[60%] w-full max-w-[950px]">
                        <div className="bg-white shadow-2xl px-5 py-3  flex items-center gap-3 rounded-full border border-yellow-400">
                            <input
                                value={keyword}
                                onChange={(e) => setKeyword(e.target.value)}
                                placeholder="Enter Keyword"
                                className="flex-1 px-5 py-3 rounded-full bg-gray-50 outline-none text-sm"
                            />

                            <select value={type} onChange={(e) => setType(e.target.value)} className="w-28 px-3 py-3 rounded-full bg-gray-50 text-sm flex-shrink-0">
                                <option>Type</option>
                                <option value="residential">Residential Property</option>
                                <option value="commercial">Commercial Property</option>
                                <option value="luxury-apartment">Luxury Apartment</option>
                                <option value="builder-floor">Builder Floor</option>
                                <option value="retail-shops">Retail Shops</option>
                                <option value="sco-plots">SCO Plots</option>
                            </select>

                            <select value={status} onChange={(e) => setStatus(e.target.value)} className="w-28 px-3 py-3 rounded-full bg-gray-50 text-sm flex-shrink-0">
                                <option>Status</option>
                                <option value="new-launch">New Launch Project</option>
                                <option value="ready-to-move">Ready to Move Project</option>
                                <option value="under-construction">Under Construction Project</option>
                                <option value="pre-launch">Pre Launch Project</option>
                            </select>

                            <select value={locality} onChange={(e) => setLocality(e.target.value)} className="w-28 px-3 py-3 rounded-full bg-gray-50 text-sm flex-shrink-0">
                                <option>Localities</option>
                                <option value="dwarka-expressway">Dwarka Expressway</option>
                                <option value="golf-course-road">Golf Course Road</option>
                                <option value="golf-course-extension-road">
                                    Golf Course Extension Road
                                </option>
                                <option value="sohna-road">Sohna Road</option>
                                <option value="new-gurgaon">New Gurgaon</option>
                                <option value="old-gurgaon">Old Gurgaon</option>
                                <option value="spr">SPR</option>
                                <option value="nh8">NH8</option>
                            </select>

                            <select value={budget} onChange={(e) => setBudget(e.target.value)} className="w-28 px-3 py-3 rounded-full bg-gray-50 text-sm flex-shrink-0">
                                <option>Budget</option>
                                <option value="1-2-cr">1 – 2 Cr</option>
                                <option value="2-3-cr">2 – 3 Cr</option>
                                <option value="3-4-cr">3 – 4 Cr</option>
                                <option value="4-5-cr">4 – 5 Cr</option>
                                <option value="5-6-cr">5 – 6 Cr</option>
                                <option value="6-7-cr">6 – 7 Cr</option>
                                <option value="7-8-cr">7 – 8 Cr</option>
                                <option value="above-8-cr">Above 8 Cr</option>
                            </select>

                            <select value={bhk} onChange={(e) => setBhk(e.target.value)} className="w-28 px-3 py-3 rounded-full bg-gray-50 text-sm flex-shrink-0">
                                <option value="">Size</option>
                                <option value="1-bhk">1 BHK </option>
                                <option value="1.5-bhk">1.5 BHK </option>
                                <option value="2-bhk">2 BHK </option>
                                <option value="2.5-bhk">2.5 BHK </option>
                                <option value="3-bhk">3 BHK </option>
                                <option value="3.5-bhk">3.5 BHK </option>
                                <option value="4-bhk">4 BHK </option>
                                <option value="4.5-bhk">4.5 BHK </option>
                                <option value="5-bhk">5 BHK </option>
                                <option value="above-5-bhk">Above 5 BHK </option>
                            </select>



                            <button onClick={handleSearch} className="w-24 px-4 py-3 rounded-full bg-[#F5A300] text-white font-medium text-sm flex-shrink-0">
                                {loading ? "Searching..." : "Search"}
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* ================= LISTINGS ================= */}
            <main className="py-10 lg:pt-20">
                <div className="max-w-[1240px] mx-auto px-4 lg:px-12">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {currentApartments.map((item) => (
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

                <Pagination
                    currentPage={page}
                    totalPages={totalPages}
                    onPageChange={setPage}
                />
            </main>

            <Footer />
        </>
    );
}
