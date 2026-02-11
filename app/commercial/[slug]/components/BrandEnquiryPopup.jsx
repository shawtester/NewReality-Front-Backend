"use client";

import Image from "next/image";
import { FaTimes } from "react-icons/fa";
import { useEffect, useState } from "react";
import Portal from "./Portal";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import toast from "react-hot-toast";

export default function BrandEnquiryPopup({ open, onClose, propertyTitle }) {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);

  /* ✅ NEW — THANK YOU POPUP STATE */
  const [showThankYou, setShowThankYou] = useState(false);

  /* ✅ NEW — VALIDATION ERRORS */
  const [errors, setErrors] = useState({});

  // Disable scroll when popup is open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [open]);

  if (!open) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  /* ================= VALIDATION ================= */
  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!/^[6-9]\d{9}$/.test(formData.phone)) {
      newErrors.phone = "Enter valid 10 digit phone";
    }

    if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = "Enter valid email";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    /* ✅ VALIDATION CHECK */
    if (!validate()) return;

    setLoading(true);

    try {
      await addDoc(collection(db, "contacts"), {
        ...formData,
        propertyTitle,
        source: "property",
        status: "new",
        createdAt: serverTimestamp(),
      });

      toast.success("Enquiry submitted successfully ✅");

      setFormData({ name: "", phone: "", email: "", message: "" });

      /* ✅ SHOW THANK YOU POPUP */
      setShowThankYou(true);

      /* Auto close after 2 sec */
      setTimeout(() => {
        setShowThankYou(false);
        onClose();
      }, 2000);

    } catch (err) {
      console.error(err);
      toast.error("Failed to submit enquiry ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Portal>
      {/* OVERLAY */}
      <div className="fixed inset-0 z-[99999] bg-black/60 flex items-center justify-center px-4">

        {/* ================= THANK YOU POPUP ================= */}
        {showThankYou && (
          <div className="fixed inset-0 z-[100000] flex items-center justify-center">
            <div className="bg-white rounded-xl px-6 py-5 text-center shadow-xl animate-fadeIn">
              <h3 className="text-lg font-semibold text-[#c8950a]">
                Thank You 🙌
              </h3>
              <p className="text-sm mt-1">
                Our team will contact you shortly.
              </p>
            </div>
          </div>
        )}


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
            <Image src="/images/neevlogo.png" alt="Neev Realty" width={36} height={36} />
            <h2 className="text-xl font-semibold">
              Enquire <span className="text-[#F5A300]">Now</span>
            </h2>
          </div>

          {/* FORM */}
          <form className="space-y-3" onSubmit={handleSubmit}>
            <p className="text-sm font-semibold text-gray-800">
              I Am Interested In{" "}
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
                <select className="px-3 text-sm bg-gray-50 outline-none border-r">
                  <option>+91 India</option>
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
    </Portal>
  );
}

