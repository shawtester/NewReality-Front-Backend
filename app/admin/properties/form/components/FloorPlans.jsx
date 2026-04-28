"use client";

import { useState } from "react";
import { uploadToCloudinary } from "@/lib/cloudinary/uploadImage";

export default function FloorPlans({ data, handleData }) {
  const [editingIndex, setEditingIndex] = useState(null);
  const [fileInputKey, setFileInputKey] = useState(0);
  const [plan, setPlan] = useState({
    title: "",
    type: "",
    area: "",
    price: "",
    imageFile: null,
  });

  const resetPlan = () => {
    setPlan({
      title: "",
      type: "",
      area: "",
      price: "",
      imageFile: null,
    });
    setEditingIndex(null);
    setFileInputKey((prev) => prev + 1);
  };

  const savePlan = async () => {
    const existingPlan =
      editingIndex !== null ? data.floorPlans?.[editingIndex] : null;

    if (!plan.title || !plan.type || (!plan.imageFile && !existingPlan?.image)) {
      alert("Title, type and image are required");
      return;
    }

    try {
      const imageUrl = plan.imageFile
        ? await uploadToCloudinary(plan.imageFile, "properties/floor-plans")
        : existingPlan.image;

      const newPlan = {
        title: plan.title,
        type: plan.type,
        area: plan.area,
        price: plan.price,
        image: imageUrl,
      };

      const floorPlans = [...(data.floorPlans || [])];

      if (editingIndex !== null) {
        floorPlans[editingIndex] = newPlan;
      } else {
        floorPlans.push(newPlan);
      }

      handleData("floorPlans", floorPlans);
      resetPlan();
    } catch (err) {
      console.error(err);
      alert("Floor plan image upload failed");
    }
  };

  const editPlan = (index) => {
    const selectedPlan = data.floorPlans?.[index];
    if (!selectedPlan) return;

    setEditingIndex(index);
    setPlan({
      title: selectedPlan.title || "",
      type: selectedPlan.type || "",
      area: selectedPlan.area || "",
      price: selectedPlan.price || "",
      imageFile: null,
    });
    setFileInputKey((prev) => prev + 1);
  };

  const removePlan = (index) => {
    handleData(
      "floorPlans",
      (data.floorPlans || []).filter((_, i) => i !== index)
    );

    if (editingIndex !== null && index <= editingIndex) {
      resetPlan();
    }
  };

  return (
    <div className="bg-white rounded-xl p-6 space-y-5 shadow-sm">
      <h2 className="text-lg font-semibold">Floor Plans</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <input
          placeholder="Title (3 BHK Type A)"
          value={plan.title}
          onChange={(e) => setPlan({ ...plan, title: e.target.value })}
          className="border px-3 py-2 rounded-lg text-sm"
        />

        <input
          placeholder="Type (3 BHK Apartment)"
          value={plan.type}
          onChange={(e) => setPlan({ ...plan, type: e.target.value })}
          className="border px-3 py-2 rounded-lg text-sm"
        />

        <input
          placeholder="Area (1495 SQ. FT.)"
          value={plan.area}
          onChange={(e) => setPlan({ ...plan, area: e.target.value })}
          className="border px-3 py-2 rounded-lg text-sm"
        />

        <input
          placeholder="Price (Rs 1.54 Cr)"
          value={plan.price}
          onChange={(e) => setPlan({ ...plan, price: e.target.value })}
          className="border px-3 py-2 rounded-lg text-sm"
        />

        <input
          key={fileInputKey}
          type="file"
          accept="image/*"
          onChange={(e) => setPlan({ ...plan, imageFile: e.target.files[0] })}
          className="border px-3 py-2 rounded-lg text-sm md:col-span-2"
        />
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={savePlan}
          className="bg-black text-white px-4 py-2 rounded-lg text-sm"
        >
          {editingIndex !== null ? "Update Floor Plan" : "Add Floor Plan"}
        </button>

        {editingIndex !== null && (
          <button
            type="button"
            onClick={resetPlan}
            className="border border-gray-300 px-4 py-2 rounded-lg text-sm"
          >
            Cancel Edit
          </button>
        )}
      </div>

      {data.floorPlans?.length > 0 && (
        <div className="space-y-3">
          {data.floorPlans.map((p, i) => (
            <div
              key={i}
              className="flex items-center justify-between gap-3 border rounded-lg p-3"
            >
              <div>
                <p className="font-medium text-sm">{p.title}</p>
                <p className="text-xs text-gray-500">
                  {p.type} - {p.area} - Rs {p.price}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => editPlan(i)}
                  className="text-blue-600 text-sm"
                >
                  Edit
                </button>

                <button
                  type="button"
                  onClick={() => removePlan(i)}
                  className="text-red-600 text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
