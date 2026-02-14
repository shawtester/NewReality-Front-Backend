"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { FiMapPin, FiSearch, FiX } from "react-icons/fi";
import { toast } from "react-hot-toast";
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

const DEFAULT_VIDEO = "https://www.youtube.com/embed/4jnzf1yj48M?autoplay=1&mute=1";

const VIDEO_SIZES = {
  desktop: { width: "172px", height: "300px" },
  mobile: { maxWidth: "174px", height: "300px" }
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
  const [desktopVideoPlaying, setDesktopVideoPlaying] = useState(true);
  const [videoKey, setVideoKey] = useState(0);

  /* ================= FETCH HERO ================= */
  useEffect(() => {
    const fetchHero = async () => {
      try {
        const res = await getHero();
        console.log("🔍 Hero data:", res);
        if (res) {
          if (res.images && Array.isArray(res.images)) {
            res.images = res.images.filter(img => {
              if (typeof img === 'string') return img.trim() !== '';
              return img?.url && typeof img.url === 'string';
            });
            console.log("🖼️ Valid images:", res.images.length);
          } else {
            res.images = [];
          }
          setHero(res);
          setDesktopVideoPlaying(true);
          setVideoKey(0);
        }
      } catch (error) {
        console.error(" Hero fetch failed:", error);
      }
    };
    fetchHero();
  }, []);

  /* ================= HERO IMAGE CLICK HANDLER ================= */
  const handleHeroImageClick = useCallback(() => {
    console.log("🖱️ HERO CLICKED!");
    const currentImage = hero?.images?.[currentSlide];
    let link;

    if (typeof currentImage === 'string') {
      link = hero?.imageLinks?.[currentImage];
    } else {
      link = currentImage?.link;
    }

    console.log("🔗 Current slide:", currentSlide, "Image:", currentImage);
    console.log("🔗 Link:", link);

    if (link) {
      window.open(link, '_blank', 'noopener,noreferrer');
    }
  }, [hero, currentSlide]);

  /* ================= SAFE STRING HELPER ================= */
  const safeSlice = (value) => {
    if (typeof value !== 'string') return 'Not a string';
    return value.slice(-50);
  };

  /* ================= VIDEO URL ================= */
  const getVideoUrl = () => {
    if (!hero?.videoUrl) return DEFAULT_VIDEO;
    
    if (hero?.mediaType === "instagram") {
      return hero.videoUrl;
    } else {
      const idMatch = hero.videoUrl.match(/embed\/([^?]+)/) ||
                     hero.videoUrl.match(/v=([^&]+)/) ||
                     hero.videoUrl.match(/youtu\.be\/([^?]+)/);
      const videoId = idMatch?.[1];
      return videoId
        ? `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&start=0`
        : `${hero.videoUrl}?autoplay=1&mute=1&start=0`;
    }
  };

  /* ================= INSTAGRAM RELOAD ================= */
  const reloadInstagram = () => {
    if (window?.instgrm) {
      setTimeout(() => {
        window.instgrm.Embeds.process();
      }, 500);
    } else {
      const script = document.createElement("script");
      script.src = "https://www.instagram.com/embed.js";
      script.async = true;
      document.body.appendChild(script);
    }
  };

  /* ================= TOGGLE VIDEO ================= */
  const toggleDesktopVideo = () => {
    if (desktopVideoPlaying) {
      setDesktopVideoPlaying(false);
    } else {
      setVideoKey(prev => prev + 1);
      setDesktopVideoPlaying(true);
      setTimeout(() => {
        if (hero?.mediaType === "instagram") {
          reloadInstagram();
        }
      }, 100);
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

  /* ================= SEARCH ================= */
  const handleSearch = async (text = query) => {
    if (!text.trim()) {
      setResults([]);
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`/api/search?q=${text}&propertyType=${propertyType}`);
      const data = await res.json();
      setResults(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Search error", err);
    } finally {
      setLoading(false);
    }
  };

  /* ================= HERO BACKGROUND RENDER - NO FALLBACK ================= */
  const renderHeroBackground = () => {
    if (!hero?.images?.length) {
      return null; // 🔥 NO FALLBACK IMAGE
    }

    return hero.images.map((img, index) => {
      const imageUrl = typeof img === 'string' ? img : img?.url;
      
      return (
        <div
          key={`${imageUrl}-${index}`}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide ? "opacity-100 z-[15]" : "opacity-0 z-0"
          }`}
        >
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={`Hero ${index + 1}`}
              fill
              sizes="100vw"
              className="object-cover"
              priority={index === 0}
              onLoad={() => console.log(`✅ Hero image loaded: ${safeSlice(imageUrl)}`)}
            />
          ) : null}
        </div>
      );
    });
  };

  return (
    <section className="relative w-full">
      {/* ================= HERO CONTAINER ================= */}
      <div className="relative w-full h-[360px] sm:h-[400px] md:h-[450px] sm:mb-20 overflow-hidden">
        {/* 🔥 FIXED CLICK LAYER - z-[25] (LOWER THAN VIDEO BUTTONS) */}
        <div 
          className="absolute inset-0 z-[25] cursor-pointer group hover:scale-[1.02] transition-all duration-500 pointer-events-auto"
          onClick={handleHeroImageClick}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleHeroImageClick();
            }
          }}
          title="Click to visit project"
        >
          {renderHeroBackground()}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 z-[30] pointer-events-none flex items-end pb-8 px-6" />
        </div>

        {/* ================= DESKTOP YOUTUBE VIDEO ================= */}
        {hero?.videoUrl && hero?.mediaType === "youtube" && desktopVideoPlaying && (
          <div className="absolute inset-0 hidden md:flex items-center justify-end pr-8 z-[60] pt-14 right-10 bottom-20 pointer-events-none">
            <div 
              className="relative group rounded-3xl overflow-hidden bg-black/30 backdrop-blur-md shadow-2xl border border-white/20"
              style={{ width: VIDEO_SIZES.desktop.width, height: VIDEO_SIZES.desktop.height }}
            >
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  toggleDesktopVideo();
                }}
                className="absolute -top-1 -right-1 z-[75] bg-white/90 hover:bg-white text-gray-800 p-1.5 rounded-2xl shadow-2xl border border-white/50 opacity-0 group-hover:opacity-100 transition-all duration-300 w-9 h-9 flex items-center justify-center hover:scale-105 pointer-events-auto"
                title="Close video"
              >
                <FiX className="w-4 h-4" />
              </button>
              <iframe
                key={`youtube-${videoKey}`}
                className="w-full h-full rounded-3xl"
                src={getVideoUrl()}
                allow="autoplay; encrypted-media; picture-in-picture"
                allowFullScreen
                title="Desktop Video"
              />
            </div>
          </div>
        )}

        {/* ================= DESKTOP INSTAGRAM VIDEO ================= */}
        {hero?.videoUrl && hero?.mediaType === "instagram" && desktopVideoPlaying && (
          <div className="absolute inset-0 hidden md:flex items-center justify-end pr-8 z-[60] right-20 bottom-10 group pointer-events-none">
            <div 
              className="relative rounded-3xl overflow-hidden bg-white/10 backdrop-blur-md shadow-2xl border-2 border-white/30"
              style={{ width: "320px", height: "280px" }}
            >
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  toggleDesktopVideo();
                }}
                className="absolute top-2 right-2 z-[75] bg-white hover:bg-gray-50 text-gray-800 p-1.5 rounded-2xl shadow-xl border border-white/50 opacity-0 group-hover:opacity-100 transition-all duration-300 w-8 h-8 flex items-center justify-center hover:scale-105 pointer-events-auto"
                title="Close video"
              >
                <FiX className="w-4 h-4" />
              </button>
              <blockquote
                key={`insta-${videoKey}`}
                className="instagram-media w-full h-full rounded-3xl overflow-hidden"
                data-instgrm-permalink={hero.videoUrl}
                data-instgrm-version="14"
              />
            </div>
          </div>
        )}

        {/* 🔥 DESKTOP PLAY ICON - FULLY CLICKABLE z-[70] */}
        {hero?.videoUrl && !desktopVideoPlaying && (
          <div className="absolute inset-0 hidden md:flex items-center justify-end pr-8 z-[70] pt-14 right-10 bottom-20 pointer-events-none">
            <button
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                toggleDesktopVideo();
              }}
              className="h-14 w-14 rounded-2xl bg-white/95 backdrop-blur-md shadow-2xl flex items-center justify-center hover:shadow-3xl transition-all duration-300 hover:-translate-y-1 hover:scale-105 border-4 border-white/50 group z-[75] pointer-events-auto"
              aria-label="Play video"
              title="Play video"
            >
              <svg viewBox="0 0 24 24" className="h-7 w-7 text-red-600 group-hover:scale-110 transition-transform duration-200" fill="currentColor">
                <path d="M23.5 6.2s-.2-1.7-.9-2.4c-.8-.9-1.7-.9-2.1-1C17.7 2.5 12 2.5 12 2.5s-5.7 0-8.5.3c-.4.1-1.3.1-2.1 1C.7 4.5.5 6.2.5 6.2S0 8.1 0 10v1.9c0 1.9.5 3.8.5 3.8s.2 1.7.9 2.4c-.8-.9 1.9.9 2.4 1 1.7.2 7.2.3 7.2.3s5.7 0 8.5-.3c-.4-.1 1.3-.1 2.1-1 .7-.7.9-2.4.9-2.4s.5-1.9.5-3.8V10c0-1.9-.5-3.8-.5-3.8zM9.5 13.5V7.5l6 3-6 3z" />
              </svg>
            </button>
          </div>
        )}

        {/* ================= MOBILE PLAY BUTTON ================= */}
        {!playMobileVideo && hero?.videoUrl && (
          <div className="md:hidden absolute right-4 bottom-40 z-[65] pointer-events-auto">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setPlayMobileVideo(true);
              }}
              className="h-12 w-12 rounded-2xl bg-white shadow-2xl flex items-center justify-center hover:shadow-3xl transition-all duration-200 hover:-translate-y-1"
              aria-label="Play video"
            >
              <svg viewBox="0 0 24 24" className="h-7 w-7 text-red-600" fill="currentColor">
                <path d="M23.5 6.2s-.2-1.7-.9-2.4c-.8-.9-1.7-.9-2.1-1C17.7 2.5 12 2.5 12 2.5s-5.7 0-8.5.3c-.4.1-1.3.1-2.1 1C.7 4.5.5 6.2.5 6.2S0 8.1 0 10v1.9c0 1.9.5 3.8.5 3.8s.2 1.7.9 2.4c-.8-.9 1.9.9 2.4 1 1.7.2 7.2.3 7.2.3s5.7 0 8.5-.3c-.4-.1 1.3-.1 2.1-1 .7-.7.9-2.4.9-2.4s.5-1.9.5-3.8V10c0-1.9-.5-3.8-.5-3.8zM9.5 13.5V7.5l6 3-6 3z" />
              </svg>
            </button>
          </div>
        )}

        {/* ================= MOBILE VIDEO ================= */}
        {playMobileVideo && hero?.videoUrl && (
          <div className="md:hidden absolute inset-0 z-[80] bg-black/80 flex items-center justify-center px-4">
            <button
              onClick={() => setPlayMobileVideo(false)}
              className="absolute top-6 right-16 z-[85] h-8 w-8 rounded-2xl bg-black/90 text-white flex items-center justify-center shadow-2xl hover:bg-white hover:text-black transition-all duration-200 hover:scale-110 text-xl font-bold pointer-events-auto"
              aria-label="Close video"
            >
              ✕
            </button>
            <div 
              className="rounded-3xl overflow-hidden bg-black shadow-2xl border-4 border-white/30"
              style={{ width: `min(90vw, ${VIDEO_SIZES.mobile.maxWidth})`, height: VIDEO_SIZES.mobile.height }}
            >
              <iframe
                className="w-full h-full rounded-3xl"
                src={getVideoUrl()}
                allow="autoplay; encrypted-media"
                allowFullScreen
                title="Mobile Hero Video"
              />
            </div>
          </div>
        )}
      </div>

      {/* ================= SEARCH BAR ================= */}
      <div className="absolute left-1/2 -translate-x-1/2 top-[380px] max-sm:top-[280px] w-full max-w-[990px] px-4 z-30">
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
                  className={`rounded-full px-4 py-1 text-xs sm:text-sm font-medium transition-all ${
                    propertyType === tab.value
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
