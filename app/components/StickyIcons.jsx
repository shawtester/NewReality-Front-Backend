"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { FaPhoneAlt } from "react-icons/fa";
import { IoLogoWhatsapp } from "react-icons/io5";
import { FiMail } from "react-icons/fi";
import GetInTouchModal from "@/app/residential/[slug]/components/GetInTouchModal";

export default function StickyIcons() {
  const [showEnquiryPopup, setShowEnquiryPopup] = useState(false);
  const pathname = usePathname();

  // ❌ Hide completely on admin routes
  if (pathname.startsWith("/admin")) return null;

  // ❌ Hide enquire button on residential slug pages
  const isSlugPage = pathname.startsWith("/residential/");

  return (
    <>
      {/* ================= STICKY BAR (CLICK-THROUGH FIXED) ================= */}
      <div className="fixed bottom-0 left-0 z-50 w-full pointer-events-none">

        {/* ========= MOBILE ========= */}
        <div className="sm:hidden w-full bg-white py-2 shadow-lg pointer-events-auto">
          <div className="flex justify-center gap-2 max-w-md mx-auto px-4">

            {/* WhatsApp */}
            <a
              href="https://wa.me/919876543210?text=Hello%20I%20am%20interested"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center border border-green-500 text-green-600 px-4 py-3 rounded-2xl font-medium gap-2 shadow-md hover:shadow-lg transition-all"
            >
              <IoLogoWhatsapp size={24} />
              Whatsapp
            </a>

            {/* Enquire */}
            <button
              type="button"
              onClick={() => setShowEnquiryPopup(true)}
              className="flex-1 flex items-center justify-center bg-[#DBA40D] text-white px-4 py-3 rounded-2xl font-medium gap-2 shadow-md hover:shadow-lg hover:brightness-105 transition-all"
            >
              <FiMail size={24} />
              Enquire
            </button>

          </div>
        </div>

        {/* ========= DESKTOP / TABLET ========= */}
        <div className="hidden sm:flex mx-auto max-w-5xl items-center justify-between px-4 py-2 h-20 md:h-24">

          {/* Phone */}
          <div className="group absolute left-4 md:left-16 pointer-events-auto">
            <a href="tel:+919876543210">
              <div className="border-2 border-[#DBA40D]/50 bg-white/80 backdrop-blur-sm rounded-2xl p-3 shadow-lg hover:scale-110 hover:border-[#DBA40D] transition-all cursor-pointer">
                <FaPhoneAlt size={20} />
              </div>
            </a>
          </div>

          {/* Enquire Now (hidden on slug pages) */}
          {!isSlugPage && (
            <div className="absolute right-1 -translate-x-1/2 bottom-6 pointer-events-auto">
              <button
                type="button"
                onClick={() => setShowEnquiryPopup(true)}
                className="bg-[#DBA40D] text-white px-6 py-3 rounded-2xl font-semibold shadow-lg inline-flex items-center gap-2 hover:brightness-105 hover:shadow-xl transition-all"
              >
                <FiMail size={20} />
                Enquire Now!
              </button>
            </div>
          )}

          {/* WhatsApp */}
          <div className="group absolute right-4 md:right-6 pointer-events-auto">
            <a
              href="https://wa.me/918368607767?text=Hi%20Neev%20Reality%20,%20I,m%20looking%20to%20to%20buy%20a%20property.%20Kindly%20share%20available%20options."
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="bg-green-600 text-white rounded-2xl p-3 shadow-xl hover:scale-110 hover:shadow-2xl transition-all cursor-pointer">
                <IoLogoWhatsapp size={22} />
              </div>
            </a>
          </div>

        </div>
      </div>

      {/* ================= ENQUIRY MODAL ================= */}
      <GetInTouchModal
        open={showEnquiryPopup}
        onClose={() => setShowEnquiryPopup(false)}
      />

    </>
  );
}
