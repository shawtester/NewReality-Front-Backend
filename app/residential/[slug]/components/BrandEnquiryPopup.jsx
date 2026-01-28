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
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Save enquiry to Firestore
      await addDoc(collection(db, "contacts"), {
        ...formData,
        propertyTitle,
        source: "property", // mark this as property enquiry
        status: "new",
        createdAt: serverTimestamp(),
      });

      toast.success("Enquiry submitted successfully ✅");
      setFormData({ name: "", phone: "", email: "", message: "" });
      onClose();
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
            <Image src="/images/logo.png" alt="Neev Realty" width={36} height={36} />
            <h2 className="text-xl font-semibold">
              Enquire <span className="text-[#F5A300]">Now</span>
            </h2>
          </div>

          {/* FORM */}
          <form className="space-y-3" onSubmit={handleSubmit}>
            {/* INTERESTED IN */}
            <p className="text-sm font-semibold text-gray-800">
              I Am Interested In{" "}
              <span className="block mt-1 text-sm text-[#c8950a] font-medium">
                {propertyTitle}
              </span>
            </p>

            <input
              type="text"
              name="name"
              placeholder="Name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-md px-4 py-2 outline-none focus:border-[#F5A300]"
            />

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
                required
                className="flex-1 px-4 py-2 outline-none"
              />
            </div>

            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-md px-4 py-2 outline-none focus:border-[#F5A300]"
            />

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
