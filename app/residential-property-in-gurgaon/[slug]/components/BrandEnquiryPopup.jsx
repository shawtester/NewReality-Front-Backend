"use client";

import Image from "next/image";
import { FaTimes } from "react-icons/fa";
import { useEffect, useState } from "react";
import Portal from "./Portal";
import toast from "react-hot-toast";
import logger from "@/lib/logger";
import { saveLead } from "@/lib/saveLead";

export default function BrandEnquiryPopup({ open, onClose, propertyTitle }) {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    message: "",
    countryCode: "+91",
  });

  const [loading, setLoading] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);
  const [errors, setErrors] = useState({});

  /* Disable scroll when modal or thank you is open */
  useEffect(() => {
    const shouldLock = open || showThankYou;
    if (shouldLock) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [open, showThankYou]);

  /* 👉 Important */
  if (!open && !showThankYou) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  /* ================= VALIDATION ================= */
  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = "Name is required";
    
    // Improved validation: strict for India, flexible for others
    if (formData.countryCode === "+91") {
      if (!/^[6-9]\d{9}$/.test(formData.phone)) {
        newErrors.phone = "Enter valid 10 digit phone";
      }
    } else {
      if (!/^\d{7,15}$/.test(formData.phone)) {
        newErrors.phone = "Enter valid phone number";
      }
    }

    if (!/^\S+@\S+\.\S+$/.test(formData.email))
      newErrors.email = "Enter valid email";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);

    try {
      await saveLead({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        countryCode: formData.countryCode,
        propertyTitle: propertyTitle,
        source: "property-detail",
        message: formData.message
      });

      toast.success("Enquiry submitted successfully ✅");

      setFormData({ name: "", phone: "", email: "", message: "", countryCode: "+91" });

      // 👉 form close first
      onClose();

      // 👉 show thank you after close
      setShowThankYou(true);
      setTimeout(() => setShowThankYou(false), 2200);
    } catch (err) {
      logger.error("BrandEnquiryPopup submit error", err, { propertyTitle });
      toast.error("Failed to submit enquiry ❌");
    } finally {
      setLoading(false);
    }
  };

  const countries = [
    { label: "India (+91)", value: "+91" },
    { label: "USA (+1)", value: "+1" },
    { label: "UK (+44)", value: "+44" },
    { label: "Australia (+61)", value: "+61" },
    { label: "Canada (+1)", value: "+1" },
    { label: "Germany (+49)", value: "+49" },
    { label: "UAE (+971)", value: "+971" },
  ];

  return (
    <Portal>
      {/* ================= FORM MODAL ================= */}
      {open && (
        <div className="fixed inset-0 z-[99999] bg-black/60 flex items-center justify-center px-4">
          <div className="relative bg-white w-full max-w-sm rounded-2xl p-5 shadow-xl">
            <button
              onClick={onClose}
              className="absolute top-3 right-3 text-gray-400 hover:text-black"
            >
              <FaTimes size={14} />
            </button>

            <div className="flex items-center gap-3 mb-3">
              <Image
                src="/images/neevlogo.png"
                alt="Neev Realty"
                width={36}
                height={36}
              />
              <h2 className="text-xl font-semibold">
                Enquire <span className="text-[#F5A300]">Now</span>
              </h2>
            </div>

            <form className="space-y-3" onSubmit={handleSubmit}>
              <p className="text-sm font-semibold text-gray-800">
                I Am Interested In
                <span className="block mt-1 text-sm text-[#c8950a] font-medium">
                  {propertyTitle}
                </span>
              </p>

              <div>
                <input
                  type="text"
                  name="name"
                  placeholder="Name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md px-4 py-2 outline-none focus:border-[#F5A300]"
                />
                {errors.name && (
                  <p className="text-xs text-red-500 mt-1">{errors.name}</p>
                )}
              </div>

              <div>
                <div className="flex border border-gray-300 rounded-md overflow-hidden">
                  <select 
                    name="countryCode"
                    value={formData.countryCode}
                    onChange={handleChange}
                    className="px-3 text-sm bg-gray-50 outline-none border-r max-w-[100px]"
                  >
                    {countries.map((c, i) => (
                      <option key={`${c.value}-${i}`} value={c.value}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="flex-1 px-4 py-2 outline-none"
                  />
                </div>
                {errors.phone && (
                  <p className="text-xs text-red-500 mt-1">{errors.phone}</p>
                )}
              </div>

              <div>
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md px-4 py-2 outline-none focus:border-[#F5A300]"
                />
                {errors.email && (
                  <p className="text-xs text-red-500 mt-1">{errors.email}</p>
                )}
              </div>

              <textarea
                rows={2}
                name="message"
                placeholder="Message (optional)"
                value={formData.message}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm outline-none resize-none focus:border-[#F5A300]"
              />

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-3 bg-[#c8950a] text-white py-2.5 rounded-md font-medium hover:brightness-105"
              >
                {loading ? "Submitting..." : "Submit"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ================= THANK YOU POPUP ================= */}
      {showThankYou && (
        <div className="fixed inset-0 z-[100000] flex items-center justify-center pointer-events-auto bg-black/20">
          <div className="bg-white rounded-xl p-10 md:p-20 text-center shadow-xl animate-fadeIn relative">
            <button
                onClick={() => setShowThankYou(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-black pointer-events-auto"
              >
                <FaTimes size={14} />
            </button>
            <h3 className="text-lg font-semibold text-[#c8950a]">
              Thank You 🙌
            </h3>
            <p className="text-sm mt-1">
              Our team will contact you shortly.
            </p>
          </div>
        </div>
      )}
    </Portal>
  );
}
