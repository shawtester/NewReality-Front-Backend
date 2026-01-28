"use client";

import { useState } from "react";

const benefitsLeft = [
  "Health Benefits",
  "Employee Recognition Platform",
  "Professional Development",
  "Access to Industry Events",
];

const benefitsRight = [
  "100% Company Paid Life Insurance",
  "Work-Life Balance",
  "Diversity & Inclusion Initiatives",
];

const WhatWeOffer = () => {
  const [showResumePopup, setShowResumePopup] = useState(false);

  return (
    <>
      <section className="w-full bg-[#F6FAFF] py-16">
        <div className="mx-auto max-w-6xl space-y-12 px-4">
          {/* HEADING */}
          <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
            What we <span className="text-[#DBA40D]">Offer</span>
          </h2>

          {/* BENEFITS */}
          <div className="grid gap-6 md:grid-cols-2">
            {[benefitsLeft, benefitsRight].map((group, i) => (
              <div key={i} className="space-y-4">
                {group.map((item) => (
                  <div
                    key={item}
                    className="rounded-md border border-[#E4EDF8] bg-white px-6 py-4 text-sm font-medium text-slate-600 shadow-sm"
                  >
                    {item}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* JOIN TEAM */}
        <div className="mt-14 px-4">
          <div className="mx-auto max-w-6xl rounded-3xl bg-slate-50 px-6 py-10 md:px-10 lg:px-16">
            <div className="max-w-xl space-y-6">
              <h3 className="text-3xl font-semibold md:text-4xl">
                Join Our <span className="text-[#DBA40D]">Team</span>
              </h3>

              <p className="text-sm text-slate-600">
                At Neev Realty, your ideas matter and your career grows with us.
              </p>

              <button
                onClick={() => setShowResumePopup(true)}
                className="rounded-lg bg-[#DBA40D] px-8 py-3 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(219,164,13,0.45)] hover:brightness-110"
              >
                Send your Resume
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ================= RESUME POPUP ================= */}
      {showResumePopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-2 md:p-4">
          <div className="relative w-full max-w-2xl rounded-xl bg-white p-3 md:p-4 lg:p-8 shadow-2xl max-h-[90dvh] overflow-y-auto">
            
            {/* CLOSE */}
            <button
              onClick={() => setShowResumePopup(false)}
              className="absolute right-2 top-2 md:right-4 md:top-4 text-xl text-gray-400 hover:text-black"
            >
              ✕
            </button>

            {/* HEADER */}
            <h3 className="text-xl md:text-2xl font-semibold text-gray-900 mb-1 md:mb-2">
              Submit Your Resume
            </h3>
            <p className="text-xs md:text-sm text-gray-500 mb-3 md:mb-4">
              Please fill in your details below and upload your resume.
            </p>

            {/* FORM GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-3 lg:gap-4">
              <input
                type="text"
                placeholder="Full Name*"
                className="border rounded-md px-3 md:px-4 py-2.5 text-sm focus:border-[#DBA40D] outline-none"
              />
              <input
                type="email"
                placeholder="Email Address*"
                className="border rounded-md px-3 md:px-4 py-2.5 text-sm focus:border-[#DBA40D] outline-none"
              />
              <input
                type="tel"
                placeholder="Mobile Number*"
                className="border rounded-md px-3 md:px-4 py-2.5 text-sm focus:border-[#DBA40D] outline-none"
              />

              <select className="border rounded-md px-3 md:px-4 py-2.5 text-sm text-gray-600 focus:border-[#DBA40D] outline-none">
                <option>Applying For Position*</option>
                <option>Sales Executive</option>
                <option>Marketing Manager</option>
                <option>Channel Partner</option>
                <option>Operations</option>
              </select>

              <select className="border rounded-md px-3 md:px-4 py-2.5 text-sm text-gray-600 focus:border-[#DBA40D] outline-none">
                <option>Total Work Experience</option>
                <option>Fresher</option>
                <option>1–2 Years</option>
                <option>3–5 Years</option>
                <option>5+ Years</option>
              </select>

              {/* FILE */}
              <div className="md:col-span-2 border rounded-md px-3 md:px-4 py-2.5">
                <input
                  type="file"
                  className="w-full text-sm file:mr-4 file:rounded-md file:border-0 file:bg-[#DBA40D] file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-[#c8950a]"
                />
              </div>
            </div>

            {/* TEXTAREA */}
            <textarea
              rows={2}
              placeholder="Briefly describe your experience (optional)"
              className="mt-3 w-full border rounded-md px-3 md:px-4 py-2.5 text-sm focus:border-[#DBA40D] outline-none"
            />

            {/* SUBMIT */}
            <button className="mt-4 w-full rounded-lg bg-[#DBA40D] py-2.5 md:py-3 text-sm font-semibold text-white hover:bg-[#c8950a]">
              Submit Resume
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default WhatWeOffer;
