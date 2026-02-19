"use client";

import { useEffect, useState } from "react";
import RichEditors from "@/app/components/RichEditor";

export default function ContentEditor({ formData, setFormData }) {
  const [tocItems, setTocItems] = useState([]);

  const generateTOC = (html) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");

    const headings = doc.querySelectorAll("h2, h3");
    const items = [];

    headings.forEach((el, index) => {
      const id = `section-${index + 1}`;
      el.setAttribute("id", id);

      items.push({
        id,
        label: el.innerText,
      });
    });

    setTocItems(items);

    setFormData((prev) => ({
      ...prev,
      toc: items,
      content: doc.body.innerHTML,
    }));
  };

  const handleEditorChange = (data) => {
    generateTOC(data);
  };

  useEffect(() => {
    if (formData.content) {
      generateTOC(formData.content);
    }
  }, []);

  return (
    <div className="bg-white p-8 rounded-2xl shadow-md space-y-6">

      <h2 className="text-xl font-semibold border-b pb-3">
        Blog Content
      </h2>

      <RichEditors
        value={formData.content}
        onChange={handleEditorChange}
      />

      {tocItems.length > 0 && (
        <div className="mt-6 border rounded-xl p-5 bg-gray-50">
          <h3 className="font-semibold mb-4">
            Generated Table of Contents
          </h3>

          <ul className="space-y-2">
            {tocItems.map((item) => (
              <li key={item.id} className="text-sm text-gray-700">
                🔹 {item.label}
                <span className="text-gray-400 ml-2">
                  (#{item.id})
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
