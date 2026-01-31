"use client";

import { useState } from "react";
import { uploadToCloudinary } from "@/lib/cloudinary/uploadImage";

export default function FloorPlans({ data, handleData }) {
  const [plan, setPlan] = useState({
    title: "",        // ✅ NEW
    type: "",
    area: "",
    price: "",
    imageFile: null,
  });

  /* ================= ADD PLAN ================= */
  const addPlan = async () => {
    if (!plan.title || !plan.type || !plan.imageFile) {
      alert("Title, type and image are required");
      return;
    }

    try {
      const imageUrl = await uploadToCloudinary(
        plan.imageFile,
        "properties/floor-plans"
      );

      const newPlan = {
        title: plan.title,   // ✅ SAVE TITLE
        type: plan.type,
        area: plan.area,
        price: plan.price,
        image: imageUrl,     // string URL
      };

      handleData("floorPlans", [
        ...(data.floorPlans || []),
        newPlan,
      ]);

      // reset form
      setPlan({
        title: "",
        type: "",
        area: "",
        price: "",
        imageFile: null,
      });
    } catch (err) {
      console.error(err);
      alert("Floor plan image upload failed");
    }
  };

  /* ================= REMOVE PLAN ================= */
  const removePlan = (index) => {
    handleData(
      "floorPlans",
      (data.floorPlans || []).filter((_, i) => i !== index)
    );
  };

  return (
    <div className="bg-white rounded-xl p-6 space-y-5 shadow-sm">
      <h2 className="text-lg font-semibold">Floor Plans</h2>

      {/* INPUTS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* TITLE */}
        <input
          placeholder="Title (3 BHK Type A)"
          value={plan.title}
          onChange={(e) =>
            setPlan({ ...plan, title: e.target.value })
          }
          className="border px-3 py-2 rounded-lg text-sm"
        />

        {/* TYPE */}
        <input
          placeholder="Type (3 BHK Apartment)"
          value={plan.type}
          onChange={(e) =>
            setPlan({ ...plan, type: e.target.value })
          }
          className="border px-3 py-2 rounded-lg text-sm"
        />

        {/* AREA */}
        <input
          placeholder="Area (1495 SQ. FT.)"
          value={plan.area}
          onChange={(e) =>
            setPlan({ ...plan, area: e.target.value })
          }
          className="border px-3 py-2 rounded-lg text-sm"
        />

        {/* PRICE */}
        <input
          placeholder="Price (₹ 1.54 Cr)"
          value={plan.price}
          onChange={(e) =>
            setPlan({ ...plan, price: e.target.value })
          }
          className="border px-3 py-2 rounded-lg text-sm"
        />

        {/* IMAGE */}
        <input
          type="file"
          accept="image/*"
          onChange={(e) =>
            setPlan({ ...plan, imageFile: e.target.files[0] })
          }
          className="border px-3 py-2 rounded-lg text-sm md:col-span-2"
        />
      </div>

      <button
        type="button"
        onClick={addPlan}
        className="bg-black text-white px-4 py-2 rounded-lg text-sm"
      >
        Add Floor Plan
      </button>

      {/* LIST */}
      {data.floorPlans?.length > 0 && (
        <div className="space-y-3">
          {data.floorPlans.map((p, i) => (
            <div
              key={i}
              className="flex items-center justify-between border rounded-lg p-3"
            >
              <div>
                <p className="font-medium text-sm">
                  {p.title} {/* ✅ TITLE DISPLAY */}
                </p>
                <p className="text-xs text-gray-500">
                  {p.type} • {p.area} • ₹ {p.price}
                </p>
              </div>

              <button
                type="button"
                onClick={() => removePlan(i)}
                className="text-red-600 text-sm"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
