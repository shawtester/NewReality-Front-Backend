"use client";

import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css";

const ReactQuill = dynamic(() => import("react-quill"), {
  ssr: false,
});

/* 🔥 SAME TOOLBAR CONFIG */
const modules = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ["bold", "italic", "underline"],
    [{ list: "ordered" }, { list: "bullet" }],
    ["link"],
    ["clean"],
  ],
};

const formats = [
  "header",
  "bold",
  "italic",
  "underline",
  "list",
  "bullet",
  "link",
];

export default function Overview({ data, handleData }) {
  return (
    <div className="bg-white rounded-xl p-6 space-y-6 shadow-sm">
      <h2 className="text-lg font-semibold">Overview</h2>

      {/* TITLE */}
      <input
        placeholder="Overview Title"
        value={data.overview?.title || ""}
        onChange={(e) =>
          handleData("overview.title", e.target.value)
        }
        className="w-full border rounded-lg px-3 py-2 text-sm"
      />

      {/* TITLE 
<div className="text-center mb-8">
  {overview.title && (
    <h3 className="text-xl md:text-2xl font-semibold text-gray-900">
      {overview.title}
    </h3>
  )}
</div>*/}


      {/* 🔥 RICH TEXT DESCRIPTION */}
      <div>
        <label className="text-xs text-gray-500 mb-1 block">
          Overview Description
        </label>

        <ReactQuill
          theme="snow"
          value={data.overview?.description || ""}
          onChange={(value) =>
            handleData("overview.description", value)
          }
          modules={modules}
          formats={formats}
          bounds="body"
          placeholder="Enter overview description..."
          className="bg-white"
        />
      </div>
    </div>
  );
}
