"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getActiveCareerSliderImages } from "@/lib/firestore/career_slider/read";

const AUTOPLAY_DELAY = 3000;

const LifeAtNeev = () => {
  const [images, setImages] = useState([]);
  const [current, setCurrent] = useState(0);
  const intervalRef = useRef(null);

  /* 🔥 FETCH IMAGES FROM FIRESTORE */
  useEffect(() => {
    const fetchImages = async () => {
      try {
        const data = await getActiveCareerSliderImages();
        console.log("CAREER SLIDER IMAGES 👉", data);
        setImages(data || []);
      } catch (err) {
        console.error("LifeAtNeev error:", err);
      }
    };

    fetchImages();
  }, []);

  const goToNext = () => {
    setCurrent((prev) =>
      prev === images.length - 1 ? 0 : prev + 1
    );
  };

  const goToPrev = () => {
    setCurrent((prev) =>
      prev === 0 ? images.length - 1 : prev - 1
    );
  };

  const resetAutoplay = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(goToNext, AUTOPLAY_DELAY);
  };

  /* ✅ autoplay ONLY after images load */
  useEffect(() => {
    if (!images.length) return;

    resetAutoplay();
    return () => clearInterval(intervalRef.current);
  }, [images]);

  const handleNext = () => {
    goToNext();
    resetAutoplay();
  };

  const handlePrev = () => {
    goToPrev();
    resetAutoplay();
  };

  /* ✅ LOADING STATE (IMPORTANT FIX) */
  if (!images.length) {
    return (
      <section className="w-full bg-white py-16 text-center text-gray-400">
        Loading Life at Neev...
      </section>
    );
  }

  return (
    <section className="w-full bg-white py-16">
      <div className="mx-auto max-w-6xl space-y-12 px-4 lg:px-0">

        {/* TOP CARDS (UNCHANGED UI) */}
        <div className="grid gap-6 md:grid-cols-3">
          {[
            {
              title: "Client - Centric Approach",
              text:
                "We provide building long-lasting relationship by offering personalized solutions tailored to your unique needs.",
            },
            {
              title: "Expertise Across the Spectrum",
              text:
                "Our team consists of seasoned real estate professionals with years of experience in buying, selling and managing properties.",
            },
            {
              title: "Driven By Innovation",
              text:
                "We stay ahead of the curve with modern tools, market trends and insights to deliver exceptional results.",
            },
          ].map((item, i) => (
            <div
              key={i}
              className="rounded-2xl bg-white shadow-[0_10px_35px_rgba(15,23,42,0.08)] px-8 py-7"
            >
              <h3 className="mb-3 text-lg font-semibold text-slate-900">
                {item.title}
              </h3>
              <p className="text-sm leading-relaxed text-slate-500">
                {item.text}
              </p>
            </div>
          ))}
        </div>

        {/* SLIDER + TEXT (UNCHANGED UI) */}
        <div className="grid items-center gap-10 rounded-3xl bg-slate-50 px-6 py-10 md:grid-cols-[1.3fr_1fr] md:px-10 lg:px-16">

          {/* SLIDER */}
          <div className="flex justify-center">
            <div className="relative w-full max-w-xl h-[300px] overflow-hidden rounded-3xl bg-black/5 shadow-[0_20px_50px_rgba(15,23,42,0.1)] md:h-[380px]">
              <Image
                src={images[current]}
                alt="Life at Neev Realty"
                width={800}
                height={450}
                className="h-full w-full object-cover transition-all duration-500"
                priority
              />

              <button
                onClick={handlePrev}
                className="absolute left-4 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-white shadow"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>

              <button
                onClick={handleNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-white shadow"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* TEXT */}
          <div className="space-y-4">
            <h2 className="text-3xl font-semibold text-slate-900 md:text-4xl">
              Life at <span className="text-[#DBA40D]">Neev Realty</span>
            </h2>
            <p className="text-sm leading-relaxed text-slate-500 max-w-sm">
              We believe in teamwork, transparency and continuous growth. At Neev
              Realty, your ideas matter and your career grows with the organization.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LifeAtNeev;
