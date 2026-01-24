"use client";

import { useState } from "react";
import Image from "next/image";
import { FaWhatsapp } from "react-icons/fa";
import BrandEnquiryPopup from "./BrandEnquiryPopup";

export default function BrandCTA({ propertyTitle }) {
  const [openEnquiry, setOpenEnquiry] = useState(false);

  return (
    <>
      <div className="bg-white rounded-xl p-5 text-center shadow-sm">
        <Image
          src="/images/logo.png"
          alt="Neev Realty"
          width={70}
          height={70}
          className="mx-auto"
        />

        <p className="mt-2 font-medium text-lg">Neev Realty</p>

        <div className="flex gap-3 mt-4">
          <a
            href="tel:+918824966669"
            className="flex-1 py-2 border rounded-lg text-sm"
          >
            Call Us
          </a>

          <button
            onClick={() => setOpenEnquiry(true)}
            className="flex-1 py-2 border border-yellow-600 text-yellow-600 rounded-lg text-sm hover:bg-yellow-50 transition"
          >
            Enquiry
          </button>
        </div>

        <p className="mt-4 text-sm text-gray-500">Connect us via</p>

        <div className="flex justify-center mt-2">
          <a
            href="https://wa.me/918824966669"
            target="_blank"
            rel="noreferrer"
            className="w-10 h-10 bg-green-500 text-white rounded-full flex items-center justify-center hover:bg-green-600 transition"
          >
            <FaWhatsapp className="text-xl" />
          </a>
        </div>
      </div>

      {/* CTA POPUP */}
      <BrandEnquiryPopup
        open={openEnquiry}
        onClose={() => setOpenEnquiry(false)}
        propertyTitle={propertyTitle}
      />
    </>
  );
}
