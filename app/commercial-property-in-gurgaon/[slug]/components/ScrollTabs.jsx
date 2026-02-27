"use client";

import { useEffect, useState } from "react";

const tabs = [
  { label: "Overview", id: "overview" },
  { label: "Floor Plan", id: "floor-plan" },
  { label: "Payment Plan", id: "payment-plan" },
  { label: "Amenities", id: "amenities" },
  { label: "Location", id: "location" },
  { label: "EMI", id: "emi" },
  { label: "FAQ", id: "faq" },
  { label: "Developer", id: "developer" },
];

export default function ScrollTabs() {
  const [activeTab, setActiveTab] = useState("overview");

  // click scroll
  const scrollToSection = (id) => {
    const section = document.getElementById(id);
    if (!section) return;

    const HEADER_OFFSET = 120;
    const top =
      section.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET;

    window.scrollTo({ top, behavior: "smooth" });
    setActiveTab(id);
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveTab(entry.target.id);
          }
        });
      },
      {
        rootMargin: "-140px 0px -60% 0px",
        threshold: 0,
      }
    );

    tabs.forEach((t) => {
      const el = document.getElementById(t.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="shadow-sm bg-white">
      <div className="flex gap-6 overflow-x-auto no-scrollbar px-4 py-3">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => scrollToSection(tab.id)}
            className={`whitespace-nowrap text-sm font-medium pb-2 transition ${
              activeTab === tab.id
                ? "text-[#DBA40D] border-b-2 border-[#DBA40D]"
                : "text-gray-600 hover:text-[#DBA40D]"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
}
