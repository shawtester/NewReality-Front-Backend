"use client";

import { useState } from "react";
import Image from "next/image";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function TitleBlockWithBrochure({ property }) {
  const [lead, setLead] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const [showBrochurePopup, setShowBrochurePopup] = useState(false);

  async function handleSubmit() {
    if (!lead.name || !lead.email || !lead.phone) {
      alert("All fields required");
      return;
    }

    try {
      // ✅ Save Lead First
      await addDoc(collection(db, "brochureLeads"), {
        ...lead,
        propertySlug: property.slug,
        propertyTitle: property.title,
        createdAt: serverTimestamp(),
      });

      // ✅ DIRECT DOWNLOAD (NO URL MODIFY)
      if (property?.brochure?.url) {
        const link = document.createElement("a");

        // 🔥 ORIGINAL CLOUDINARY URL USE KARO
        link.href = property.brochure.url;

        // 🔥 browser ko force download bolte hain
        link.setAttribute(
          "download",
          property.brochure.name || "brochure.pdf"
        );

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        alert("Brochure not available");
      }

      setShowBrochurePopup(false);
      setLead({ name: "", email: "", phone: "" });
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    }
  }

  if (!property || typeof property !== "object") return null;

  return (
    <>
      {/* ================= TITLE BLOCK ================= */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:justify-between gap-6">
          {/* LEFT */}
          <div className="flex flex-col gap-3">
            <h1 className="text-[22px] font-semibold text-gray-900 leading-snug">
              {property.title}
            </h1>

            <p className="text-sm text-pink-600">{property.location}</p>

            <div className="flex flex-col gap-2 mt-1 text-sm text-gray-600">
              {typeof property.builderName === "string" && (
                <div className="flex items-center gap-2">
                  <span className="w-7 h-7 flex items-center justify-center rounded-full bg-gray-100 text-xs">
                    🏢
                  </span>
                  <span>
                    By{" "}
                    <span className="text-pink-600">
                      {property.builderName}
                    </span>
                  </span>
                </div>
              )}

              {property.size && (
                <div className="flex items-center gap-2">
                  <span className="w-7 h-7 flex items-center justify-center rounded-full bg-gray-100 text-xs">
                    📐
                  </span>
                  <span>{property.size}</span>
                </div>
              )}

              {property.rera && (
                <div className="flex items-center gap-2">
                  <span className="flex items-center gap-1 rounded-full bg-[#f3f3f3] px-2 py-1 text-[10px] font-medium text-gray-600">
                    RERA
                    <Image
                      src="/images/newlaunchproject/rera.png"
                      alt="RERA"
                      width={12}
                      height={12}
                    />
                  </span>
                </div>
              )}

              {property.updatedAt && (
                <div className="flex items-center gap-2 text-gray-400">
                  <span className="w-7 h-7 flex items-center justify-center rounded-full bg-gray-100 text-xs">
                    ⏱
                  </span>
                  <span>Last Updated Date {property.updatedAt}</span>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT */}
          <div className="flex flex-col items-start lg:items-end justify-between gap-3">
            {property.price && (
              <p className="text-[18px] font-semibold text-gray-900">
                {property.price}
              </p>
            )}

            {typeof property.bhk === "string" &&
              property.bhk.trim().length > 0 && (
                <p className="text-sm text-gray-500">{property.bhk}</p>
              )}

            <button
              onClick={() => setShowBrochurePopup(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#F5A300] hover:bg-[#e49a00] text-white rounded-md text-sm font-medium transition"
            >
              ⬇ Download Brochure
            </button>
          </div>
        </div>
      </div>

      {/* ================= BROCHURE POPUP ================= */}
      {showBrochurePopup && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center px-4">
          <div className="relative w-full max-w-md bg-white rounded-xl p-6">
            <button
              onClick={() => setShowBrochurePopup(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-black text-xl"
            >
              ✕
            </button>

            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Brochure
            </h3>

            <p className="text-sm font-semibold text-gray-800 mb-3">
              I Am Interested In
              <span className="block mt-1 text-sm text-[#c8950a] font-medium">
                {property.title}
              </span>
            </p>

            <p className="text-sm text-gray-600 mb-4">
              Enter your details to get the project brochure.
            </p>

            <div className="space-y-3">
              <input
                type="text"
                placeholder="Full Name*"
                value={lead.name}
                onChange={(e) =>
                  setLead({ ...lead, name: e.target.value })
                }
                className="w-full border rounded-md px-4 py-2 text-sm"
              />

              <input
                type="email"
                placeholder="Email Address*"
                value={lead.email}
                onChange={(e) =>
                  setLead({ ...lead, email: e.target.value })
                }
                className="w-full border rounded-md px-4 py-2 text-sm"
              />

              <input
                type="tel"
                placeholder="Contact Number*"
                value={lead.phone}
                onChange={(e) =>
                  setLead({ ...lead, phone: e.target.value })
                }
                className="w-full border rounded-md px-4 py-2 text-sm"
              />
            </div>

            <button
              onClick={handleSubmit}
              className="mt-5 w-full bg-[#F5A300] hover:bg-[#e49a00] text-white py-2.5 rounded-md text-sm font-semibold transition"
            >
              Download Brochure
            </button>
          </div>
        </div>
      )}
    </>
  );
}
