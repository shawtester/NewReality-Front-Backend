"use client";

import Link from "next/link";
import { useRef } from "react";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
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

  // ✅ FIXED: Dynamic BHK links
  const [bhkLinks, setBhkLinks] = useState([]);

  useEffect(() => {
    const fetchLinks = async () => {
      const snap = await getDoc(
        doc(db, "footer_links", "projects_by_size")
      );
      setBhkLinks(snap.data().links);
    };
    fetchLinks();
  }, []);


  // ✅ FIXED: Properties by type links - Commercial types redirect to /commercial
  const [propertyTypeLinks, setPropertyTypeLinks] = useState([]);
  useEffect(() => {
    const fetchPropertyTypes = async () => {
      const snap = await getDoc(
        doc(db, "footer_links", "property_by_type")
      );
      if (snap.exists()) {
        setPropertyTypeLinks(snap.data().links);
      }
    };

    fetchPropertyTypes();
  }, []);


  // ✅ FIXED: Projects by status links - REMOVED extra space in value
  const [projectStatusLinks, setProjectStatusLinks] = useState([]);

  useEffect(() => {
    const fetchProjectStatus = async () => {
      const snap = await getDoc(
        doc(db, "footer_links", "projects_by_status")
      );
      if (snap.exists()) {
        setProjectStatusLinks(snap.data().links);
      }
    };

    fetchProjectStatus();
  }, []);


  // ✅ FIXED: Projects by location links - CORRECTED value/label order
  const [projectLocationLinks, setProjectLocationLinks] = useState([]);

  useEffect(() => {
    const fetchProjectLocations = async () => {
      const snap = await getDoc(
        doc(db, "footer_links", "projects_by_location")
      );
      if (snap.exists()) {
        setProjectLocationLinks(snap.data().links);
      }
    };

    fetchProjectLocations();
  }, []);


  // ✅ FIXED: Projects by budget links - CORRECTED value format
  const [projectBudgetLinks, setProjectBudgetLinks] = useState([]);

  useEffect(() => {
    const fetchProjectBudgets = async () => {
      const snap = await getDoc(
        doc(db, "footer_links", "projects_by_budget")
      );
      if (snap.exists()) {
        setProjectBudgetLinks(snap.data().links);
      }
    };

    fetchProjectBudgets();
  }, []);


  // ✅ NEW: Social media links configuration
  const socialLinks = [
    { Icon: FaFacebookF, href: "https://www.facebook.com/p/NeevRealty-61558971842531" },
    { Icon: FaLinkedinIn, href: "https://www.linkedin.com/company/neev-realty-services" },
    { Icon: FaInstagram, href: "https://www.instagram.com/neevrealty" },
    { Icon: FaXTwitter, href: "https://x.com/NeevRealty" },
    { Icon: FaYoutube, href: "https://www.youtube.com/@Neevrealty_09" },
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
              {/* ===== COLUMN 1 - BHK ===== */}
              <div className="min-w-[260px] whitespace-normal">
                <h4 className="text-white font-semibold mb-4">
                  Projects by size
                </h4>
                <ul className="flex flex-col gap-2 text-sm text-gray-400">
                  {bhkLinks.map((item) => (
                    <Link
                      key={item.id}
                      href={`${BASE_ROUTE}?bhk=${item.value}`}
                      className="block leading-6 hover:text-white"
                    >
                      {item.label}
                    </Link>
                  ))}
                </ul>
              </div>

              {/* ===== COLUMN 2 - Property Type ===== */}
              <div className="min-w-[260px] whitespace-normal">
                <h4 className="text-white font-semibold mb-4">Properties by type</h4>
                <ul className="flex flex-col gap-2 text-sm text-gray-400">
                  {propertyTypeLinks.map((item) => (
                    <li key={item.id}>
                      <Link
                        href={item.value}
                        className="block leading-6 hover:text-white"
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
                <ul className="flex flex-col gap-2 text-sm text-gray-400">
                  {projectStatusLinks.map(item => (
                    <li key={item.id}>
                      <Link
                        href={item.value}
                        className="block leading-6 hover:text-white"
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
                <ul className="flex flex-col gap-2 text-sm text-gray-400">
                  {projectLocationLinks.map(item => (
                    <li key={item.id}>
                      <Link
                        href={item.value}
                        className="block leading-6 hover:text-white"
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
                <ul className="flex flex-col gap-2 text-sm text-gray-400">
                  {projectBudgetLinks.map(item => (
                    <li key={item.id}>
                      <Link
                        href={item.value}
                        className="block leading-6 hover:text-white"
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

      {/* ================= MIDDLE - UPDATED SOCIAL ICONS ================= */}
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
            <Link href="/contact-us">Contact</Link>
          </div>
        </div>

        {/* CONTACT */}
        <div>
          <h4 className="text-white font-semibold mb-4">Connect with us</h4>
          <p className="text-sm text-gray-400">support@neevreality.com</p>
          <p className="text-sm text-gray-400 mt-2">info@neevreality.com</p>

          {/* ✅ UPDATED: Clickable social media icons */}
          <div className="mt-4 flex gap-2">
            {socialLinks.map(({ Icon, href }, i) => (
              <Link
                key={i}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="h-8 w-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-all duration-200"
              >
                <Icon className="text-white text-sm" />
              </Link>
            ))}
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
