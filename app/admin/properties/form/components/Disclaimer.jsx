"use client";

export default function Disclaimer({ data, handleData }) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      <h2 className="text-lg font-semibold">Disclaimer</h2>

      <textarea
        rows={6}
        value={data.disclaimer || ""}
        onChange={(e) => handleData("disclaimer", e.target.value)}
        className="w-full border rounded-lg px-3 py-2 text-sm"
      />
    </div>
  );
}
