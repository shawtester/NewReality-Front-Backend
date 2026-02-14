"use client";

import { useRef } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";


export default function Testimonial({ testimonials = [] }) {
  const scrollRef = useRef(null);
  const scrollLeft = () => {
    scrollRef.current?.scrollBy({ left: -350, behavior: "smooth" });
  };

  const scrollRight = () => {
    scrollRef.current?.scrollBy({ left: 350, behavior: "smooth" });
  };

  if (!testimonials.length) return null;

  return (
    <section className="bg-[#F7F9FC] sm:py-10 -mt-8 sm:-mt-10 lg:-mt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-6 p-4">

        {/* Heading */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-gray-900">
            What Our Clients Say{" "}
            <span className="text-[#DBA40D]">About Us</span>
          </h2>
          <p className="mt-4 text-gray-500 max-w-2xl mx-auto text-sm sm:text-base">
            Real stories from families and investors who trusted Livora.
          </p>
        </div>

        {/* Slider */}
        <div className="relative">
          <button
            onClick={scrollLeft}
            className="absolute -left-6 top-1/2 -translate-y-1/2 z-20 text-gray-400 hover:text-gray-800 transition"
          >
            <ChevronLeft size={40} />
          </button>
          <div
            ref={scrollRef}
            className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth pb-1 px-2"
          >

            {testimonials.map((item) => (
              <article
                key={item.id}
                className="w-[85%] sm:w-[70%] lg:w-[32%] flex-shrink-0
                         bg-white rounded-2xl border border-gray-200
                         shadow-sm p-6 flex flex-col"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="relative w-12 h-12 rounded-full overflow-hidden bg-gray-100">
                    {/* ✅ BACKEND IMAGE ONLY */}
                    {item.avatar && (
                      <Image
                        src={item.avatar}
                        alt={item.name || "Client"}
                        fill
                        className="object-cover"
                      />
                    )}
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {item.name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {item.role}
                    </p>
                  </div>
                </div>

                <p className="text-sm text-gray-600 leading-relaxed flex-1">
                  {item.quote}
                </p>

                {/* ⭐ Rating */}
                <div className="flex gap-1 mt-6">
                  {Array.from({ length: 5 }).map((_, idx) => {
                    const rating = item.rating ?? 5;

                    return (
                      <span
                        key={idx}
                        className={`text-lg ${idx < rating
                          ? "text-[#DBA40D]"
                          : "text-gray-300"
                          }`}
                      >
                        ★
                      </span>
                    );
                  })}
                </div>
              </article>
            ))}
          </div>
          <button
            onClick={scrollRight}
            className="absolute -right-6 top-1/2 -translate-y-1/2 z-20 text-gray-400 hover:text-gray-800 transition"
          >
            <ChevronRight size={40} />
          </button>

        </div>
      </div>
    </section>
  );
}
