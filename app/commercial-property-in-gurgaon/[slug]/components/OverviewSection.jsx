"use client";

import { useState, useRef, useEffect } from "react";
import BrandEnquiryPopup from "./BrandEnquiryPopup";

/* ================= EXPANDABLE HTML TEXT ================= */
const ExpandableText = ({ html, maxLines = 1, className = "" }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const textRef = useRef(null);

  useEffect(() => {
    if (textRef.current) {
      const el = textRef.current;
      const lineHeight = parseFloat(getComputedStyle(el).lineHeight);
      const maxHeight = lineHeight * maxLines;
      setIsOverflowing(el.scrollHeight > maxHeight);
    }
  }, [html, maxLines]);

  if (!html) return null;

  return (
    <div className={`space-y-3 ${className}`}>
      <div
        ref={textRef}
        className={`
          transition-all duration-300 ease-in-out
          ${isExpanded ? "max-h-none" : `line-clamp-${maxLines}`}
          prose prose-sm max-w-none
          leading-[1.6rem] text-left

          [&_a]:pointer-events-auto
          [&_a]:text-[#F5A300]
          [&_a]:underline
          [&_a:hover]:text-yellow-600
        `}
        dangerouslySetInnerHTML={{ __html: html }}
      />

      {isOverflowing && (
        <div className="flex justify-center">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-sm text-[#F5A300] font-medium hover:text-yellow-600 transition-all duration-200 flex items-center gap-1 px-4 py-1 cursor-pointer bg-gray-50/70 rounded-full hover:bg-yellow-50 border border-yellow-100 hover:border-yellow-200"
          >
            {isExpanded ? "Read Less" : "Read More"}
            <span
              className={`w-3 h-3 border-b-2 border-r-2 transition-transform duration-200 ${
                isExpanded
                  ? "rotate-225 -translate-y-[1px]"
                  : "rotate-45 translate-y-[1px]"
              }`}
            />
          </button>
        </div>
      )}
    </div>
  );
};

/* ================= OVERVIEW SECTION ================= */
export default function OverviewSection({ overview, propertyTitle }) {
  const [openEnquiry, setOpenEnquiry] = useState(false);

  if (!overview) return null;

  return (
    <>
      {/* ================= OVERVIEW ================= */}
      <section id="overview" className="max-w-[1240px] mx-auto px-4 mt-12">
        <h2 className="text-xl font-semibold mb-4">Overview</h2>

        <div className="bg-white rounded-xl shadow-sm px-0 py-4 ">
          {/* TITLE (LEFT ALIGNED) */}
          <div className="mb-5 text-left">
            {overview.title && (
              <h2 className="text-xl md:text-xl font-semibold text-gray-900">
                {overview.title}
              </h2>
            )}
          </div>

          {/* DESCRIPTION (LEFT ALIGNED) */}
          {overview.description && (
            <div className="max-w-3xl">
              <ExpandableText
                html={overview.description}
                maxLines={3}
                className="text-sm md:text-base text-gray-600 font-light"
              />
            </div>
          )}

          {/* CTA BUTTON (CENTER) */}
          <div className="flex justify-center mt-8">
            <button
              onClick={() => setOpenEnquiry(true)}
              className="px-8 py-3 bg-[#F5A300] text-white rounded-lg text-sm font-semibold hover:bg-[#e39a00] transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
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
