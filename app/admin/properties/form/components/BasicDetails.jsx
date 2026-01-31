"use client";

import { useState } from "react";
import { uploadBrochureToCloudinary } from "@/lib/cloudinary/uploadBrochure";

export default function BasicDetails({ data, handleData }) {
  const [bhkInput, setBhkInput] = useState("");

  /* ================= BROCHURE UPLOAD ================= */
  const uploadBrochure = async (file) => {
    if (!file) return;

    try {
      const url = await uploadBrochureToCloudinary(file);

      handleData("brochure", {
        url,
        name: file.name,
      });

      alert("Brochure uploaded successfully!");
    } catch (err) {
      alert(err.message || "Brochure upload failed");
    }
  };

  /* ================= BHK ================= */
  const addBHK = () => {
    if (!bhkInput.trim()) return;

    if (!data.configurations?.includes(bhkInput.trim())) {
      handleData("configurations", [
        ...(data.configurations || []),
        bhkInput.trim(),
      ]);
    }
    setBhkInput("");
  };

  const removeBHK = (value) => {
    handleData(
      "configurations",
      (data.configurations || []).filter((b) => b !== value)
    );
  };

  return (
    <div className="bg-white rounded-xl p-6 space-y-6 shadow-sm">
      <h2 className="text-lg font-semibold">Basic Details of Property</h2>

      <Input
        label="Project Name"
        value={data.title}
        onChange={(v) => handleData("title", v)}
      />

      <Input
        label="Location"
        value={data.location}
        onChange={(v) => handleData("location", v)}
      />

      <Input
        label="Developer Name"
        value={data.developer}
        onChange={(v) => handleData("developer", v)}
      />

      <Input
        label="Area Range (SQ. FT.)"
        value={data.areaRange}
        onChange={(v) => handleData("areaRange", v)}
        placeholder="1139 - 1458"
      />

      <Input
        label="RERA Number"
        value={data.reraNumber}
        onChange={(v) => handleData("reraNumber", v)}
      />

      <Input
        type="date"
        label="Last Updated Date"
        value={data.lastUpdated}
        onChange={(v) => handleData("lastUpdated", v)}
      />

      {/* PROPERTY TYPE */}
      <div className="flex gap-2">
        {["residential", "commercial"].map((type) => (
          <button
            key={type}
            type="button"
            onClick={() => handleData("propertyType", type)}
            className={`px-4 py-2 rounded-full text-sm ${
              data.propertyType === type
                ? "bg-black text-white"
                : "bg-gray-200"
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      {/* FLAGS */}
      <div className="flex gap-6 flex-wrap">
        <Checkbox label="New Launch Project" checked={data.isNewLaunch} onChange={(v) => handleData("isNewLaunch", v)} />
        <Checkbox label="Trending Project" checked={data.isTrending} onChange={(v) => handleData("isTrending", v)} />
        <Checkbox label="Apartment" checked={data.isApartment} onChange={(v) => handleData("isApartment", v)} />
        <Checkbox label="Builder Floor" checked={data.isBuilderFloor} onChange={(v) => handleData("isBuilderFloor", v)} />
        <Checkbox label="Retail Property" checked={data.isRetail} onChange={(v) => handleData("isRetail", v)} />
        <Checkbox label="SCO Plot" checked={data.isSCO} onChange={(v) => handleData("isSCO", v)} />
      </div>

      {/* CONFIGURATIONS */}
      <div>
        <p className="text-sm font-medium mb-2">Configurations (BHK)</p>
        <div className="flex gap-2">
          <input
            value={bhkInput}
            onChange={(e) => setBhkInput(e.target.value)}
            placeholder="2 BHK / Studio"
            className="flex-1 border rounded-lg px-3 py-2 text-sm"
          />
          <button type="button" onClick={addBHK} className="px-4 py-2 bg-black text-white rounded-lg">
            Add
          </button>
        </div>

        <div className="flex gap-2 flex-wrap mt-3">
          {data.configurations?.map((b) => (
            <Chip key={b} label={b} onRemove={() => removeBHK(b)} />
          ))}
        </div>
      </div>

      <Input
        label="Price Range"
        value={data.priceRange}
        onChange={(v) => handleData("priceRange", v)}
      />

      {/* BROCHURE */}
      <div>
        <p className="text-xs text-gray-500 mb-1">Upload Brochure (PDF)</p>
        <input
          type="file"
          accept="application/pdf"
          onChange={(e) => uploadBrochure(e.target.files[0])}
          className="w-full border rounded-lg px-3 py-2 text-sm"
        />

        {data.brochure?.name && (
          <p className="text-sm text-green-600 mt-1">
            Uploaded: {data.brochure.name}
          </p>
        )}
      </div>
    </div>
  );
}

/* ===== Helpers ===== */

const Input = ({ label, value, onChange, type = "text", placeholder }) => (
  <div>
    <label className="text-xs text-gray-500">{label}</label>
    <input
      type={type}
      value={value ?? ""}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full border rounded-lg px-3 py-2 text-sm"
    />
  </div>
);

const Checkbox = ({ label, checked, onChange }) => (
  <label className="flex gap-2 text-sm cursor-pointer">
    <input type="checkbox" checked={!!checked} onChange={(e) => onChange(e.target.checked)} />
    {label}
  </label>
);

const Chip = ({ label, onRemove }) => (
  <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border text-sm">
    {label}
    <button type="button" onClick={onRemove}>✕</button>
  </div>
);
