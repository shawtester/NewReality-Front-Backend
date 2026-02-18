"use client";

import { Trash2, Plus } from "lucide-react";

export default function FAQBuilder({ formData, setFormData }) {

  /* ========================= */
  /* 🔹 ADD FAQ                */
  /* ========================= */

  const addFaq = () => {
    setFormData((prev) => ({
      ...prev,
      faqs: [
        ...(prev.faqs || []),
        {
          id: crypto.randomUUID(),
          question: "",
          answer: "",
        },
      ],
    }));
  };

  /* ========================= */
  /* 🔹 UPDATE FAQ             */
  /* ========================= */

  const handleChange = (id, field, value) => {
    setFormData((prev) => ({
      ...prev,
      faqs: prev.faqs.map((faq) =>
        faq.id === id ? { ...faq, [field]: value } : faq
      ),
    }));
  };

  /* ========================= */
  /* 🔹 DELETE FAQ             */
  /* ========================= */

  const deleteFaq = (id) => {
    setFormData((prev) => ({
      ...prev,
      faqs: prev.faqs.filter((faq) => faq.id !== id),
    }));
  };

  return (
    <div className="bg-white p-8 rounded-2xl shadow-md space-y-6">

      <div className="flex justify-between items-center border-b pb-3">
        <h2 className="text-xl font-semibold">
          Frequently Asked Questions
        </h2>

        <button
          type="button"
          onClick={addFaq}
          className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg text-sm"
        >
          <Plus size={16} />
          Add FAQ
        </button>
      </div>

      {/* ========================= */}
      {/* 🔹 FAQ LIST               */}
      {/* ========================= */}

      {formData.faqs?.length === 0 && (
        <p className="text-sm text-gray-500">
          No FAQs added yet.
        </p>
      )}

      {formData.faqs?.map((faq, index) => (
        <div
          key={faq.id}
          className="border rounded-xl p-5 space-y-4 bg-gray-50"
        >

          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-600">
              FAQ {index + 1}
            </span>

            <button
              type="button"
              onClick={() => deleteFaq(faq.id)}
              className="text-red-500 hover:text-red-700"
            >
              <Trash2 size={18} />
            </button>
          </div>

          {/* 🔹 QUESTION */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-600">
              Question
            </label>
            <input
              type="text"
              value={faq.question}
              onChange={(e) =>
                handleChange(faq.id, "question", e.target.value)
              }
              placeholder="Enter question"
              className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          {/* 🔹 ANSWER */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-600">
              Answer
            </label>
            <textarea
              rows={4}
              value={faq.answer}
              onChange={(e) =>
                handleChange(faq.id, "answer", e.target.value)
              }
              placeholder="Enter answer"
              className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>

        </div>
      ))}

    </div>
  );
}
