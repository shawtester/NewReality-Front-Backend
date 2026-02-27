"use client";

import Image from "next/image";
import { useState } from "react";

export default function DeveloperSection({ builder }) {
  const [expanded, setExpanded] = useState(false);

  if (!builder) return null;

  return (
    <section
      id="developer"
      className="max-w-[1240px] mx-auto px-4 mt-14"
    >
      <h2 className="text-xl font-semibold mb-6 pb-2">
        About Developer
      </h2>

      <div className="bg-white rounded-xl p-6 shadow-sm">
        {/* TOP ROW */}
        <div className="flex items-center gap-4">
          {/* LOGO */}
          <div className="w-16 h-16 border rounded-lg flex items-center justify-center bg-white">
            {builder.logo?.url ? (
              <Image
                src={builder.logo.url}
                alt={builder.name}
                width={48}
                height={48}
                className="object-contain"
              />
            ) : (
              <span className="text-xs text-gray-400">N/A</span>
            )}
          </div>

          {/* NAME */}
          <h3 className="text-lg font-semibold">
            {builder.name}
          </h3>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mt-8 text-center">
          <Stat label="Established" value={builder.establishedYear} icon="🏛️" />
          <Stat label="Total Projects" value={builder.manualTotalProjects} icon="🏗️" />
          <Stat label="Ongoing Projects" value={builder.ongoingProjects} icon="🏢" />
          <Stat label="Cities Present" value={builder.citiesPresent} icon="📍" />
        </div>

        {/* DESCRIPTION */}
        {builder.description && (
          <div className="mt-6">
            <div
              className={`
                prose prose-sm max-w-none text-gray-600
                [&_a]:text-[#F5A300]
                [&_a]:underline
                [&_a:hover]:text-yellow-600
                ${expanded ? "" : "line-clamp-2"}
              `}
              dangerouslySetInnerHTML={{
                __html: builder.description,
              }}
            />

            {/* READ MORE / LESS */}
            <button
              onClick={() => setExpanded(!expanded)}
              className="mt-2 text-sm font-semibold text-[#F5A300] hover:text-yellow-600"
            >
              {expanded ? "Read Less" : "Read More"}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

/* 🔹 Small Stat Component */
function Stat({ label, value, icon }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="w-10 h-10 bg-[#F5A300] text-white rounded-full flex items-center justify-center">
        {icon}
      </div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="font-semibold">{value ?? "—"}</p>
    </div>
  );
}
