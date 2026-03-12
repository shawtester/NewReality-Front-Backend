"use client";

import { useState } from "react";

export default function FAQ({ data, handleData }) {
  const [faq, setFaq] = useState({ question: "", answer: "" });
  const [editIndex, setEditIndex] = useState(null);

  const addFaq = () => {
    if (!faq.question || !faq.answer) return;

    let updatedFaq = [...(data.faq || [])];

    if (editIndex !== null) {
      // Update existing FAQ
      updatedFaq[editIndex] = faq;
      setEditIndex(null);
    } else {
      // Add new FAQ
      updatedFaq.push(faq);
    }

    handleData("faq", updatedFaq);
    setFaq({ question: "", answer: "" });
  };

  const editFaq = (index) => {
    const selected = data.faq[index];
    setFaq(selected);
    setEditIndex(index);
  };

  const deleteFaq = (index) => {
    const updatedFaq = (data.faq || []).filter((_, i) => i !== index);
    handleData("faq", updatedFaq);
  };

  return (
    <div className="bg-white rounded-xl p-6 space-y-4 shadow-sm">
      <h2 className="text-lg font-semibold">FAQ</h2>

      <input
        placeholder="Question"
        value={faq.question}
        onChange={(e) => setFaq({ ...faq, question: e.target.value })}
        className="border w-full px-3 py-2 rounded"
      />

      <textarea
        placeholder="Answer"
        value={faq.answer}
        onChange={(e) => setFaq({ ...faq, answer: e.target.value })}
        className="border w-full px-3 py-2 rounded"
      />

      <button
        type="button"
        onClick={addFaq}
        className="bg-black text-white px-4 py-2 rounded"
      >
        {editIndex !== null ? "Update FAQ" : "Add"}
      </button>

      {(data.faq || []).map((f, i) => (
        <div key={i} className="border rounded p-3 flex justify-between items-start gap-4">
          <div>
            <p className="font-medium">{f.question}</p>
            <p className="text-sm text-gray-600">{f.answer}</p>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => editFaq(i)}
              className="text-blue-600 text-sm"
            >
              Edit
            </button>

            <button
              type="button"
              onClick={() => deleteFaq(i)}
              className="text-red-600 text-sm"
            >
              Delete
            </button>
          </div>
        </div>
      ))}

      <div className="flex items-center gap-3 mt-4">
        <input
          type="checkbox"
          checked={data.isActive}
          onChange={(e) => handleData("isActive", e.target.checked)}
          className="w-4 h-4 accent-[#DBA40D]"
        />

        <label className="text-sm text-gray-700">
          Show on Website (Active Property)
        </label>
      </div>
    </div>
  );
}