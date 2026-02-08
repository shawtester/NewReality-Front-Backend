"use client";

import { useRef } from "react";
import Image from "next/image";

const services = [
  {
    title: "One-Stop Real Estate Solution",
    desc: "From property selection to site visits, home loans, legal checks, and documentation—everything is handled under one roof.",
    icon: "/images/chooseimg/logo01.png",
  },
  {
    title: "Fully Transparent Process",
    desc: "No hidden costs. No surprises. Every detail—from pricing to paperwork—is shared clearly for complete peace of mind.",
    icon: "/images/chooseimg/logo02.png",
  },
  {
    title: "Expert Real Estate Advisors",
    desc: "Our advisors recommend the best properties based on your budget, location preference, lifestyle needs, and investment goals.",
    icon: "/images/chooseimg/logo03.png",
  },
  {
    title: "Site Visit Assistance",
    desc: "We offer guided site visits with complete project insights to help you make informed decisions.",
    icon: "/images/chooseimg/logo04.png",
  },
  {
    title: "Home Loan Consultation",
    desc: "We help you secure the best loan options, manage documents, and get faster approvals with our banking partners.",
    icon: "/images/chooseimg/logo05.png",
  },
  {
    title: "After-Sales Assistance",
    desc: "Our support continues even after the booking. We assist with builder coordination, payment updates, agreements, and possession guidance.",
    icon: "/images/chooseimg/logo06.png",
  },
];

export default function OurServices() {
  const scrollRef = useRef(null);

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -300, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 300, behavior: "smooth" });
    }
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
            Whether you are searching for a home, a commercial space, or a
            high-potential investment, Neev Realty offers expert guidance at every step.
          </p>
        </div>

        {/* MOBILE SCROLL VIEW - BUTTONS REMOVED */}
        <div className="lg:hidden mb-8">
          <div
            ref={scrollRef}
            className="flex gap-4 overflow-x-auto scrollbar-hide pb-3 snap-x snap-mandatory px-8"
          >
            {services.map((item) => (
              <div
                key={item.title}
                className="flex-shrink-0 w-[300px] snap-center bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all p-6"
              >
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-[#DBA40D]">
                  <Image src={item.icon} alt="" width={26} height={26} />
                </div>

                <h3 className="text-base font-semibold text-gray-900 mb-3">
                  {item.title}
                </h3>

                <p className="text-sm text-gray-600 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* DESKTOP GRID */}
        <div className="hidden lg:grid grid-cols-3 gap-8">
          {services.map((item) => (
            <div
              key={item.title}
              className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition p-6"
            >
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-lg bg-[#DBA40D]">
                <Image src={item.icon} alt="" width={22} height={22} />
              </div>

              <h3 className="text-sm font-semibold text-gray-900 mb-2">
                {item.title}
              </h3>

              <p className="text-xs text-gray-600 leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
