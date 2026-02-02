"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

/* ================= COUNTRY CODES ================= */
const countries = [
  { code: "+91", label: "🇮🇳 India" },
  { code: "+1", label: "🇺🇸 USA" },
  { code: "+44", label: "🇬🇧 UK" },
  { code: "+61", label: "🇦🇺 Australia" },
  { code: "+971", label: "🇦🇪 UAE" },
];

export default function PropertyCard({ property = {} }) {
  const [open, setOpen] = useState(false);
  const [countryCode, setCountryCode] = useState("+91");

  // 🔹 FORM STATE (LOGIC ONLY)
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const {
    title = "",
    builder = "",
    location = "",
    bhk = "",
    size = "",
    price = "",
    img = "/images/placeholder.jpg",
    slug = "",
    isRera = false,
  } = property;

  // 🔹 SUBMIT HANDLER
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await addDoc(collection(db, "contacts"), {
        name: form.name,
        email: form.email,
        phone: `${countryCode}${form.phone}`,
        message: form.message,
        source: "property-card",
        propertyTitle: title,
        createdAt: serverTimestamp(),
      });

      setForm({ name: "", email: "", phone: "", message: "" });
      setOpen(false);
    } catch (error) {
      console.error("Contact submit error:", error);
    }
  };

  return (
    <>
      {/* ================= CARD ================= */}
      <Link href={slug ? `/residential/${slug}` : "#"}>
        <div
          className="
            group flex h-full w-full flex-col overflow-hidden rounded-xl
            bg-white shadow-sm hover:shadow-md transition-all duration-300
            hover:scale-[1.02] hover:-translate-y-1 hover:shadow-lg cursor-pointer
            md:h-72 lg:h-80 xl:h-96 border-1
          "
        >
          {/* IMAGE */}
          <div className="relative h-32 md:h-40 lg:h-44 xl:h-48 w-full">
            <Image src={img} alt={title} fill className="object-cover" />
          </div>

          {/* CONTENT */}
          <div className="flex flex-1 flex-col px-2 py-2 md:px-3 md:py-3 lg:px-4 lg:py-4">
            {/* TITLE + RERA */}
            <div className="flex items-center justify-between gap-1 md:gap-2">
              <h3 className="text-xs md:text-sm lg:text-base font-semibold text-gray-900 line-clamp-1">
                {title}
              </h3>

              {isRera && (
                <span className="flex items-center gap-1 rounded-full bg-[#f3f3f3] px-2 py-1 text-[10px] font-medium text-gray-600">
                  RERA
                  <Image
                    src="/images/newlaunchproject/rera.png"
                    alt="RERA"
                    width={12}
                    height={12}
                  />
                </span>
              )}

            </div>

            {/* BUILDER */}
            <p className="mt-1 text-[11px] md:text-xs lg:text-sm text-gray-500">
              By <span className="font-medium text-gray-700">{builder}</span>
            </p>

            {/* LOCATION */}
            <p className="mt-1 text-[11px] md:text-xs lg:text-sm text-gray-500">
              {location}
            </p>

            {/* DETAILS */}
            <div className="mt-2 flex items-center justify-between text-[11px] md:text-xs lg:text-sm text-gray-500">
              <span>{bhk}</span>
              <span>{size}</span>
            </div>

            <div className="my-2 md:my-3 lg:my-4 h-px w-full bg-gray-200" />

            {/* PRICE + CONTACT */}
            <div className="flex items-center justify-between gap-2">
              <p className="text-xs md:text-sm lg:text-base font-semibold text-gray-900">
                {price}
              </p>

              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setOpen(true);
                }}
                className="
                  rounded-full bg-[#F5F5F5]
                  px-3 py-1 md:px-4 md:py-1.5 lg:px-5 lg:py-2
                  text-[10px] md:text-xs lg:text-sm font-medium text-[#F5A300]
                  transition-all duration-300
                  group-hover:bg-[#F5A300]
                  group-hover:text-white
                "
              >
                Contact
              </button>
            </div>
          </div>
        </div>
      </Link>

      {/* ================= CONTACT POPUP ================= */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white w-[95%] max-w-lg rounded-2xl shadow-xl p-6 relative">
            {/* CLOSE */}
            <button
              onClick={() => setOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-black"
            >
              ✕
            </button>

            {/* HEADER */}
            <div className="mb-5">
              <h3 className="text-xl font-semibold text-gray-900">
                Get in Touch
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                Interested in{" "}
                <span className="font-medium text-[#F5A300]">
                  {title}
                </span>
              </p>
            </div>

            {/* FORM — ORIGINAL LAYOUT PRESERVED */}
            <form className="space-y-4" onSubmit={handleSubmit}>
              {/* NAME */}
              <div>
                <label className="text-xs font-medium text-gray-600">
                  Full Name
                </label>
                <input
                  type="text"
                  placeholder="Enter your name"
                  className="mt-1 w-full border rounded-lg px-4 py-2 text-sm focus:ring-1 focus:ring-[#F5A300] outline-none"
                  value={form.name}
                  onChange={(e) =>
                    setForm({ ...form, name: e.target.value })
                  }
                  required
                />
              </div>

              {/* PHONE */}
              <div>
                <label className="text-xs font-medium text-gray-600">
                  Phone Number
                </label>
                <div className="mt-1 flex border rounded-lg overflow-hidden">
                  <select
                    value={countryCode}
                    onChange={(e) => setCountryCode(e.target.value)}
                    className="bg-gray-100 px-3 text-sm outline-none"
                  >
                    {countries.map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.label} {c.code}
                      </option>
                    ))}
                  </select>

                  <input
                    type="tel"
                    placeholder="Enter phone number"
                    className="flex-1 px-3 py-2 text-sm outline-none"
                    value={form.phone}
                    onChange={(e) =>
                      setForm({ ...form, phone: e.target.value })
                    }
                    required
                  />
                </div>
              </div>

              {/* EMAIL */}
              <div>
                <label className="text-xs font-medium text-gray-600">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="mt-1 w-full border rounded-lg px-4 py-2 text-sm focus:ring-1 focus:ring-[#F5A300] outline-none"
                  value={form.email}
                  onChange={(e) =>
                    setForm({ ...form, email: e.target.value })
                  }
                  required
                />
              </div>

              {/* MESSAGE */}
              <div>
                <label className="text-xs font-medium text-gray-600">
                  Message (optional)
                </label>
                <textarea
                  rows={3}
                  placeholder="Any specific requirement?"
                  className="mt-1 w-full border rounded-lg px-4 py-2 text-sm focus:ring-1 focus:ring-[#F5A300] outline-none"
                  value={form.message}
                  onChange={(e) =>
                    setForm({ ...form, message: e.target.value })
                  }
                />
              </div>

              {/* SUBMIT */}
              <button
                type="submit"
                className="w-full bg-[#F5A300] text-white py-2.5 rounded-lg text-sm font-semibold hover:bg-[#e39a00] transition"
              >
                Request Callback
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}