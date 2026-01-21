import React from "react";

export default function BigServices({ services = [] }) {
  if (!services.length) return null;

  return (
    <section className="py-10">
      <div className="max-w-[1180px] mx-auto px-4">

        {/* TOP 2 BOXES */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {services.slice(0, 2).map((b, i) => (
            <div
              key={i}
              className="border border-gray-300 rounded-xl p-10 bg-white min-h-[220px] flex flex-col justify-center"
            >
              <h4 className="text-[#F5A300] text-xl font-semibold mb-3">
                {b.title}
              </h4>
              <p className="text-gray-600 text-[15px] leading-6 max-w-[420px]">
                {b.text}
              </p>
            </div>
          ))}
        </div>

        {/* MIDDLE BOX */}
        {services[2] && (
          <div className="relative flex justify-center mt-[-60px] mb-[-60px] z-10">
            <div className="bg-white border border-gray-300 rounded-xl shadow-lg p-10 text-center w-full max-w-[520px] min-h-[220px]">
              <h4 className="text-[#F5A300] text-xl font-semibold mb-3">
                {services[2].title}
              </h4>
              <p className="text-gray-600 text-[15px] leading-6">
                {services[2].text}
              </p>
            </div>
          </div>
        )}

        {/* BOTTOM 2 BOXES */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10">
          {services.slice(3).map((b, i) => (
            <div
              key={i}
              className="border border-gray-300 rounded-xl p-10 bg-white min-h-[220px] flex flex-col justify-center"
            >
              <h4 className="text-[#F5A300] text-xl font-semibold mb-3">
                {b.title}
              </h4>
              <p className="text-gray-600 text-[15px] leading-6 max-w-[420px]">
                {b.text}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
