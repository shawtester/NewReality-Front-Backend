"use client";

import { useState, useRef, useEffect } from "react";
import BrandEnquiryPopup from "./BrandEnquiryPopup";

// ✅ FIXED FOR 1 LINE + EXPAND
const ExpandableText = ({ children: text, maxLines = 1, className = "" }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [isOverflowing, setIsOverflowing] = useState(false);
    const textRef = useRef(null);

    const checkOverflow = () => {
        if (textRef.current) {
            const element = textRef.current;
            const lineHeight = parseFloat(getComputedStyle(element).lineHeight);
            const maxHeight = lineHeight * maxLines;
            const hasOverflow = element.scrollHeight > maxHeight || text.length > 80;
            setIsOverflowing(hasOverflow);
        }
    };

    useEffect(() => {
        const timeoutId = setTimeout(checkOverflow, 50);
        return () => clearTimeout(timeoutId);
    }, [text]);

    const toggleExpanded = () => {
        setIsExpanded(!isExpanded);
    };

    const shouldShowButton = isOverflowing || text.length > 60; // Always show for overview

    return (
        <div className={`space-y-3 ${className}`}>
            <div
                ref={textRef}
                className={`
                    transition-all duration-300 ease-in-out
                    ${isExpanded 
                        ? 'max-h-none overflow-visible' 
                        : 'max-h-[1.6em] overflow-hidden line-clamp-1'
                    }
                    leading-[1.4rem] text-left break-words
                `}
                style={{
                    display: '-webkit-box',
                    WebkitLineClamp: isExpanded ? 'unset' : 1,
                    WebkitBoxOrient: 'vertical',
                    wordBreak: 'break-word',
                }}
            >
                {text}
            </div>
            
            {shouldShowButton && (
                <div className="flex justify-center">
                    <button
                        onClick={toggleExpanded}
                        className="text-sm text-[#F5A300] font-medium hover:text-yellow-600 transition-all duration-200 flex items-center gap-1 px-4 py-1 cursor-pointer bg-gray-50/70 rounded-full hover:bg-yellow-50 border border-yellow-100 hover:border-yellow-200"
                    >
                        {isExpanded ? 'Read Less' : 'Read More'}
                        <span className={`w-3 h-3 border-b-2 border-r-2 transition-transform duration-200 ${
                            isExpanded 
                                ? 'rotate-225 -translate-y-[1px]' 
                                : 'rotate-45 translate-y-[1px]'
                        }`} />
                    </button>
                </div>
            )}
        </div>
    );
};

export default function OverviewSection({ overview, propertyTitle }) {
    const [openEnquiry, setOpenEnquiry] = useState(false);

    if (!overview) return null;

    return (
        <>
            {/* ================= OVERVIEW ================= */}
            <section id="overview" className="max-w-[1240px] mx-auto px-4 mt-12">
                <h3 className="text-xl font-semibold mb-4">Overview</h3>

                <div className="bg-white rounded-xl shadow-sm p-8">

                    {/* TITLE - Keep centered */}
                    <div className="text-center mb-8">
                        {overview.title && (
                            <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-3">
                                {overview.title}
                                {overview.subtitle && (
                                    <span className="block text-base font-normal text-gray-600 mt-1">
                                        {overview.subtitle}
                                    </span>
                                )}
                            </h2>
                        )}
                    </div>

                    {/* ✅ 1 LINE TEXT + READ MORE */}
                    {overview.description && (
                        <div className="max-w-xl mx-auto">
                            <ExpandableText 
                                maxLines={1}
                                className="text-sm md:text-base text-gray-600 font-light"
                            >
                                {overview.description}
                            </ExpandableText>
                        </div>
                    )}

                    {/* CTA BUTTON */}
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