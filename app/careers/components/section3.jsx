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
          <h2 className="text-3xl font-semibold md:text-4xl">
            What we <span className="text-[#DBA40D]">Offer</span>
          </h2>

          {/* BENEFITS */}
          <div className="grid gap-6 md:grid-cols-2">
            {[benefitsLeft, benefitsRight].map((group, i) => (
              <div key={i} className="space-y-4">
                {group.map((item) => (
                  <div
                    key={item}
                    className="rounded-md border bg-white px-6 py-4 text-sm font-medium text-slate-600 shadow-sm"
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
          <div className="mx-auto max-w-6xl rounded-3xl bg-slate-50 px-6 py-10 lg:px-16">
            <h3 className="text-3xl font-semibold md:text-4xl">
              Join Our <span className="text-[#DBA40D]">Team</span>
            </h3>

            <p className="mt-4 max-w-xl text-sm text-slate-600">
              At Neev Realty, your ideas matter and your career grows with us.
            </p>

            <button
              onClick={() => setShowResumePopup(true)}
              className="mt-6 rounded-lg bg-[#DBA40D] px-8 py-3 text-sm font-semibold text-white"
            >
              Send your Resume
            </button>
          </div>
        </div>
      </section>

      {/* RESUME POPUP */}
      {showResumePopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="relative w-full max-w-2xl rounded-xl bg-white p-6 shadow-2xl">
            <button
              onClick={() => setShowResumePopup(false)}
              className="absolute right-3 top-3 text-xl"
            >
              ✕
            </button>

            <h3 className="text-xl font-semibold mb-2">
              Submit Your Resume
            </h3>

            <form className="space-y-3">
              <input className="input" placeholder="Full Name*" />
              <input className="input" placeholder="Email*" />
              <input className="input" placeholder="Mobile*" />
              <input type="file" />
              <button className="w-full bg-[#DBA40D] py-2 text-white rounded-lg">
                Submit Resume
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default WhatWeOffer;
