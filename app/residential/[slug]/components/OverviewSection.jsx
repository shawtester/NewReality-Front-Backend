"use client";

import { useState } from "react";
import BrandEnquiryPopup from "./BrandEnquiryPopup";

export default function OverviewSection({ overview, propertyTitle }) {
  const [openEnquiry, setOpenEnquiry] = useState(false);

  // Agar overview hi nahi hai → section mat dikhao
  if (!overview) return null;

  return (
    <>
      {/* ================= OVERVIEW ================= */}
      <section id="overview" className="max-w-[1240px] mx-auto px-4 mt-12">
        <h3 className="text-xl font-semibold mb-4">Overview</h3>

        <div className="bg-white rounded-xl shadow-sm p-8 text-center">

          {/* TITLE */}
          {overview.title && (
            <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-4">
              {overview.title}

              {overview.subtitle && (
                <span className="block text-base font-normal mt-1">
                  {overview.subtitle}
                </span>
              )}
            </h2>
          )}

          {/* DESCRIPTION */}
          {overview.description && (
            <p className="text-sm md:text-base text-gray-600 max-w-[900px] mx-auto leading-relaxed">
              {overview.description}
            </p>
          )}

          {/* CTA BUTTON */}
          <div className="mt-6">
            <button
              onClick={() => setOpenEnquiry(true)}
              className="px-6 py-2 bg-[#F5A300] text-white rounded-md text-sm font-medium hover:bg-[#e39a00] transition"
            >
              Enquire Now
            </button>
          </div>
        </div>
      </section>

      {/* POPUP */}
      <BrandEnquiryPopup
        open={openEnquiry}
        onClose={() => setOpenEnquiry(false)}
        propertyTitle={propertyTitle}
      />
    </>
  );
}
