"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { FiMapPin, FiSearch, FiX } from "react-icons/fi";
import { useRouter } from "next/navigation";
import { getHero } from "@/lib/firestore/hero/read";
import { index } from "@/lib/algoliaClient";
import { ChevronLeft, ChevronRight } from "lucide-react";

const TAGS = [
  "Sohna Road",
  "Golf Course Road",
  "Golf Course Extension",
  "Old Gurgaon",
  "Dwarka Expressway",
  "New Gurgaon",
];

const DEFAULT_VIDEO =
  "https://www.youtube.com/embed/4jnzf1yj48M?autoplay=1&mute=1";

// ✅ SMALLER & MORE ROUNDED VIDEO SIZES
const VIDEO_SIZES = {
  desktop: {
    width: "220px",   // ← Smaller width
    height: "300px"   // Proportional height
  },
  mobile: {
    maxWidth: "240px", // ← Smaller width
    height: "300px"    // Proportional height
  }
};

export default function SearchCard() {
  const router = useRouter();

  const [propertyType, setPropertyType] = useState("residential");
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const [hero, setHero] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [playMobileVideo, setPlayMobileVideo] = useState(false);

  /* ================= FETCH HERO ================= */
  useEffect(() => {
    const fetchHero = async () => {
      const res = await getHero();
      if (res) setHero(res);
    };
    fetchHero();
  }, []);

  /* ================= INSTAGRAM EMBED LOAD ================= */
  useEffect(() => {
    if (hero?.mediaType === "instagram") {
      if (window?.instgrm) {
        window.instgrm.Embeds.process();
      } else {
        const script = document.createElement("script");
        script.src = "https://www.instagram.com/embed.js";
        script.async = true;
        document.body.appendChild(script);
      }
    }
  }, [hero, playMobileVideo]);

  /* ================= AUTO SLIDER ================= */
  useEffect(() => {
    if (!hero?.images?.length) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) =>
        prev === hero.images.length - 1 ? 0 : prev + 1
      );
    }, 4000);

    return () => clearInterval(interval);
  }, [hero?.images?.length]);



  const goNext = () => {
    if (!hero?.images?.length) return;
    setCurrentSlide((prev) =>
      prev === hero.images.length - 1 ? 0 : prev + 1
    );
  };

  const goPrev = () => {
    if (!hero?.images?.length) return;
    setCurrentSlide((prev) =>
      prev === 0 ? hero.images.length - 1 : prev - 1
    );
  };

  /* ================= MEDIA URL ================= */
  let videoUrl = DEFAULT_VIDEO;

  if (hero?.videoUrl) {
    if (hero?.mediaType === "instagram") {
      videoUrl = hero.videoUrl;
    } else {
      const idMatch =
        hero.videoUrl.match(/embed\/([^?]+)/) ||
        hero.videoUrl.match(/v=([^&]+)/) ||
        hero.videoUrl.match(/youtu\.be\/([^?]+)/);

      const videoId = idMatch?.[1];
      videoUrl = videoId
        ? `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1`
        : `${hero.videoUrl}?autoplay=1&mute=1`;
    }
  }

  /* ================= SEARCH ================= */
  const handleSearch = async (text = query) => {
    if (!text.trim()) {
      setResults([]);
      return;
    }

    try {
      setLoading(true);

      const { hits } = await index.search(text, {
        hitsPerPage: 5,
      });

      setResults(hits);
    } catch (err) {
      console.error("Search error", err);
    } finally {
      setLoading(false);
    }
  };


  return (
    <section className="relative w-full">
      {/* ================= HERO ================= */}
      <div className="relative w-full h-[360px] sm:h-[400px] md:h-[450px] sm:mb-20 overflow-hidden">

        {/* BACKGROUND SLIDER */}
        {hero?.images?.length ? (
          hero.images.map((img, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentSlide
                ? "opacity-100 z-10"
                : "opacity-0 z-0"
                }`}
            >
              <Image
                src={img}
                alt={`Hero ${index + 1}`}
                fill
                className="object-cover"
                priority={index === 0}
              />
            </div>
          ))
        ) : (
          <Image
            src="/images/heroimg.png"
            alt="Hero"
            fill
            className="object-cover"
          />
        )}

        {/* buttons for slider navigation */}
        <button
          onClick={goPrev}
          className="absolute left-6 top-1/2 -translate-y-1/2 z-[60]
  text-white/70 hover:text-white transition"
        >
          <ChevronLeft size={40} />
        </button>

        <button
          onClick={goNext}
          className="absolute right-6 top-1/2 -translate-y-1/2 z-[60]
  text-white/70 hover:text-white transition"
        >
          <ChevronRight size={40} />
        </button>




        {/* ================= DESKTOP YOUTUBE - SMALLER & MORE ROUNDED ================= */}
        {hero?.videoUrl && hero?.mediaType === "youtube" && (
          <div className="absolute inset-0 hidden md:flex items-center justify-end pr-8 z-30 pt-14 right-40 bottom-20">
            <div
              className="relative group rounded-3xl overflow-hidden bg-black/30 backdrop-blur-md shadow-2xl border border-white/20"
              style={{
                width: VIDEO_SIZES.desktop.width,
                height: VIDEO_SIZES.desktop.height
              }}
            >
              <button
                onClick={() => setHero(null)}
                className="absolute -top-1 -right-1 z-40 bg-white/90 hover:bg-white text-gray-800 p-1.5 rounded-2xl shadow-2xl border border-white/50 opacity-0 group-hover:opacity-100 hover:opacity-100 transition-all duration-300 scale-90 group-hover:scale-100 flex items-center justify-center w-9 h-9 hover:scale-105"
                title="Close video"
              >
                <FiX className="w-4 h-4" />
              </button>
              <iframe
                className="w-full h-full rounded-3xl"
                src={videoUrl}
                allow="autoplay; encrypted-media; picture-in-picture"
                allowFullScreen
                title="Desktop Video"
              />
            </div>
          </div>
        )}

        {/* ================= DESKTOP INSTAGRAM - SMALLER & MORE ROUNDED ================= */}
        {hero?.videoUrl && hero?.mediaType === "instagram" && (
          <div className="absolute inset-0 hidden md:flex items-center justify-end pr-8 z-30 right-20 bottom-10 group">
            <div
              className="relative rounded-3xl  overflow-hidden bg-white/10 backdrop-blur-md shadow-2xl border-2 border-white/30"
              style={{
                width: "320px",
                height: "280px"
              }}
            >
              <button
                onClick={() => setHero(null)}
                className="absolute top-2 right-2 z-40 bg-white hover:bg-gray-50 text-gray-800 p-1.5 rounded-2xl shadow-xl border border-white/50 opacity-0 group-hover:opacity-100 hover:opacity-100 transition-all duration-300 scale-90 group-hover:scale-100 flex items-center justify-center w-8 h-8 hover:scale-105"
                title="Close video"
              >
                <FiX className="w-4 h-4" />
              </button>
              <blockquote
                className="instagram-media w-full h-full rounded-3xl overflow-hidden"
                data-instgrm-permalink={hero.videoUrl}
                data-instgrm-version="14"
              ></blockquote>
            </div>
          </div>
        )}

        {/* ================= MOBILE PLAY BUTTON ================= */}
        {!playMobileVideo && hero?.videoUrl && (
          <div className="md:hidden absolute right-3 bottom-50 z-30">
            <button
              onClick={() => setPlayMobileVideo(true)}
              className="h-11 w-11 rounded-2xl bg-white shadow-xl flex items-center justify-center hover:shadow-2xl transition-all duration-200 hover:-translate-y-0.5"
              aria-label="Play video"
            >
              <svg
                viewBox="0 0 24 24"
                className="h-6 w-6 text-red-600"
                fill="currentColor"
              >
                <path d="M23.5 6.2s-.2-1.7-.9-2.4c-.8-.9-1.7-.9-2.1-1C17.7 2.5 12 2.5 12 2.5s-5.7 0-8.5.3c-.4.1-1.3.1-2.1 1C.7 4.5.5 6.2.5 6.2S0 8.1 0 10v1.9c0 1.9.5 3.8.5 3.8s.2 1.7.9 2.4c.8.9 1.9.9 2.4 1 1.7.2 7.2.3 7.2.3s5.7 0 8.5-.3c-.4-.1 1.3-.1 2.1-1 .7-.7.9-2.4.9-2.4s.5-1.9.5-3.8V10c0-1.9-.5-3.8-.5-3.8zM9.5 13.5V7.5l6 3-6 3z" />
              </svg>
            </button>
          </div>
        )}

        {/* ================= MOBILE VIDEO - SMALLER & MORE ROUNDED ================= */}
        {playMobileVideo && hero?.videoUrl && (
          <div className="md:hidden absolute inset-0 z-40 bg-black/70 flex items-center justify-center px-4">
            <button
              onClick={() => setPlayMobileVideo(false)}
              className="absolute top-3 right-6 z-50 h-10 w-10 rounded-2xl bg-black/90 text-white flex items-center justify-center shadow-2xl hover:bg-white hover:text-black transition-all duration-200 hover:scale-105"
              aria-label="Close video"
            >
              ✕
            </button>

            <div
              className="rounded-3xl overflow-hidden bg-black shadow-2xl border-4 border-white/20"
              style={{
                width: `min(90vw, ${VIDEO_SIZES.mobile.maxWidth})`,
                height: VIDEO_SIZES.mobile.height
              }}
            >
              <iframe
                className="w-full h-full rounded-3xl"
                src={videoUrl}
                allow="autoplay; encrypted-media"
                allowFullScreen
                title="Mobile Hero Video"
              />
            </div>
          </div>
        )}
      </div>

      {/* ================= SEARCH WRAPPER ================= */}
      <div className="absolute left-1/2 -translate-x-1/2 top-[380px] max-sm:top-[280px] w-full max-w-[990px] px-4 z-20">
        <div className="bg-white rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.15)] px-4 sm:px-6 pt-4 pb-5">

          <div className="mb-4 flex flex-col md:flex-row items-center justify-between gap-3">
            <h2 className="text-sm sm:text-base font-semibold text-gray-800">
              Find your perfect home with{" "}
              <span className="text-[#DBA40D]">Neev Realty</span>
            </h2>

            <div className="flex rounded-full bg-gray-100">
              {[
                { label: "Residential", value: "residential" },
                { label: "Commercial", value: "commercial" }
              ].map((tab) => (
                <button
                  key={tab.value}
                  onClick={() => {
                    setPropertyType(tab.value);
                    setResults([]);
                    if (tab.value === "residential") {
                      router.push("/residential");
                    } else if (tab.value === "commercial") {
                      router.push("/commercial");
                    }
                  }}
                  className={`rounded-full px-4 text-xs sm:text-sm font-medium transition ${propertyType === tab.value
                    ? "bg-white shadow-md text-gray-900"
                    : "text-gray-500 hover:text-gray-700"
                    }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 rounded-2xl bg-white px-3 py-2.5 relative">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100 text-gray-600">
              <FiMapPin />
            </span>

            <input
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                handleSearch(e.target.value);
              }}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="flex-1 bg-transparent text-xs sm:text-sm outline-none placeholder-gray-500"
              placeholder="Search by City, Locality, or Project"
            />

            <button
              onClick={() => handleSearch()}
              className="bg-[#DBA40D] hover:bg-[#c8950b] px-6 py-2.5 rounded-xl text-white text-xs sm:text-sm font-semibold flex items-center gap-2 shadow-md hover:shadow-lg transition-all duration-200"
            >
              <FiSearch />
              <span>{loading ? "Searching..." : "Search"}</span>
            </button>
          </div>

          {results.length > 0 && (
            <div className="absolute left-0 right-0 top-full mt-2 bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-4 z-50 border border-gray-100">
              <ul className="space-y-2 max-h-[260px] overflow-y-auto">
                {results.map((item) => (
                  <li
                    key={item.objectID}
                    onClick={() => {
                      router.push(`/residential/${item.id}`);
                      setResults([]);
                      setQuery("");
                    }}
                    className="cursor-pointer rounded-xl px-4 py-3 hover:bg-gray-50 transition-all duration-200 border-b border-gray-100 last:border-b-0"
                  >
                    <p className="text-sm font-semibold text-gray-900">{item.title}</p>
                    <p className="text-xs text-gray-500 mt-1">{item.location}</p>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="mt-4 flex gap-2 overflow-x-auto pb-2">
          {TAGS.map((tag) => (
            <button
              key={tag}
              onClick={() => {
                const slug = tag.toLowerCase().replaceAll(" ", "-");
                router.push(`/${slug}`);
              }}
              className="whitespace-nowrap rounded-2xl border-2 border-gray-200 px-4 py-2 text-xs bg-white hover:bg-gray-50 hover:border-gray-300 shadow-sm hover:shadow-md transition-all duration-200"
            >
              {tag}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
