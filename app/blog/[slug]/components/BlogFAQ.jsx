"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

export default function BlogFAQ({ faqs }) {
  const [openId, setOpenId] = useState(null);

  if (!faqs?.length) return null;

  const toggleFaq = (id) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section className="max-w-[1240px] px-4 space-y-8">

      {/* ================= HEADING ================= */}
      <div>
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
          Frequently Asked Questions
        </h2>
        <p className="text-gray-500 mt-2 text-sm">
          Everything you need to know about this topic.
        </p>
      </div>

      {/* ================= FAQ LIST ================= */}
      <div className="divide-y border rounded-2xl bg-white shadow-sm">

        {faqs.map((faq, index) => {
          const id = faq.id || index;

          return (
            <div key={id} className="group">

              {/* QUESTION */}
              <button
                onClick={() => toggleFaq(id)}
                className="w-full flex justify-between items-center text-left px-6 py-5 hover:bg-gray-50 transition"
              >
                <span className="font-medium text-gray-900">
                  {faq.question}
                </span>

                <ChevronDown
                  size={20}
                  className={`transition-transform duration-300 ${
                    openId === id ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* ANSWER */}
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  openId === id
                    ? "max-h-[500px] opacity-100"
                    : "max-h-0 opacity-0"
                }`}
              >
                <div
                  className="px-6 pb-6 text-gray-600 text-sm leading-relaxed"
                  dangerouslySetInnerHTML={{
                    __html: faq.answer,
                  }}
                />
              </div>

            </div>
          );
        })}

      </div>

    </section>
  );
}

