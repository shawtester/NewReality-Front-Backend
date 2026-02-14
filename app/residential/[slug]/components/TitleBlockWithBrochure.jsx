"use client";

import { useState } from "react";
import { useEffect } from "react";
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

  /* ✅ NEW — THANK YOU STATE */
  const [showThankYou, setShowThankYou] = useState(false);

  /* ✅ NEW — ERRORS */
  const [errors, setErrors] = useState({});

  useEffect(() => {
    document.body.style.overflow = showBrochurePopup ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [showBrochurePopup]);


  const validate = () => {
    const newErrors = {};

    if (!lead.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!/^[6-9]\d{9}$/.test(lead.phone)) {
      newErrors.phone = "Enter valid 10 digit phone";
    }

    if (!/^\S+@\S+\.\S+$/.test(lead.email)) {
      newErrors.email = "Enter valid email";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  async function handleSubmit() {
    if (!validate()) return;

    try {
      await addDoc(collection(db, "brochureLeads"), {
        ...lead,
        propertySlug: property.slug,
        propertyTitle: property.title,
        createdAt: serverTimestamp(),
      });

      // Clear form
      setLead({ name: "", email: "", phone: "" });

      // 🔥 CLOSE FORM FIRST
      setShowBrochurePopup(false);

      // 🔥 SHOW THANK YOU AFTER CLOSE
      setTimeout(() => setShowThankYou(true), 150);

      // 🔥 Download brochure
      if (property?.brochure?.url) {
        setTimeout(() => {
          window.open(property.brochure.url, "_blank");
        }, 400);
      }

      // 🔥 Hide thank you after 2 sec
      setTimeout(() => setShowThankYou(false), 2200);

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

            <p className="text-sm text-[#F5A300]">{property.location}</p>

            <div className="flex flex-col gap-2 mt-1 text-sm text-gray-600">
              {typeof property.builderName === "string" && (
                <div className="flex items-center gap-2">
                  <span className="w-7 h-7 flex items-center justify-center rounded-full bg-gray-100 text-xs">
                    🏢
                  </span>
                  <span>
                    By{" "}
                    <span className="text-[#F5A300]">
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
              <div>
                <input
                  type="text"
                  placeholder="Full Name*"
                  value={lead.name}
                  onChange={(e) =>
                    setLead({ ...lead, name: e.target.value })
                  }
                  className="w-full border rounded-md px-4 py-2 text-sm"
                />
                {errors.name && (
                  <p className="text-xs text-red-500 mt-1">{errors.name}</p>
                )}
              </div>

              <div>
                <input
                  type="email"
                  placeholder="Email Address*"
                  value={lead.email}
                  onChange={(e) =>
                    setLead({ ...lead, email: e.target.value })
                  }
                  className="w-full border rounded-md px-4 py-2 text-sm"
                />
                {errors.email && (
                  <p className="text-xs text-red-500 mt-1">{errors.email}</p>
                )}
              </div>

              <div>
                <input
                  type="tel"
                  placeholder="Contact Number*"
                  value={lead.phone}
                  onChange={(e) =>
                    setLead({ ...lead, phone: e.target.value })
                  }
                  className="w-full border rounded-md px-4 py-2 text-sm"
                />
                {errors.phone && (
                  <p className="text-xs text-red-500 mt-1">{errors.phone}</p>
                )}
              </div>
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
      {/* ✅ THANK YOU POPUP */}
      {showThankYou && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center">
          <div className="bg-white rounded-xl p-20 text-center shadow-xl">
            <h3 className="text-lg font-semibold text-[#c8950a]">
              Thank You 🙌
            </h3>
            <p className="text-sm mt-1">
              Your brochure is downloading.
            </p>
          </div>
        </div>
      )}
      {/* ================= MOBILE QUICK FACTS ================= */}
      <div className="lg:hidden bg-white rounded-xl p-5 shadow-sm mt-4">
        <h3 className="font-semibold mb-3 border-b pb-2">
          Quick Facts
        </h3>

        <div className="text-sm space-y-2 text-gray-600">
          <p>Project Area : {property.projectArea || "-"}</p>
          <p>Project Type : {property.projectType || "-"}</p>
          <p>Project Status : {property.projectStatus || "-"}</p>
          <p>Project Elevation / Tower : {property.projectElevation || "-"}</p>
          <p>RERA No : {property.rera || "-"}</p>
          <p>Possession : {property.possession || "-"}</p>
        </div>
      </div>


    </>
  );
}
