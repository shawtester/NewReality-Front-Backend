"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { FiMapPin, FiSearch, FiPlay } from "react-icons/fi";
import { useRouter } from "next/navigation";

import { getHero } from "@/lib/firestore/hero/read";

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

export default function SearchCard() {
  const router = useRouter();

  const [propertyType, setPropertyType] = useState("residential");
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const [hero, setHero] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  // ✅ ADDED STATE (VIDEO POPUP)
  const [showVideo, setShowVideo] = useState(false);

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
  }, [hero, showVideo]);

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

  /* ================= MEDIA URL ================= */
  let videoUrl = DEFAULT_VIDEO;

  if (hero?.videoUrl) {
    if (hero?.mediaType === "instagram") {
      videoUrl = hero.videoUrl;
    } else {
      // 🔥 AUTO CONVERT YOUTUBE LINK TO EMBED FORMAT
      const idMatch =
        hero.videoUrl.match(/embed\/([^?]+)/) ||
        hero.videoUrl.match(/v=([^&]+)/) ||
        hero.videoUrl.match(/youtu\.be\/([^?]+)/);

      const videoId = idMatch?.[1];

      videoUrl = videoId
        ? `https://www.youtube.com/embed/${videoId}`
        : hero.videoUrl;
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
      const res = await fetch(
        `/api/search?q=${text}&propertyType=${propertyType}`
      );
      const data = await res.json();
      setResults(Array.isArray(data) ? data : []);
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
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentSlide
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

        {/* ================= MOBILE VIDEO BUTTON (UPDATED) ================= */}
        {hero?.videoUrl && (
          <button
            onClick={() => setShowVideo(true)}
            className="absolute md:hidden left-4 bottom-4 z-30 flex items-center gap-2 bg-black/70 backdrop-blur text-white px-4 py-2 rounded-full shadow-lg"
          >
            <FiPlay className="text-lg" />
            <span className="text-xs font-medium">
              Watch Video
            </span>
          </button>
        )}

        {/* ================= MOBILE VIDEO POPUP (NEW) ================= */}
        {showVideo && hero?.videoUrl && (
          <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center px-4 md:hidden">
            <div className="relative w-full max-w-[320px] rounded-2xl overflow-hidden bg-black">
              <button
                onClick={() => setShowVideo(false)}
                className="absolute right-2 top-2 z-20 text-white text-xl"
              >
                ✕
              </button>

              {hero.mediaType === "youtube" && (
                <iframe
                  className="w-full h-[360px]"
                  src={`${videoUrl}?autoplay=1&mute=0`}
                  allow="autoplay; encrypted-media; picture-in-picture"
                  allowFullScreen
                />
              )}

              {hero.mediaType === "instagram" && (
                <blockquote
                  className="instagram-media"
                  data-instgrm-permalink={hero.videoUrl}
                  data-instgrm-version="14"
                  style={{ width: "100%" }}
                ></blockquote>
              )}
            </div>
          </div>
        )}

        {/* ================= DESKTOP VIDEO ================= */}
        {hero?.videoUrl && hero?.mediaType === "youtube" && (
          <div className="absolute inset-0 hidden md:flex items-center justify-end pr-10 z-20">
            <iframe
              className="w-[280px] h-[300px] rounded-2xl shadow-2xl"
              src={`${hero.videoUrl}?autoplay=1&mute=1`}
              allow="autoplay; encrypted-media; picture-in-picture"
              allowFullScreen
            />
          </div>
        )}

        {hero?.videoUrl && hero?.mediaType === "instagram" && (
          <div className="absolute inset-0 hidden md:flex items-center justify-end pr-10 z-20">
            <blockquote
              className="instagram-media rounded-2xl overflow-hidden"
              data-instgrm-permalink={hero.videoUrl}
              data-instgrm-version="14"
              style={{ width: "150px", minWidth: "150px", height: "300px" }}
            ></blockquote>
          </div>
        )}
      </div>

      {/* ================= SEARCH CARD ================= */}
      <div className="absolute left-1/2 -translate-x-1/2 top-[380px] max-sm:top-[280px] w-full max-w-[990px] px-4 z-20">
        <div className="bg-white rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.15)] px-4 sm:px-6 pt-4 pb-5">
          <div className="mb-4 flex flex-col md:flex-row items-center justify-between gap-3">
            <h2 className="text-sm sm:text-base font-semibold text-gray-800">
              Find your perfect home with{" "}
              <span className="text-[#DBA40D]">Neev Realty</span>
            </h2>

            <div className="flex rounded-full bg-gray-100">
              {[{ label: "Residential", value: "residential" }, { label: "Commercial", value: "commercial" }].map(
                (tab) => (
                  <button
                    key={tab.value}
                    onClick={() => {
                      setPropertyType(tab.value);
                      setResults([]);

                      // 🔥 PAGE REDIRECT
                      if (tab.value === "residential") {
                        router.push("/residential");
                      } else if (tab.value === "commercial") {
                        router.push("/commercial");
                      }
                    }}

                    className={`rounded-full px-4 text-xs sm:text-sm font-medium transition ${propertyType === tab.value
                      ? "bg-white shadow text-gray-900"
                      : "text-gray-500"
                      }`}
                  >
                    {tab.label}
                  </button>
                )
              )}
            </div>
          </div>

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

          {results.length > 0 && (
            <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-xl shadow-lg p-4 z-50">
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

        <div className="mt-4 flex gap-2 overflow-x-auto pb-2">
          {TAGS.map((tag) => (
            <button
              key={tag}
              onClick={() => {
                const slug = tag.toLowerCase().replaceAll(" ", "-");
                router.push(`/${slug}`);
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
