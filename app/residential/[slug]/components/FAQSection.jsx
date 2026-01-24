"use client";

export default function FAQSection({ faq = [] }) {
  // Agar FAQ hi nahi hai → section mat dikhao
  if (!faq || faq.length === 0) return null;

  return (
    <section id="faq" className="max-w-[1240px] mx-auto px-4 mt-16">
      {/* HEADER */}
      <div className="bg-[#F4F6F6] rounded-xl p-8">
        <h2 className="text-lg font-semibold mb-6">
          Frequently Asked Questions
          <span className="block w-10 h-[2px] bg-pink-600 mt-2"></span>
        </h2>

        {/* FAQ LIST */}
        <div className="space-y-4">
          {faq.map((item, i) => (
            <details
              key={i}
              className="group bg-white border rounded-lg px-5 py-4"
            >
              {/* QUESTION */}
              <summary className="flex justify-between items-center cursor-pointer list-none">
                <span className="text-sm font-medium text-gray-800">
                  {item.q}
                </span>

                {/* ARROW */}
                <span className="transition-transform duration-300 group-open:rotate-180">
                  ▼
                </span>
              </summary>

              {/* ANSWER */}
              <p className="mt-3 text-sm text-gray-600 leading-relaxed">
                {item.a}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
