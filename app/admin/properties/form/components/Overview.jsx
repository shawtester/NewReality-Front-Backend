"use client";

import RichEditors from "@/app/components/RichEditor";

export default function Overview({ data, handleData }) {
  return (
    <div className="bg-white rounded-xl p-6 space-y-6 shadow-sm">
      <h2 className="text-lg font-semibold">Overview</h2>

      <input
        placeholder="Overview Title"
        value={data.overview?.title || ""}
        onChange={(e) => handleData("overview.title", e.target.value)}
        className="w-full border rounded-lg px-3 py-2 text-sm"
      />

      <div>
        <label className="text-xs text-gray-500 mb-1 block">
          Overview Description
        </label>

        <RichEditors
          value={data.overview?.description || ""}
          onChange={(value) => handleData("overview.description", value)}
        />
      </div>
    </div>
  );
}
