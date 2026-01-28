"use client";

import { useEffect } from "react";
import Image from "next/image";
import { FaTimes } from "react-icons/fa";
import { useFormState, useFormStatus } from "react-dom";
import { submitContactForm } from "@/app/actions/contactActions"; // Adjust path

export default function GetInTouchModal({
  open,
  onClose,
  propertyTitle = "Property Inquiry",
}) {
  const [state, formAction] = useFormState(submitContactForm, { 
    success: false, 
    message: "" 
  });

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/60 px-4">
      {/* MODAL */}
      <div className="relative w-full max-w-md bg-white rounded-2xl p-4 shadow-xl">
        {/* CLOSE */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-black"
        >
          <FaTimes size={18} />
        </button>

        {/* HEADER */}
        <div className="flex items-center gap-2">
          <Image
            src="/images/logo.png"
            alt="Neev Realty"
            width={38}
            height={38}
          />
          <h2 className="text-xl font-semibold">
            Get in <span className="text-[#F5A300]">Touch</span>
          </h2>
        </div>

        <p className="text-sm text-gray-500 mt-1">
          Please fill in your details below and we will get in
          touch with you shortly
        </p>

        {/* FORM */}
        <form className="mt-4 space-y-3" action={formAction}>
          <input type="hidden" name="propertyTitle" value={propertyTitle} />

          {/* ✅ SOURCE TRACKING */}
          <input type="hidden" name="source" value="get-in-touch-modal" />

          <p className="text-sm font-semibold text-gray-800">
            I Am Interested In{" "}
            <span className="block mt-1 text-sm text-[#c8950a] font-medium">
              {propertyTitle}
            </span>
          </p>

          <input
            name="name"
            type="text"
            placeholder="Name"
            required
            className="w-full border border-gray-300 rounded-md px-4 py-2 outline-none focus:border-[#F5A300]"
          />

          <div className="flex border border-gray-300 rounded-md overflow-hidden">
            <select className="px-3 text-sm bg-gray-50 outline-none border-r">
              <option>+91 India</option>
            </select>
            <input
              name="phone"
              type="tel"
              placeholder="Phone"
              required
              pattern="[0-9]{10}"
              className="flex-1 px-3 py-1.5 outline-none"
            />
          </div>

          <input
            name="email"
            type="email"
            placeholder="Email"
            required
            className="w-full border border-gray-300 rounded-md px-3 py-1.5 outline-none focus:border-[#F5A300]"
          />

          <textarea
            name="message"
            placeholder="Your Message"
            rows={2}
            className="w-full border border-gray-300 rounded-md px-3 py-1.5 outline-none resize-none focus:border-[#F5A300]"
          />

          <label className="flex items-center gap-3 text-sm text-gray-700">
            <input
              name="terms"
              type="checkbox"
              defaultChecked
              required
              className="w-4 h-4 accent-green-500"
            />
            <span>
              I agree to neevrealty.com{" "}
              <span className="text-red-500 cursor-pointer">
                T&amp;C &amp; Privacy
              </span>
            </span>
          </label>

          <SubmitButton />

          {state.message && (
            <div className={`p-3 rounded-md text-sm font-medium text-center ${
              state.success 
                ? 'bg-green-50 border border-green-200 text-green-800' 
                : 'bg-red-50 border border-red-200 text-red-800'
            }`}>
              {state.message}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full mt-4 bg-[#c8950a] text-white py-3 rounded-md font-medium hover:brightness-105 transition disabled:opacity-50 flex items-center justify-center gap-2"
    >
      {pending ? (
        <>
          <div className="w-4 h-4 border border-white border-t-transparent rounded-full animate-spin" />
          Sending...
        </>
      ) : (
        'Get a Call'
      )}
    </button>
  );
}
