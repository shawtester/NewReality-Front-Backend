"use client";

import React, { useRef } from "react";
import Link from "next/link";
import Image from "next/image";

const steps = [
  {
    title: "Personalized Consultation",
    desc: "Our experts will evaluate your real estate goals and preferences.",
    logo: "/images/aboutimg/logo1.png",
  },
  {
    title: "Curated Property Selection",
    desc: "We'll present the best options tailored to your preferences.",
    logo: "/images/aboutimg/logo2.png",
  },
  {
    title: "Immersive Property Experiences",
    desc: "Explore properties through virtual tours or in-person visits.",
    logo: "/images/aboutimg/logo3.png",
  },
  {
    title: "Comprehensive Financial Guidance",
    desc: "Get expert advice on loans, investments, and tax implications.",
    logo: "/images/aboutimg/logo4.png",
  },
  {
    title: "Seamless Transactions And Support",
    desc: "Enjoy a smooth buying process and ongoing assistance.",
    logo: "/images/aboutimg/logo5.png",
  },
];

export default function Home() {
  const scrollRef = useRef(null);

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -280, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 280, behavior: "smooth" });
    }
  };

  return (
    <main className="w-full overflow-x-hidden">

      {/* ================= HERO ================= */}
      <section className="relative w-full h-[55vh] sm:h-[65vh] lg:h-[70vh]">
        <Image
          src="/images/aboutimg/img1.jpg"
          alt="Neev Realty Banner"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />

        <div className="absolute inset-0 flex flex-col justify-center px-6 sm:px-12 lg:px-20">
          <h1 className="text-white text-3xl sm:text-4xl lg:text-6xl font-semibold max-w-2xl">
            Turning <span className="text-[#E7C873]">Dreams</span> into Reality
          </h1>

          <button className="mt-6 w-fit border border-white px-6 py-3 rounded-lg text-white hover:bg-white hover:text-black transition">
            LET US GUIDE YOUR HOME
          </button>
        </div>
      </section>

      {/* ================= WELCOME ================= */}
      <section className="max-w-6xl mx-auto px-6 py-8 text-center">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold">
          Welcome to <span className="text-[#DBA40D]">Neev Realty</span>
        </h2>
      </section>

      {/* ================= WHO WE ARE ================= */}
      <section className="max-w-6xl relative bottom-8 mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center py-16 text-center lg:text-left">
        <div>
          <h3 className="text-[36px] font-semibold leading-none relative bottom-8">
            <span className="text-[#DBA40D] text-[44px] font-bold">WHO</span>{" "}
            <span className="text-gray-900">WE ARE</span>
          </h3>

          <p className="text-[14.5px] text-gray-600 leading-[23px] max-w-[400px] mx-auto lg:mx-0">
            As a leading luxury real estate boutique firm, we offer a
            comprehensive range of solutions tailored to your specific needs.
            We specialize in brand-new projects across Delhi NCR.
            <br /><br />
            From investment portfolios to first-time home purchases, property
            sales, and loan assistance, our team of experienced advisors is
            dedicated to providing personalized solutions that meet your unique
            needs.
            <br /><br />
            Discover your real estate journey with{" "}
            <span className="font-semibold text-gray-900">Neev Realty.</span>
          </p>
        </div>

        <div className="flex justify-center">
          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:gap-0">
            {[
              "/images/aboutimg/img7.png",
              "/images/aboutimg/img8.png",
              "/images/aboutimg/img5.jpg",
              "/images/aboutimg/img10.png",
            ].map((img, i) => (
              <div
                key={i}
                className="relative w-[140px] h-[140px] sm:w-[160px] sm:h-[160px] md:w-[180px] md:h-[180px] xl:w-[220px] xl:h-[220px] overflow-hidden rounded-full"
              >
                <Image src={img} alt="" fill className="object-cover" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= 5 STEPS ================= */}
      <section className="max-w-7xl mx-auto px-6 py-10">
        <h2 className="text-center text-3xl sm:text-4xl lg:text-5xl mb-6">
          <span className="text-[#DBA40D] font-semibold">5 Steps</span> to Your Dream Home
        </h2>

        <div className="lg:hidden relative px-8">
          <button onClick={scrollLeft} className="absolute left-2 top-1/2">‹</button>
          <button onClick={scrollRight} className="absolute right-2 top-1/2">›</button>

          <div
            ref={scrollRef}
            className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory"
          >
            {steps.map((step) => (
              <div
                key={step.title}
                className="flex-shrink-0 w-[260px] snap-center rounded-lg p-5 text-center bg-white border"
              >
                <Image src={step.logo} alt={step.title} width={36} height={36} className="mx-auto mb-3" />
                <h3 className="font-semibold text-sm">{step.title}</h3>
                <p className="text-xs text-gray-600">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
