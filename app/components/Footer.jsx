"use client";

import Link from "next/link";
import { useState, useRef } from "react";
import {
  FaFacebookF,
  FaLinkedinIn,
  FaInstagram,
  FaXTwitter,
  FaYoutube,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa6";

export default function Footer() {
  const [scrollPosition, setScrollPosition] = useState(0);
  const scrollContainerRef = useRef(null);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -350, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 350, behavior: "smooth" });
    }
  };

  return (
    <footer className="bg-[#1B121E] text-gray-300 w-full mt-5">
      {/* ================= TOP LINKS (DESKTOP SCROLL) ================= */}
      <div className="relative bg-[#29192B] border-b border-[#2c1b32]">
        <div className="max-w-[1380px] mx-auto px-6 py-10">
          <div className="flex items-center gap-4 lg:gap-6">
            {/* LEFT SCROLL BUTTON */}
            <button
              onClick={scrollLeft}
              className="hidden lg:flex h-12 w-12 items-center justify-center bg-white/10 hover:bg-white/20 rounded-lg transition-all shrink-0"
            >
              <FaChevronLeft className="text-white" />
            </button>

            {/* SCROLL CONTAINER */}
            <div
              ref={scrollContainerRef}
              className="
                flex gap-6 lg:gap-8
                overflow-x-auto lg:overflow-x-scroll
                whitespace-nowrap pb-4 lg:pb-2 scrollbar-hide
                lg:max-w-[calc(100%-96px)]
                snap-x snap-mandatory lg:snap-none
                flex-1
              "
            >
              {/* COLUMN 1 */}
              <div className="min-w-[320px] lg:min-w-[220px] whitespace-normal flex-shrink-0">
                <h4 className="text-white font-semibold mb-4">
                  Projects by size
                </h4>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li>1 BHK property in Gurgaon</li>
                  <li>1.5 BHK property in Gurgaon</li>
                  <li>2 BHK property in Gurgaon</li>
                  <li>3 BHK property in Gurgaon</li>
                  <li>4 BHK property in Gurgaon</li>
                  <li>5+ BHK property in Gurgaon</li>
                </ul>
              </div>

              {/* COLUMN 2 */}
              <div className="min-w-[320px] lg:min-w-[220px] whitespace-normal flex-shrink-0">
                <h4 className="text-white font-semibold mb-4">
                  Properties by type
                </h4>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li>Residential property</li>
                  <li>Commercial property</li>
                  <li>Luxury apartment</li>
                  <li>Builder floor</li>
                  <li>Retail shops</li>
                  <li>SCO plots</li>
                </ul>
              </div>

              {/* COLUMN 3 */}
              <div className="min-w-[320px] lg:min-w-[220px] whitespace-normal flex-shrink-0">
                <h4 className="text-white font-semibold mb-4">
                  Projects by construction status
                </h4>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li>New launch projects</li>
                  <li>Ready to move projects</li>
                  <li>Under construction projects</li>
                  <li>Pre launch projects</li>
                </ul>
              </div>

              {/* COLUMN 4 */}
              <div className="min-w-[320px] lg:min-w-[220px] whitespace-normal flex-shrink-0">
                <h4 className="text-white font-semibold mb-4">
                  Projects by Location
                </h4>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li>Dwarka Expressway</li>
                  <li>Golf Course Road</li>
                  <li>Golf Course Extension</li>
                  <li>Sohna Road</li>
                  <li>New Gurgaon</li>
                </ul>
              </div>

              {/* COLUMN 5 */}
              <div className="min-w-[320px] lg:min-w-[220px] whitespace-normal flex-shrink-0">
                <h4 className="text-white font-semibold mb-4">
                  Projects by Budget
                </h4>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li>1–2 Cr</li>
                  <li>2–3 Cr</li>
                  <li>3–4 Cr</li>
                  <li>4–5 Cr</li>
                  <li>5+ Cr</li>
                </ul>
              </div>
            </div>

            {/* RIGHT SCROLL BUTTON */}
            <button
              onClick={scrollRight}
              className="hidden lg:flex h-12 w-12 items-center justify-center bg-white/10 hover:bg-white/20 rounded-lg transition-all shrink-0"
            >
              <FaChevronRight className="text-white" />
            </button>
          </div>
        </div>
      </div>

      {/* ================= MIDDLE ================= */}
      <div className="max-w-[1212px] mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* ABOUT */}
        <div>
          <h4 className="text-white font-semibold text-lg mb-4">
            About Us
          </h4>
          <p className="text-gray-400 text-sm leading-6">
            Neev Realty is a trusted name in real estate consulting focused on
            delivering a smooth and rewarding property journey. Our experts
            operate with integrity, transparency, and customer trust.
          </p>
        </div>

        {/* QUICK LINKS */}
        <div>
          <h4 className="text-white font-semibold text-lg mb-4">
            Quick Links
          </h4>
          <div className="grid grid-cols-2 gap-y-3 text-sm text-gray-400">
            <Link href="/">Home</Link>
            <Link href="/about">About</Link>
            <Link href="/services">Services</Link>
            <Link href="/residential">Residential</Link>
            <Link href="/commercial">Commercial</Link>
            <Link href="/careers">Careers</Link>
            <Link href="/terms-condition">Terms & Condition</Link>
            <Link href="/privacy">Privacy Policy</Link>
            <Link href="/faqs">FAQs</Link>
            <Link href="/blog">Blog</Link>
            <Link href="/disclaimer">Disclaimer</Link>
            <Link href="/contact">Contact</Link>
          </div>
        </div>

        {/* CONTACT */}
        <div>
          <h4 className="text-white font-semibold mb-4">
            Connect with us
          </h4>
          <p className="text-sm text-gray-400">support@neevreality.com</p>
          <p className="text-sm text-gray-400 mt-2">info@neevreality.com</p>

          <h4 className="mt-6 text-white font-semibold text-sm">
            Follow us on
          </h4>
          <div className="mt-3 flex gap-2">
            {[FaFacebookF, FaLinkedinIn, FaInstagram, FaXTwitter, FaYoutube].map(
              (Icon, i) => (
                <span
                  key={i}
                  className="h-8 w-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition"
                >
                  <Icon />
                </span>
              )
            )}
          </div>
        </div>
      </div>

      {/* ================= BOTTOM ================= */}
      <div className="border-t border-[#2c1b32] py-4 text-center text-xs text-gray-500">
        © Copyright NeevRealty.com 2025. All Rights Reserved.
      </div>
    </footer>
  );
}

