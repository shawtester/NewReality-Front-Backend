"use client";

import { useState } from "react";
import Image from "next/image";

export default function LocationSection({
  mapQuery,
  locationImage,
  locationPoints = [],
}) {
  const [open, setOpen] = useState(false);

  // Agar map + image + points kuch bhi nahi hai → hide section
  if (
    !mapQuery &&
    !locationImage &&
    (!locationPoints || locationPoints.length === 0)
  )
    return null;

  return (
    <>
      <section id="location" className="max-w-[1240px] mx-auto px-4 mt-16">
        <h2 className="text-xl font-semibold mb-8">Location</h2>

        {/* WRAPPER */}
        <div className="flex flex-col md:flex-row items-start gap-2 lg:gap-5">

          {/* ================= LEFT CARD ================= */}
          {(mapQuery || locationImage) && (
            <div
              className="
                w-full md:w-[45%]
                h-[288px]
                bg-white
                border border-gray-300/70
                rounded-2xl
                overflow-hidden
                flex-shrink-0
                relative
              "
            >
              {/* ✅ PRIORITY → LOCATION IMAGE */}
              {locationImage ? (
                <div
                  onClick={() => setOpen(true)}
                  className="w-full h-full cursor-pointer"
                >
                  <Image
                    src={locationImage}
                    alt="Location"
                    fill
                    className="object-cover hover:scale-105 transition duration-300"
                  />
                </div>
              ) : (
                <iframe
                  src={`https://www.google.com/maps?q=${encodeURIComponent(
                    mapQuery
                  )}&output=embed`}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="w-full h-full border-0"
                />
              )}
            </div>
          )}

          {/* ================= RIGHT DISTANCE CARD ================= */}
          {Array.isArray(locationPoints) && locationPoints.length > 0 && (
            <div
              className="
                w-full max-w-[490px] h-[288px]
                bg-white
                border border-gray-300/70
                rounded-2xl
                p-5
                overflow-y-auto
                space-y-3
              "
            >
              {locationPoints.map((item, i) => (
                <div
                  key={i}
                  className="
                    bg-gray-100
                    rounded-full
                    px-4 py-2
                    text-sm
                    text-gray-700
                    text-center
                    whitespace-nowrap
                  "
                >
                  {typeof item === "string"
                    ? item
                    : `${item.label} – ${item.distance}`}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ================= FULLSCREEN IMAGE ================= */}
      {open && locationImage && (
        <div className="fixed inset-0 z-[999] bg-black/90 flex items-center justify-center">

          {/* CLOSE */}
          <button
            onClick={() => setOpen(false)}
            className="absolute top-6 right-6 text-white text-3xl"
          >
            ✕
          </button>

          {/* IMAGE */}
          <div className="relative w-[90vw] h-[80vh]">
            <Image
              src={locationImage}
              alt="Location"
              fill
              className="object-contain"
            />
          </div>
        </div>
      )}
    </>
  );
}