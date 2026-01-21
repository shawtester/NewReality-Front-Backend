"use client";

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

      <input
        placeholder="Overview Subtitle"
        value={data.overview?.subtitle || ""}
        onChange={(e) => handleData("overview.subtitle", e.target.value)}
        className="w-full border rounded-lg px-3 py-2 text-sm"
      />

      <textarea
        rows={5}
        placeholder="Overview Description"
        value={data.overview?.description || ""}
        onChange={(e) => handleData("overview.description", e.target.value)}
        className="w-full border rounded-lg px-3 py-2 text-sm"
      />
    </div>
  );
}
