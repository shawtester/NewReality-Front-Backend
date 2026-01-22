"use client";

import Image from "next/image";
import { FaTimes } from "react-icons/fa";
import { useEffect } from "react";
import Portal from "./Portal";

export default function BrandEnquiryPopup({
  open,
  onClose,
  propertyTitle,
}) {
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [open]);

  if (!open) return null;

  return (
    <Portal>
      {/* OVERLAY */}
      <div className="fixed inset-0 z-[99999] bg-black/60 flex items-center justify-center px-4">
        {/* MODAL */}
        <div className="relative bg-white w-full max-w-sm rounded-2xl p-5 shadow-xl">
          {/* CLOSE */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 text-gray-400 hover:text-black"
          >
            <FaTimes size={14} />
          </button>

          {/* HEADER */}
          <div className="flex items-center gap-3 mb-3">
            <Image
              src="/images/logo.png"
              alt="Neev Realty"
              width={36}
              height={36}
            />
            <h2 className="text-xl font-semibold">
              Enquire <span className="text-[#F5A300]">Now</span>
            </h2>
          </div>

          {/* FORM */}
          <form className="space-y-3">
            {/* INTERESTED IN */}
            <p className="text-sm font-semibold text-gray-800">
              I Am Interested In{" "}
              <span className="block mt-1 text-sm text-[#c8950a] font-medium">
                {propertyTitle}
              </span>
            </p>

            <input
              type="text"
              placeholder="Name"
              className="w-full border border-gray-300 rounded-md px-4 py-2 outline-none focus:border-[#F5A300]"
            />

            <div className="flex border border-gray-300 rounded-md overflow-hidden">
              <select className="px-3 text-sm bg-gray-50 outline-none border-r">
                <option>+91 India</option>
              </select>
              <input
                type="tel"
                placeholder="Phone"
                className="flex-1 px-4 py-2 outline-none"
              />
            </div>

            <input
              type="email"
              placeholder="Email"
              className="w-full border border-gray-300 rounded-md px-4 py-2 outline-none focus:border-[#F5A300]"
            />

            <textarea
              rows={2}
              placeholder="Message (optional)"
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm outline-none resize-none focus:border-[#F5A300]"
            />

            <button
              type="submit"
              className="w-full mt-3 bg-[#c8950a] text-white py-2.5 rounded-md font-medium hover:brightness-105"
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    </Portal>
  );
}
