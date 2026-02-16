"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { FaTimes } from "react-icons/fa";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import toast from "react-hot-toast";

export default function GetInTouchModal({
  open,
  onClose,
  propertyTitle = "Property Inquiry",
}) {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);
  const [errors, setErrors] = useState({});

  /* Scroll lock */
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [open]);

  if (!open && !showThankYou) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  /* VALIDATION */
  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = "Name is required";

    if (!/^[6-9]\d{9}$/.test(formData.phone))
      newErrors.phone = "Enter valid 10 digit phone";

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
      await addDoc(collection(db, "contacts"), {
        ...formData,
        propertyTitle,
        source: "get-in-touch-modal",
        status: "new",
        createdAt: serverTimestamp(),
      });

      toast.success("Enquiry submitted successfully ✅");

      setFormData({
        name: "",
        phone: "",
        email: "",
        message: "",
      });

      // 👉 Close form first
      onClose();

      // 👉 Show thank you after close
      setTimeout(() => setShowThankYou(true), 150);
      setTimeout(() => setShowThankYou(false), 2400);
    } catch (err) {
      console.error(err);
      toast.error("Save failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* ================= FORM MODAL ================= */}
      {open && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/60 px-4">
          <div className="relative w-full max-w-md bg-white rounded-2xl p-4 shadow-xl">
            <button
              onClick={onClose}
              className="absolute right-4 top-4 text-gray-400 hover:text-black"
            >
              <FaTimes size={18} />
            </button>

            <div className="flex items-center gap-2">
              <Image
                src="/images/neevlogo.png"
                alt="Neev Realty"
                width={38}
                height={38}
              />
              <h2 className="text-xl font-semibold">
                Get in <span className="text-[#F5A300]">Touch</span>
              </h2>
            </div>

            <p className="text-sm text-gray-500 mt-1">
              Please fill in your details below and we will get in touch with you shortly
            </p>

            <form className="mt-4 space-y-3" onSubmit={handleSubmit}>
              <p className="text-sm font-semibold text-gray-800">
                I Am Interested In
                <span className="block mt-1 text-sm text-[#c8950a] font-medium">
                  {propertyTitle}
                </span>
              </p>

              <input
                name="name"
                type="text"
                placeholder="Name"
                value={formData.name}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-4 py-2 outline-none focus:border-[#F5A300]"
              />
              {errors.name && (
                <p className="text-xs text-red-500">{errors.name}</p>
              )}

              <div className="flex border border-gray-300 rounded-md overflow-hidden">
                <select className="px-3 text-sm bg-gray-50 outline-none border-r">
                  <option>+91 India</option>
                  <option value="+1">United States (+1)</option>
<option value="+1">Canada (+1)</option>
<option value="+44">United Kingdom (+44)</option>
<option value="+91">India (+91)</option>
<option value="+61">Australia (+61)</option>
<option value="+49">Germany (+49)</option>
<option value="+33">France (+33)</option>
<option value="+81">Japan (+81)</option>
<option value="+55">Brazil (+55)</option>
<option value="+86">China (+86)</option>
<option value="+39">Italy (+39)</option>
<option value="+52">Mexico (+52)</option>
<option value="+7">Russia (+7)</option>
<option value="+82">South Korea (+82)</option>
<option value="+34">Spain (+34)</option>

                </select>
                <input
                  name="phone"
                  type="tel"
                  placeholder="Phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="flex-1 px-3 py-2 outline-none"
                />
              </div>
              {errors.phone && (
                <p className="text-xs text-red-500">{errors.phone}</p>
              )}

              <input
                name="email"
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 outline-none focus:border-[#F5A300]"
              />
              {errors.email && (
                <p className="text-xs text-red-500">{errors.email}</p>
              )}

              <textarea
                name="message"
                placeholder="Your Message"
                rows={2}
                value={formData.message}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 outline-none resize-none focus:border-[#F5A300]"
              />

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-4 bg-[#c8950a] text-white py-3 rounded-md font-medium hover:brightness-105"
              >
                {loading ? "Sending..." : "Get a Call"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ================= THANK YOU POPUP ================= */}
      {showThankYou && (
        <div className="fixed inset-0 z-[100000] flex items-center justify-center pointer-events-none">
          <div className="bg-white rounded-xl p-20 text-center shadow-xl animate-fadeIn">
            <h3 className="text-lg font-semibold text-[#c8950a]">
              Thank You 🙌
            </h3>
            <p className="text-sm mt-1">
              Our team will contact you shortly.
            </p>
          </div>
        </div>
      )}
    </>
  );
}
