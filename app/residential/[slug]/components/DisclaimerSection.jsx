"use client";

import Link from "next/link";

export default function DisclaimerSection({ text }) {
  // Agar disclaimer hi nahi hai → section mat dikhao
  if (!text) return null;

  return (
    <section className="w-full bg-[#FFF7E6] border-t border-[#F5A300]/30 mt-10">
      <div className="max-w-[1240px] mx-auto px-4 py-8">
        {/* TITLE */}
        <h3 className="text-lg font-semibold text-gray-900 mb-3">
          Disclaimer
          <span className="block w-10 h-[2px] bg-[#F5A300] mt-2"></span>
        </h3>

        {/* CONTENT */}
        <p className="text-sm text-gray-600 leading-relaxed max-w-[1000px]">
          {text}
          <Link
            href="/disclaimer"
            className="ml-1 text-[#F5A300] font-medium hover:underline"
          >
            Read More
          </Link>
        </p>
      </div>
    </section>
  );
}
