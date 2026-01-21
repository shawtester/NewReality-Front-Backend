"use client";

import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

export default function Description({ data, handleData }) {
  return (
    <section className="flex-1 bg-white border rounded-xl p-4">
      <h2 className="font-semibold mb-2">Description</h2>
      <ReactQuill
        value={data.description ?? ""}
        onChange={(value) => handleData("description", value)}
        placeholder="Enter property description..."
      />
    </section>
  );
}
