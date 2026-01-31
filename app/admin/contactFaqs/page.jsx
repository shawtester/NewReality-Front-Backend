"use client";

import { useEffect, useState } from "react";
import {
  createFaq,
  getFaqs,
  deleteFaq,
} from "@/lib/firestore/contactFaqs/crud";

export default function AdminFaq() {
  const [faqs, setFaqs] = useState([]);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  async function load() {
    const data = await getFaqs();
    setFaqs(data);
  }

  useEffect(() => {
    load();
  }, []);

  const addFaq = async () => {
    if (!question || !answer) return;

    setLoading(true);
    await createFaq({ question, answer });

    setQuestion("");
    setAnswer("");
    await load();
    setLoading(false);
  };

  const removeFaq = async (id) => {
    await deleteFaq(id);
    load();
  };

  return (
    <div className="p-6 space-y-6">

      {/* Heading */}
      <h1 className="text-xl font-semibold">Contact FAQs</h1>

      {/* ===== Add FAQ Card ===== */}
      <div className="bg-white rounded-xl shadow-sm border p-6 space-y-4">
        <h2 className="font-semibold text-gray-800">
          Add New FAQ
        </h2>

        <input
          placeholder="Enter Question"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          className="border w-full px-3 py-2 rounded-lg focus:ring-2 focus:ring-yellow-500 outline-none"
        />

        <textarea
          placeholder="Enter Answer"
          rows={4}
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          className="border w-full px-3 py-2 rounded-lg focus:ring-2 focus:ring-yellow-500 outline-none"
        />

        <button
          onClick={addFaq}
          disabled={loading}
          className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-2 rounded-lg font-medium"
        >
          {loading ? "Adding..." : "Add FAQ"}
        </button>
      </div>

      {/* ===== FAQ List ===== */}
      <div className="bg-white rounded-xl shadow-sm border p-6 space-y-4">
        <h2 className="font-semibold text-gray-800">
          Existing FAQs
        </h2>

        {faqs.length === 0 && (
          <p className="text-gray-500 text-sm">
            No FAQs added yet.
          </p>
        )}

        {faqs.map((faq) => (
          <div
            key={faq.id}
            className="border rounded-lg p-4 flex justify-between gap-4 hover:bg-gray-50"
          >
            <div>
              <p className="font-medium text-gray-800">
                {faq.question}
              </p>

              <p className="text-sm text-gray-600 mt-1">
                {faq.answer}
              </p>
            </div>

            <button
              onClick={() => removeFaq(faq.id)}
              className="text-red-500 hover:text-red-700 text-sm"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
