"use client";

import { useState } from "react";

export default function Location({ data, handleData }) {
  const [loc, setLoc] = useState({ label: "", distance: "" });

  const addLocation = () => {
    // ✅ Prevent adding empty location
    if (!loc.label.trim() || !loc.distance.trim()) return;

    handleData("locationPoints", [...(data.locationPoints || []), loc]);
    setLoc({ label: "", distance: "" });
  };

  const removeLocation = (index) => {
    handleData(
      "locationPoints",
      data.locationPoints.filter((_, i) => i !== index)
    );
  };

  return (
    <div className="bg-white rounded-xl p-6 space-y-4 shadow-sm">
      <h2 className="text-lg font-semibold">Location</h2>

      <div className="grid grid-cols-2 gap-3">
        <input
          placeholder="Place Name"
          value={loc.label}
          onChange={(e) => setLoc({ ...loc, label: e.target.value })}
          className="border px-2 py-1 rounded"
        />
        <input
          placeholder="Distance (km)"
          value={loc.distance}
          onChange={(e) => setLoc({ ...loc, distance: e.target.value })}
          className="border px-2 py-1 rounded"
        />
      </div>

      <button
        type="button"
        onClick={addLocation}
        className="bg-black text-white px-4 py-2 rounded"
      >
        Add
      </button>

      <div className="space-y-1 mt-3">
        {data.locationPoints?.map((l, i) => (
          <div key={i} className="flex justify-between items-center border px-3 py-1 rounded">
            <span>
              {l.label} — {l.distance} km
            </span>
            <button
              type="button"
              onClick={() => removeLocation(i)}
              className="text-red-500 font-bold"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
