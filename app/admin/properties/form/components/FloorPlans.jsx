"use client";

import { useState } from "react";

export default function FloorPlans({ data, handleData }) {
  const [plan, setPlan] = useState({ type: "", area: "", price: "" });

  const addPlan = () => {
    if (!plan.type) return;
    handleData("floorPlans", [...(data.floorPlans || []), plan]);
    setPlan({ type: "", area: "", price: "" });
  };

  const removePlan = (index) => {
    handleData(
      "floorPlans",
      (data.floorPlans || []).filter((_, i) => i !== index)
    );
  };

  return (
    <div className="bg-white rounded-xl p-6 space-y-4 shadow-sm">
      <h2 className="text-lg font-semibold">Floor Plans</h2>

      <div className="grid grid-cols-3 gap-3">
        <input
          placeholder="Type"
          value={plan.type}
          onChange={(e) => setPlan({ ...plan, type: e.target.value })}
          className="border px-2 py-1 rounded"
        />
        <input
          placeholder="Area"
          value={plan.area}
          onChange={(e) => setPlan({ ...plan, area: e.target.value })}
          className="border px-2 py-1 rounded"
        />
        <input
          placeholder="Price"
          value={plan.price}
          onChange={(e) => setPlan({ ...plan, price: e.target.value })}
          className="border px-2 py-1 rounded"
        />
      </div>

      <button
        type="button"
        onClick={addPlan}
        className="bg-black text-white px-4 py-2 rounded"
      >
        Add
      </button>

      {data.floorPlans?.map((p, i) => (
        <div
          key={i}
          className="flex justify-between border px-3 py-2 rounded items-center"
        >
          <span>{p.type} — {p.area} — ₹ {p.price}</span>
          <button
            type="button"
            onClick={() => removePlan(i)}
            className="text-red-600"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
}
