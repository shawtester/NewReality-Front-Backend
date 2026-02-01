"use client";

import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

/* 🔥 TOOLBAR CONFIG (SAME AS BUILDER) */
const modules = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ["bold", "italic", "underline"],
    [{ list: "ordered" }, { list: "bullet" }],
    ["link"],
    ["clean"],
  ],
};

/* 🔥 ALLOWED FORMATS */
const formats = [
  "header",
  "bold",
  "italic",
  "underline",
  "list",
  "bullet",
  "link",
];

export default function Description({ data, handleData }) {
  return (
    <section className="flex-1 bg-white border rounded-xl p-4">
      <h2 className="font-semibold mb-2">
        Description
      </h2>

      <ReactQuill
        theme="snow"
        value={data.description ?? ""}
        onChange={(value) =>
          handleData("description", value)
        }
        modules={modules}
        formats={formats}
        placeholder="Enter property description..."
        className="bg-white"
      />
    </section>
  );
}

