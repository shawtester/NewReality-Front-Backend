"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { FiMapPin, FiSearch } from "react-icons/fi";
import { CiGlobe } from "react-icons/ci";
import { useRouter } from "next/navigation";

import { getHero } from "@/lib/firestore/hero/read";

const filterByType = (list = [], type) => {
  return list.filter((item) => {
    if (!item.propertyType) return true; // old data safe
    return item.propertyType === type;
  });
};


const TAGS = [
  "Sohna Road",
  "Golf Course Road",
  "MG Road",
  "Northern Peripheral Road",
  "Dwarka Expressway",
  "New Gurgaon",
];

const DEFAULT_VIDEO =
  "https://www.youtube.com/embed/4jnzf1yj48M?autoplay=1&mute=1";

export default function SearchCard() {
  const router = useRouter();

  const [propertyType, setPropertyType] = useState("residential");
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showVideo, setShowVideo] = useState(true);
  const [playMobileVideo, setPlayMobileVideo] = useState(false);

  const [hero, setHero] = useState(null);

  /* ================= FETCH HERO ================= */
  useEffect(() => {
    const fetchHero = async () => {
      const res = await getHero();
      if (res) setHero(res);
    };
    fetchHero();
  }, []);

  const heroImage = hero?.image?.url || "/images/heroimg.png";
  const videoUrl = hero?.videoUrl
    ? `${hero.videoUrl}?autoplay=1&mute=1`
    : DEFAULT_VIDEO;

  /* ================= ALGOLIA SEARCH ================= */
  const handleSearch = async (text = query) => {
    if (!text.trim()) {
      setResults([]);
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(
        `/api/search?q=${text}&propertyType=${propertyType}`);
      const data = await res.json();

      setResults(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Search API error ❌", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative w-full">
      {/* ================= HERO ================= */}
      <div className="relative w-full h-[360px] sm:h-[400px] md:h-[450px] sm:mb-20 overflow-hidden">
        {/* BACKGROUND IMAGE */}
        <Image
          src={heroImage}
          alt="Hero"
          fill
          priority
          className="object-cover"
        />

        {/* ================= DESKTOP FLOATING VIDEO ================= */}
        {showVideo && (
          <div className="absolute inset-0 z-20 hidden md:flex items-center justify-end pr-10">
            <div className="absolute right-10 bottom-8 -translate-y-1/4 w-[280px] h-[300px]">
              {/* CLOSE */}
              <button
                onClick={() => setShowVideo(false)}
                className="absolute -top-3 -right-3 z-30 h-9 w-9 rounded-full bg-black text-white"
              >
                ✕
              </button>

              {/* VIDEO */}
              <iframe
                className="w-full h-full rounded-2xl shadow-2xl"
                src={videoUrl}
                allow="autoplay; encrypted-media"
                allowFullScreen
              />
            </div>
          </div>
        )}

        {/* ================= MOBILE PLAY ICON ================= */}
        {!playMobileVideo && (
          <div className="md:hidden absolute right-3 bottom-40 z-30">
            <button
              onClick={() => setPlayMobileVideo(true)}
              className="h-11 w-11 rounded-full bg-white shadow-lg flex items-center justify-center"
            >
              ▶
            </button>
          </div>
        )}

        {/* ================= MOBILE VIDEO POPUP ================= */}
        {playMobileVideo && (
          <div className="md:hidden absolute inset-0 z-40 bg-black/60 flex items-center justify-center px-4">
            {/* CLOSE */}
            <button
              onClick={() => setPlayMobileVideo(false)}
              className="absolute top-4 right-4 z-50 h-9 w-9 rounded-full bg-black text-white"
            >
              ✕
            </button>

            {/* VIDEO */}
            <div className="w-[90vw] max-w-[250px] h-[300px] rounded-2xl overflow-hidden shadow-2xl bg-black">
              <iframe
                className="w-full h-full"
                src={videoUrl}
                allow="autoplay; encrypted-media"
                allowFullScreen
              />
            </div>
          </div>
        )}
      </div>



      {/* ================= SEARCH WRAPPER ================= */}
      <div className="absolute left-1/2 -translate-x-1/2 top-[380px] max-sm:top-[280px] w-full max-w-[990px] px-4 z-20">
        <div className="bg-white rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.15)] px-4 sm:px-6 pt-4 pb-5">
          {/* HEADER */}
          <div className="mb-4 flex flex-col md:flex-row items-center justify-between gap-3">
            <h2 className="text-sm sm:text-base font-semibold text-gray-800">
              Find your perfect home with{" "}
              <span className="text-[#DBA40D]">Neev Realty</span>
            </h2>

            <div className="flex rounded-full bg-gray-100">
              {[
                { label: "Residential", value: "residential" },
                { label: "Commercial", value: "commercial" },
              ].map((tab) => (
                <button
                  key={tab.value}
                  onClick={() => {
                    setPropertyType(tab.value);
                    setResults([]);
                  }}
                  className={`rounded-full px-4 text-xs sm:text-sm font-medium transition ${propertyType === tab.value
                    ? "bg-white shadow text-gray-900"
                    : "text-gray-500"
                    }`}
                >
                  {tab.label}
                </button>
              ))}

            </div>
          </div>

          {/* SEARCH BAR */}
          <div className="flex items-center gap-2 rounded-2xl bg-white px-3 py-2.5 relative">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-600">
              <FiMapPin />
            </span>

            <input
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                handleSearch(e.target.value);
              }}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="flex-1 bg-transparent text-xs sm:text-sm outline-none"
              placeholder="Search by City, Locality, or Project"
            />

            <button
              onClick={() => handleSearch()}
              className="bg-[#DBA40D] px-5 py-2.5 rounded-xl text-white text-xs sm:text-sm font-semibold flex items-center gap-1.5"
            >
              <FiSearch />
              <span>{loading ? "Searching..." : "Search"}</span>
            </button>
          </div>

          {/* SEARCH RESULTS */}
          {results.length > 0 && (
            <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-xl shadow-lg p-4 z-50">
              <p className="text-xs text-gray-500 mb-2">Search Results</p>

              <ul className="space-y-2 max-h-[260px] overflow-y-auto">
                {results.map((item) => (
                  <li
                    key={item.objectID}
                    onClick={() => {
                      router.push(`/residential/${item.id}`);
                      setResults([]);
                      setQuery("");
                    }}
                    className="cursor-pointer rounded-md px-3 py-2 hover:bg-gray-50"
                  >
                    <p className="text-sm font-medium">{item.title}</p>
                    <p className="text-xs text-gray-500">{item.location}</p>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* TAGS */}
        <div className="mt-4 flex gap-2 overflow-x-auto pb-2">
          {TAGS.map((tag) => (
            <button
              key={tag}
              onClick={() => {
                setQuery(tag);
                handleSearch(tag);
              }}
              className="whitespace-nowrap rounded-full border px-3 py-1.5 text-xs bg-white hover:bg-gray-50"
            >
              {tag}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
