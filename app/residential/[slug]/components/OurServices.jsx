"use client";

import React, { useRef } from "react";
import Image from "next/image";

export default function OurServices({ services = [] }) {
  const scrollRef = useRef(null);

  if (!services.length) return null;

  const scrollLeft = () => {
    scrollRef.current?.scrollBy({ left: -300, behavior: "smooth" });
  };

  const scrollRight = () => {
    scrollRef.current?.scrollBy({ left: 300, behavior: "smooth" });
  };

  return (
    <section className="bg-white">
      <div className="max-w-[1240px] mx-auto px-4 py-10">

        {/* HEADING */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <h2 className="text-3xl font-semibold text-gray-900">
            Our <span className="text-[#F5A300]">Services</span>
          </h2>
          <p className="mt-4 text-sm text-gray-600">
            Whether you are searching for a home, a commercial space, or a high-potential
            investment, we offer expert guidance at every step.
          </p>
        </div>

        {/* MOBILE VIEW */}
        <div className="lg:hidden relative mb-8 px-8">
          <button
            onClick={scrollLeft}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-20 h-9 w-9 rounded-full bg-white shadow border text-lg"
          >
            ‹
          </button>

          <button
            onClick={scrollRight}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-20 h-9 w-9 rounded-full bg-white shadow border text-lg"
          >
            ›
          </button>

          <div
            ref={scrollRef}
            className="flex gap-4 overflow-x-auto scrollbar-hide pb-3 snap-x snap-mandatory"
          >
            {services.map((item, i) => (
              <div
                key={i}
                className="flex-shrink-0 w-[300px] snap-center bg-white rounded-xl border shadow-sm p-6"
              >
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-[#DBA40D]">
                  <Image src={item.icon} alt="" width={26} height={26} />
                </div>

                <h3 className="text-base font-semibold mb-3">{item.title}</h3>
                <p className="text-sm text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* DESKTOP GRID */}
        <div className="hidden lg:grid grid-cols-3 gap-8">
          {services.map((item, i) => (
            <div
              key={i}
              className="bg-white rounded-xl border shadow-sm p-6"
            >
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-lg bg-[#DBA40D]">
                <Image src={item.icon} alt="" width={22} height={22} />
              </div>

              <h3 className="text-sm font-semibold mb-2">{item.title}</h3>
              <p className="text-xs text-gray-600">{item.desc}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
