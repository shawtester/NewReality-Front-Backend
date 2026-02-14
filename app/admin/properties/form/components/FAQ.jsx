"use client";

import { useState } from "react";

export default function FAQ({ data, handleData }) {
  const [faq, setFaq] = useState({ question: "", answer: "" });

  const addFaq = () => {
    if (!faq.question || !faq.answer) return;
    handleData("faq", [...(data.faq || []), faq]);
    setFaq({ question: "", answer: "" });
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

      <button type="button" onClick={addFaq} className="bg-black text-white px-4 py-2 rounded">
        Add
      </button>

      {data.faq?.map((f, i) => (
        <div key={i} className="border rounded p-3">
          {f.question} — {f.answer}
        </div>
      ))}
      <div className="flex items-center gap-3 mt-4">
        <input
          type="checkbox"
          checked={data.isActive}
          onChange={(e) =>
            handleData("isActive", e.target.checked)
          }
          className="w-4 h-4 accent-[#DBA40D]"
        />

        <label className="text-sm text-gray-700">
          Show on Website (Active Property)
        </label>
      </div>

    </div>
  );
}
