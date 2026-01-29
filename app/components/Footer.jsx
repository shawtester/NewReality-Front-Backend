"use client";

import Link from "next/link";
import { useRef } from "react";
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
  const scrollContainerRef = useRef(null);
  const BASE_ROUTE = "/residential"; // ✅ Dynamic base route

  const scrollLeft = () => {
    scrollContainerRef.current?.scrollBy({ left: -350, behavior: "smooth" });
  };

  const scrollRight = () => {
    scrollContainerRef.current?.scrollBy({ left: 350, behavior: "smooth" });
  };

  // Dynamic BHK links ✅ ALREADY WORKING
  const bhkLinks = [
    { value: "1-bhk", label: "1 BHK property in Gurgaon" },
    { value: "1.5-bhk", label: "1.5 BHK property in Gurgaon" },
    { value: "2-bhk", label: "2 BHK property in Gurgaon" },
    { value: "2.5-bhk", label: "2.5 BHK property in Gurgaon" },
    { value: "3-bhk", label: "3 BHK property in Gurgaon" },
    { value: "4-bhk", label: "4 BHK property in Gurgaon" },
    { value: "above-5-bhk", label: "5+ BHK property in Gurgaon" },
  ];

  // UPDATED: Properties by type links - Commercial types redirect to /commercial
  const propertyTypeLinks = [
    { value: "residential", label: "Residential property", href: `${BASE_ROUTE}?type=residential` },
    { 
      value: "commercial", 
      label: "Commercial property", 
      href: "/commercial?type=commercial" 
    },
    { 
      value: "luxury-apartment", 
      label: "Luxury apartment", 
      href: `${BASE_ROUTE}?type=luxury-apartment` 
    },
    { 
      value: "builder-floor", 
      label: "Builder floor", 
      href: `${BASE_ROUTE}?type=builder-floor` 
    },
    { 
      value: "retail-shops", 
      label: "Retail shops", 
      href: "/commercial?type=retail-shops" 
    },
    { 
      value: "sco-plots", 
      label: "SCO plots", 
      href: "/commercial?type=sco-plots" 
    },
  ];

  // NEW: Projects by status links
  const projectStatusLinks = [
    { value: "new-launch", label: "New launch projects" },
    { value: "ready-to-move", label: "Ready to move projects" },
    { value: "under-construction", label: "Under construction projects" },
    { value: "pre-launch", label: "Pre launch projects" },
  ];

  // NEW: Projects by location links
  const locationLinks = [
    { value: "dwarka-expressway", label: "Dwarka Expressway" },
    { value: "golf-course-road", label: "Golf Course Road" },
    { value: "golf-course-extension", label: "Golf Course Extension" },
    { value: "sohna-road", label: "Sohna Road" },
    { value: "new-gurgaon", label: "New Gurgaon" },
  ];

  // NEW: Projects by budget links
  const budgetLinks = [
    { value: "1-2cr", label: "1–2 Cr" },
    { value: "2-3cr", label: "2–3 Cr" },
    { value: "3-4cr", label: "3–4 Cr" },
    { value: "4-5cr", label: "4–5 Cr" },
    { value: "5cr-plus", label: "5+ Cr" },
  ];

  return (
    <footer className="bg-[#1B121E] text-gray-300 w-full mt-5">
      {/* ================= TOP LINKS ================= */}
      <div className="relative bg-[#29192B] border-b border-[#2c1b32]">
        <div className="max-w-[1380px] mx-auto px-6 py-10">
          <div className="flex items-center gap-4 lg:gap-6">
            <button
              onClick={scrollLeft}
              className="hidden lg:flex h-12 w-12 items-center justify-center bg-white/10 hover:bg-white/20 rounded-lg"
            >
              <FaChevronLeft className="text-white" />
            </button>

            <div
              ref={scrollContainerRef}
              className="flex gap-8 overflow-x-auto whitespace-nowrap scrollbar-hide flex-1"
            >
              {/* ===== COLUMN 1 - BHK (Already working) ===== */}
              <div className="min-w-[260px] whitespace-normal">
                <h4 className="text-white font-semibold mb-4">
                  Projects by size
                </h4>
                <ul className="space-y-2 text-sm text-gray-400">
                  {bhkLinks.map((item) => (
                    <li key={item.value}>
                      <Link
                        href={`${BASE_ROUTE}?bhk=${item.value}`}
                        className="hover:text-white"
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* ===== COLUMN 2 - Property Type (UPDATED) ===== */}
              <div className="min-w-[260px] whitespace-normal">
                <h4 className="text-white font-semibold mb-4">Properties by type</h4>
                <ul className="space-y-2 text-sm text-gray-400">
                  {propertyTypeLinks.map((item) => (
                    <li key={item.value}>
                      <Link
                        href={item.href}
                        className="hover:text-white"
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* ===== COLUMN 3 - Project Status ===== */}
              <div className="min-w-[260px] whitespace-normal">
                <h4 className="text-white font-semibold mb-4">Projects by status</h4>
                <ul className="space-y-2 text-sm text-gray-400">
                  {projectStatusLinks.map((item) => (
                    <li key={item.value}>
                      <Link
                        href={`${BASE_ROUTE}?status=${item.value}`}
                        className="hover:text-white"
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* ===== COLUMN 4 - Location ===== */}
              <div className="min-w-[260px] whitespace-normal">
                <h4 className="text-white font-semibold mb-4">Projects by location</h4>
                <ul className="space-y-2 text-sm text-gray-400">
                  {locationLinks.map((item) => (
                    <li key={item.value}>
                      <Link
                        href={`${BASE_ROUTE}?location=${item.value}`}
                        className="hover:text-white"
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* ===== COLUMN 5 - Budget ===== */}
              <div className="min-w-[260px] whitespace-normal">
                <h4 className="text-white font-semibold mb-4">Projects by budget</h4>
                <ul className="space-y-2 text-sm text-gray-400">
                  {budgetLinks.map((item) => (
                    <li key={item.value}>
                      <Link
                        href={`${BASE_ROUTE}?budget=${item.value}`}
                        className="hover:text-white"
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <button
              onClick={scrollRight}
              className="hidden lg:flex h-12 w-12 items-center justify-center bg-white/10 hover:bg-white/20 rounded-lg"
            >
              <FaChevronRight className="text-white" />
            </button>
          </div>
        </div>
      </div>

      {/* ================= MIDDLE - UNCHANGED ================= */}
      <div className="max-w-[1212px] mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* ABOUT */}
        <div>
          <h4 className="text-white font-semibold text-lg mb-4">About Us</h4>
          <p className="text-gray-400 text-sm leading-6">
            Neev Realty is a trusted real estate consultancy focused on delivering
            transparent and rewarding property journeys.
          </p>
        </div>

        {/* QUICK LINKS */}
        <div>
          <h4 className="text-white font-semibold text-lg mb-4">Quick Links</h4>
          <div className="grid grid-cols-2 gap-y-3 text-sm text-gray-400">
            <Link href="/">Home</Link>
            <Link href="/about">About</Link>
            <Link href="/services">Services</Link>
            <Link href={BASE_ROUTE}>Residential</Link>
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
          <h4 className="text-white font-semibold mb-4">Connect with us</h4>
          <p className="text-sm text-gray-400">support@neevreality.com</p>
          <p className="text-sm text-gray-400 mt-2">info@neevreality.com</p>

          <div className="mt-4 flex gap-2">
            {[FaFacebookF, FaLinkedinIn, FaInstagram, FaXTwitter, FaYoutube].map(
              (Icon, i) => (
                <span
                  key={i}
                  className="h-8 w-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20"
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
        © 2025 NeevRealty.com. All Rights Reserved.
      </div>
    </footer>
  );
}
