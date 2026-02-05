"use client";

import { useEffect, useState } from "react";
import { getFaqs } from "@/lib/firestore/contactFaqs/crud";

export default function Faq() {
  const [faqs, setFaqs] = useState([]);

  useEffect(() => {
    async function load() {
      const data = await getFaqs();
      setFaqs(data);
    }
    load();
  }, []);

  if (!faqs.length) return null;

  return (
    <section className="bg-white px-4 py-16">
      <div className="mx-auto max-w-4xl rounded-xl border p-6 shadow-sm">
        <h3 className="mb-6 text-lg font-semibold">FAQs</h3>

        <div className="divide-y">
          {faqs.map((faq) => (
            <details key={faq.id} className="group py-4">
              <summary className="flex justify-between cursor-pointer">
                <span>{faq.question}</span>
                <span className="group-open:rotate-180">▾</span>
              </summary>

              <p className="mt-3 text-sm text-gray-600">
                {faq.answer}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
