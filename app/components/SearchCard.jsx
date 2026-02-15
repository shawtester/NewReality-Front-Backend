
"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import Image from "next/image";
import { FiMapPin, FiSearch, FiX } from "react-icons/fi";
import { useRouter } from "next/navigation";
import { getHero } from "@/lib/firestore/hero/read";
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
  "https://www.youtube.com/embed/4jnzf1yj48M?autoplay=1&mute=0";

const VIDEO_SIZES = {
  desktop: { width: "172px", height: "300px" },
  mobile: { maxWidth: "174px", height: "260px" },
};

export default function SearchCard() {
  const router = useRouter();

  const [propertyType, setPropertyType] = useState("residential");
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const controllerRef = useRef(null);


  const [hero, setHero] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [playMobileVideo, setPlayMobileVideo] = useState(false);
  const [desktopVideoPlaying, setDesktopVideoPlaying] = useState(true);
  const [videoKey, setVideoKey] = useState(0);
  const [isMuted, setIsMuted] = useState(false);

  /* ================= FETCH HERO ================= */
  useEffect(() => {
    const fetchHero = async () => {
      try {
        const res = await getHero();
        if (!res) return;

        const updateImages = () => {
          const isMobile = window.innerWidth < 768;

          const images = isMobile
            ? res.mobileImages || []
            : res.desktopImages || [];

          setHero({
            ...res,
            images,
          });
        };

        updateImages();
        window.addEventListener("resize", updateImages);

        return () => window.removeEventListener("resize", updateImages);
      } catch (error) {
        console.error("Hero fetch failed:", error);
      }
    };

    fetchHero();
  }, []);

  /* ================= HERO IMAGE CLICK ================= */
  const handleHeroImageClick = useCallback(() => {
    const currentImage = hero?.images?.[currentSlide];
    const link = currentImage?.link;

    if (link) {
      window.open(link, "_blank", "noopener,noreferrer");
    }
  }, [hero, currentSlide]);

  /* ================= VIDEO URL ================= */
  const getVideoUrl = () => {
    if (!hero?.videoUrl) return DEFAULT_VIDEO;

    if (hero?.mediaType === "instagram") {
      const match = hero.videoUrl.match(/(reel|p)\/([^/?]+)/);
      return match
        ? `https://www.instagram.com/p/${match[2]}/embed`
        : "";
    } else {
      const idMatch =
        hero.videoUrl.match(/embed\/([^?]+)/) ||
        hero.videoUrl.match(/v=([^&]+)/) ||
        hero.videoUrl.match(/youtu\.be\/([^?]+)/);

      const videoId = idMatch?.[1];

      return videoId
        ? `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=${
            isMuted ? 1 : 0
          }`
        : DEFAULT_VIDEO;
    }
  };

  const toggleDesktopVideo = () => {
    setDesktopVideoPlaying((prev) => !prev);
    setIsMuted(false);
    setVideoKey((prev) => prev + 1);
  };

  /* ================= SEARCH ================= */
  const handleSearch = async (text = query) => {
    const trimmed = text.trim();

    // 🔥 If empty → clear and stop everything
    if (!trimmed) {
      if (controllerRef.current) {
        controllerRef.current.abort();
      }
      setResults([]);
      return;
    }

    // 🔥 Cancel previous request
    if (controllerRef.current) {
      controllerRef.current.abort();
    }

    const controller = new AbortController();
    controllerRef.current = controller;

    try {
      setLoading(true);

      const res = await fetch(
        `/api/search?q=${trimmed}&propertyType=${propertyType}`,
        { signal: controller.signal }
      );

      const data = await res.json();

      // 🔥 Double check input still same
      if (trimmed === query.trim()) {
        setResults(Array.isArray(data) ? data : []);
      }

    } catch (err) {
      if (err.name !== "AbortError") {
        console.error("Search error", err);
      }
    } finally {
      setLoading(false);
    }
  };

  /* ================= AUTO SLIDER ================= */
  useEffect(() => {
    if (!hero?.images?.length || hero.images.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) =>
        prev === hero.images.length - 1 ? 0 : prev + 1
      );
    }, 4000);

    return () => clearInterval(interval);
  }, [hero?.images]);

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

  /* ================= HERO BACKGROUND ================= */
  const renderHeroBackground = () => {
    if (!hero?.images?.length) return null;

    return hero.images.map((img, index) => {
      const imageUrl = img?.url;

      return (
        <div
          key={`${imageUrl}-${index}`}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide ? "opacity-100 z-[15]" : "opacity-0 z-0"
          }`}
        >
          {imageUrl && (
            <Image
              src={imageUrl}
              alt={`Hero ${index + 1}`}
              fill
              sizes="100vw"
              className="object-contain md:object-cover object-center"
              priority={index === 0}
            />
          )}
        </div>
      );
    });
  };

  return (
    <section className="relative w-full   ">
      {/* HERO CONTAINER */}
      <div className="relative w-full h-[304px] sm:h-[304px] md:h-[450px] sm:mb-20 overflow-hidden sticky top-0 z-[20]">
        <div
          className="absolute inset-0 z-[25] cursor-pointer "
          onClick={handleHeroImageClick}
        >
          {renderHeroBackground()}
        </div>

        <button
          onClick={goPrev}
          className="absolute left-6 top-1/2 -translate-y-1/2 z-[60] text-white"
        >
          <ChevronLeft size={40} />
        </button>

        <button
          onClick={goNext}
          className="absolute right-6 top-1/2 -translate-y-1/2 z-[60] text-white"
        >
          <ChevronRight size={40} />
        </button>

        {/* DESKTOP VIDEO */}
           {hero?.videoUrl && desktopVideoPlaying && (
          <div className="absolute hidden md:flex items-center justify-end pr-8 z-[200] pt-14 right-10 bottom-20">
            <div
              className="relative rounded-3xl overflow-hidden bg-black shadow-2xl"
              style={{ width: VIDEO_SIZES.desktop.width, height: VIDEO_SIZES.desktop.height }}
            >
              <button
                onClick={toggleDesktopVideo}
                className="absolute top-2 right-2 z-50 bg-white p-2 rounded-xl"
              >
                <FiX />
              </button>

              <button
                onClick={() => setIsMuted(prev => !prev)}
                className="absolute bottom-2 left-2 z-50 bg-white px-2 py-1 text-xs rounded-lg"
              >
                {isMuted ? "Unmute 🔊" : "Mute 🔇"}
              </button>

              <iframe
                key={videoKey}
                className="w-full h-full"
                src={getVideoUrl()}
                allow="autoplay; encrypted-media"
                allowFullScreen
              />
            </div>
          </div>
        )}

        {/* DESKTOP PLAY BUTTON */}
        {hero?.videoUrl && !desktopVideoPlaying && (
          <div className="absolute hidden md:flex items-center justify-end pr-8 z-[200] pt-14 right-10 bottom-20">
            <button
              onClick={() => {
                setDesktopVideoPlaying(true);
                setVideoKey(prev => prev + 1);
              }}
              className="h-14 w-14 rounded-2xl bg-white shadow-2xl flex items-center justify-center hover:scale-105 transition"
            >
              <svg
                viewBox="0 0 24 24"
                className="h-7 w-7 text-red-600"
                fill="currentColor"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
            </button>
          </div>
        )}


        {/* MOBILE VIDEO */}
        {playMobileVideo && hero?.videoUrl && (
          <div className="md:hidden absolute inset-0 z-[80] bg-black/80 flex items-start justify-center py-2">
            <button
              onClick={() => setPlayMobileVideo(false)}
              className="absolute top-4 right-4 text-white text-2xl z-[90]"
            >
              ✕
            </button>

            <div
              className="relative"
              style={{
                width: "85%",
                maxWidth: VIDEO_SIZES.mobile.maxWidth,
                height: VIDEO_SIZES.mobile.height,
              }}
            >
              <iframe
                key={videoKey}
                className="w-full h-full rounded-2xl"
                src={getVideoUrl()}
                allow="autoplay; encrypted-media"
                allowFullScreen
              />
            </div>
          </div>
        )}

        {!playMobileVideo && hero?.videoUrl && (
          <div className="md:hidden absolute right-4 bottom-20 z-[100] mb-5">
            <button
              onClick={() => setPlayMobileVideo(true)}
              className="h-12 w-12 rounded-2xl bg-white shadow-2xl flex items-center justify-center"
            >
              ▶
            </button>
          </div>
        )}
      </div>

      {/* SEARCH BAR */}
       <div className="absolute left-1/2 -translate-x-1/2 top-[380px] max-sm:top-[200px] w-full max-w-[990px] px-4 z-30">
        <div className="bg-white rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.15)] px-4 sm:px-6 pt-4 pb-5">
          <div className="mb-4 flex flex-col md:flex-row items-center justify-between gap-3">
            <h2 className="text-sm sm:text-base font-semibold text-gray-800">
              Find your perfect home with <span className="text-[#DBA40D]">Neev Realty</span>
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
                    router.push(tab.value === "residential" ? "/residential" : "/commercial");
                  }}
                  className={`rounded-full px-4 py-1 text-xs sm:text-sm font-medium transition-all ${propertyType === tab.value
                    ? "bg-white shadow-md text-gray-900"
                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-200"
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
                const value = e.target.value;
                setQuery(value);
                handleSearch(value);
              }}

              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="flex-1 bg-transparent text-xs sm:text-sm outline-none placeholder-gray-500"
              placeholder="Search by City, Locality, or Project"
            />
            <button
              onClick={() => handleSearch()}
              className="bg-[#DBA40D] hover:bg-[#c8950b] px-6 py-2.5 rounded-xl text-white text-xs sm:text-sm font-semibold flex items-center gap-2 shadow-md hover:shadow-lg transition-all duration-200"
              disabled={loading}
            >
              <FiSearch />
              <span>{loading ? "Searching..." : "Search"}</span>
            </button>
          </div>

          {results.length > 0 && (
            <div className="absolute left-0 right-0 top-full mt-2 bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-4 z-50 border border-gray-100 max-h-[300px] overflow-y-auto">
              <ul className="space-y-2">
                {results.map((item) => (
                  <li
                    key={item.objectID || item.id}
                    onClick={() => {
                      router.push(`/residential/${item.id || item.slug}`);
                      setResults([]);
                      setQuery("");
                    }}
                    className="cursor-pointer rounded-xl px-4 py-3 hover:bg-gray-50 transition-all duration-200 border-b border-gray-100 last:border-b-0 flex items-center gap-3"
                  >
                    <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                      <Image
                        src={item.mainImage?.url || "/placeholder.jpg"}
                        alt={item.title}
                        width={40}
                        height={40}
                        className="object-cover"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-gray-900 truncate">{item.title}</p>
                      <p className="text-xs text-gray-500 truncate">{item.location}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="mt-6 flex gap-2 overflow-x-auto pb-2 sm:pb-0">
          {TAGS.map((tag) => {
            const slug = tag.toLowerCase().replace(/ /g, "-");
            return (
              <button
                key={tag}
                onClick={() => router.push(`/${slug}`)}
                className="whitespace-nowrap rounded-2xl border-2 border-gray-200 px-4 py-2 text-xs bg-white hover:bg-gray-50 hover:border-[#DBA40D] hover:text-[#DBA40D] shadow-sm hover:shadow-md transition-all duration-200 flex-shrink-0"
              >
                {tag}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
