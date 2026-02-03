"use client";

import Image from "next/image";

export default function DeveloperSection({ builder }) {
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
              <span className="text-xs text-gray-400">
                N/A
              </span>
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
          <Stat label="Total Projects" value={builder.totalProjects} icon="🏗️" />
          <Stat label="Ongoing Projects" value={builder.ongoingProjects} icon="🏢" />
          <Stat label="Cities Present" value={builder.citiesPresent} icon="📍" />
        </div>

        {/* DESCRIPTION */}
        {builder.description && (
          <div
            className="
              prose prose-sm max-w-none
              text-gray-600 mt-6
              [&_a]:text-[#F5A300]
              [&_a]:underline
              [&_a:hover]:text-yellow-600
            "
            dangerouslySetInnerHTML={{
              __html: builder.description,
            }}
          />
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
      <p className="text-sm text-gray-500">
        {label}
      </p>
      <p className="font-semibold">
        {value ?? "—"}
      </p>
    </div>
  );
}
