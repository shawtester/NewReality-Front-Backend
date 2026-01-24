"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { FiMapPin, FiSearch, FiMic } from "react-icons/fi";
import { CiGlobe } from "react-icons/ci";

import { getHero } from "@/lib/firestore/hero/read";

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
  const [activeTab, setActiveTab] = useState("Residential");
  const [query, setQuery] = useState("");

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

  return (
    <section className="relative w-full">
      {/* ================= HERO ================= */}
      <div className="relative w-full h-[360px] sm:h-[400px] md:h-[450px] overflow-hidden">
        <Image
          src={heroImage}
          alt="Hero"
          fill
          priority
          className="object-cover"
        />

        {/* ================= DESKTOP VIDEO ================= */}
        {showVideo && hero?.videoUrl && (
          <div className="absolute inset-0 z-20 hidden md:flex items-center justify-center">
            <div className="absolute right-10 top-1/2 -translate-y-1/2 w-[280px] h-[300px]">
              <button
                onClick={() => setShowVideo(false)}
                className="absolute -top-3 -right-3 z-30 h-9 w-9 rounded-full bg-black text-white"
              >
                ✕
              </button>

              <iframe
                className="w-full h-full rounded-2xl shadow-2xl"
                src={videoUrl}
                allow="autoplay; encrypted-media"
                allowFullScreen
              />
            </div>
          </div>
        )}

        {/* ================= MOBILE YOUTUBE ICON ================= */}
        {!playMobileVideo && hero?.videoUrl && (
          <div className="md:hidden absolute right-3 bottom-12 z-30">
            <button
              onClick={() => setPlayMobileVideo(true)}
              className="h-11 w-11 rounded-full bg-white shadow-lg flex items-center justify-center"
            >
              <svg
                viewBox="0 0 24 24"
                className="h-6 w-6 text-red-600"
                fill="currentColor"
              >
                <path d="M23.5 6.2s-.2-1.7-.9-2.4c-.8-.9-1.7-.9-2.1-1C17.7 2.5 12 2.5 12 2.5s-5.7 0-8.5.3c-.4.1-1.3.1-2.1 1C.7 4.5.5 6.2.5 6.2S0 8.1 0 10v1.9c0 1.9.5 3.8.5 3.8s.2 1.7.9 2.4c.8.9 1.9.9 2.4 1 1.7.2 7.2.3 7.2.3s5.7 0 8.5-.3c.4-.1 1.3-.1 2.1-1 .7-.7.9-2.4.9-2.4s.5-1.9.5-3.8V10c0-1.9-.5-3.8-.5-3.8zM9.5 13.5V7.5l6 3-6 3z" />
              </svg>
            </button>
          </div>
        )}

        {/* ================= MOBILE HERO VIDEO ================= */}
        {playMobileVideo && hero?.videoUrl && (
          <div className="md:hidden absolute inset-0 z-40 bg-black/60 flex items-center justify-center px-4">
            <button
              onClick={() => setPlayMobileVideo(false)}
              className="absolute top-2 right-4 z-50 h-9 w-9 rounded-full bg-black text-white"
            >
              ✕
            </button>

            <div className="w-[90vw] max-w-[260px] h-[300px] rounded-2xl overflow-hidden bg-black shadow-2xl">
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
      <div className="absolute left-1/2 -translate-x-1/2 top-[380px] max-sm:top-[320px] w-full max-w-[990px] px-4 z-20">
        <div className="bg-white rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.15)] px-4 sm:px-6 pt-4 pb-5">
          {/* HEADER */}
          <div className="mb-4 flex flex-col md:flex-row items-center justify-between gap-3 text-center md:text-left">
            <h2 className="text-sm sm:text-base font-semibold text-gray-800">
              Find your perfect home with{" "}
              <span className="text-[#DBA40D]">Neev Realty</span>
            </h2>

            <div className="flex rounded-full bg-gray-100">
              {["Residential", "Commercial"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`rounded-full px-4 text-xs sm:text-sm font-medium transition ${
                    activeTab === tab
                      ? "bg-white shadow text-gray-900"
                      : "text-gray-500"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* SEARCH BAR */}
          <div className="flex items-center gap-2 rounded-2xl bg-white px-3 py-2.5 max-w-[940px] mx-auto">
            <div className="flex items-center flex-1 gap-2">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-600">
                <FiMapPin />
              </span>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="flex-1 bg-transparent text-xs sm:text-sm outline-none"
                placeholder="Search by City, Locality, or Project"
              />
            </div>

            <div className="hidden sm:flex gap-2 items-center">
              <button className="h-10 w-10 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-600">
                <CiGlobe />
              </button>
              <button className="h-10 w-10 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-600">
                <FiMic />
              </button>
            </div>

            <button className="bg-[#DBA40D] px-5 py-2.5 rounded-xl text-white text-xs sm:text-sm font-semibold flex items-center gap-1.5">
              <FiSearch />
              <span className="hidden sm:inline">Search</span>
            </button>
          </div>
        </div>

        {/* TAGS */}
        <div className="mt-4 flex gap-2 overflow-x-auto pb-2">
          {TAGS.map((tag) => (
            <button
              key={tag}
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
