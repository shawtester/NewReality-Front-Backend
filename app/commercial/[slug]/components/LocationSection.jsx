"use client";

export default function LocationSection({ mapQuery, locationPoints = [] }) {
  // Agar map + points dono hi nahi hain → section mat dikhao
  if (!mapQuery && (!locationPoints || locationPoints.length === 0)) return null;

  return (
    <section id="location" className="max-w-[1240px] mx-auto px-4 mt-16">
      <h2 className="text-xl font-semibold mb-8">Location</h2>

      {/* WRAPPER */}
      <div className="flex flex-col md:flex-row items-start gap-6 lg:gap-10">

        {/* LEFT : MAP CARD */}
        {mapQuery && (
          <div
            className="
              w-full md:w-[45%]
              h-[288px]
              bg-white
              border border-gray-300/70
              rounded-2xl
              overflow-hidden
              flex-shrink-0
            "
          >
            <iframe
              src={`https://www.google.com/maps?q=${encodeURIComponent(
                mapQuery
              )}&output=embed`}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full h-full border-0"
            />
          </div>
        )}

        {/* RIGHT : DISTANCE LIST CARD */}
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
  );
}
