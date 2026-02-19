"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import "react-quill/dist/quill.snow.css";

const ReactQuill = dynamic(() => import("react-quill"), {
  ssr: false,
});

export default function ContentEditor({ formData, setFormData }) {
  const [editorHtml, setEditorHtml] = useState(formData.content || []);
  const [tocItems, setTocItems] = useState([]);

  /* ========================= */
  /* 🔹 QUILL CONFIG           */
  /* ========================= */

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link"],
      ["clean"],
    ],
  };

  /* ========================= */
  /* 🔹 HANDLE CONTENT CHANGE  */
  /* ========================= */

  const handleChange = (value) => {
    setEditorHtml(value);

    setFormData((prev) => ({
      ...prev,
      content: value,
    }));

    generateTOC(value);
  };

  /* ========================= */
  /* 🔹 AUTO TOC GENERATOR     */
  /* ========================= */

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
      content: doc.body.innerHTML, // updated with ids
    }));
  };

  /* ========================= */
  /* 🔹 LOAD EXISTING CONTENT  */
  /* ========================= */

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

      {/* 🔹 RICH EDITOR */}
      <ReactQuill
        theme="snow"
        value={editorHtml}
        onChange={handleChange}
        modules={modules}
        className="bg-white"
      />

      {/* 🔹 TOC PREVIEW */}
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
