"use client";

import Link from "next/link";

const footerSections = [
  {
    title: "Projects by size",
    description: "Manage BHK based footer links",
    href: "/admin/footer/projects-by-size",
  },
  {
    title: "Properties by type",
    description: "Residential, commercial, luxury, etc.",
    href: "/admin/footer/properties-by-type",
  },
  {
    title: "Projects by status",
    description: "New launch, ready to move, under construction",
    href: "/admin/footer/projects-by-status",
  },
  {
    title: "Projects by location",
    description: "Dwarka Expressway, Golf Course, NH8, etc.",
    href: "/admin/footer/projects-by-location",
  },
  {
    title: "Projects by budget",
    description: "Price-based footer links",
    href: "/admin/footer/projects-by-budget",
  },
];

export default function FooterAdminHome() {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      {/* PAGE HEADER */}
      <div className="max-w-6xl mx-auto mb-8">
        <h1 className="text-3xl font-semibold text-black">
          Footer Management
        </h1>
        <p className="text-gray-600 mt-1">
          Manage all footer links from here
        </p>
      </div>

      {/* CARDS */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {footerSections.map((section) => (
          <div
            key={section.href}
            className="bg-white border-2 border-yellow-400 rounded-xl p-6
                       hover:shadow-lg transition"
          >
            <h2 className="text-lg font-semibold text-black mb-2">
              {section.title}
            </h2>

            <p className="text-sm text-gray-600 mb-4">
              {section.description}
            </p>

            <Link
              href={section.href}
              className="inline-block bg-[#DBA40D] text-white text-sm
                         px-4 py-2 rounded-md hover:bg-gray-800 transition"
            >
              Edit Section →
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
