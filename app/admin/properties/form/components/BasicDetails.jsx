"use client";

import { useState } from "react";

export default function BasicDetails({ data, handleData }) {
  const [bhkInput, setBhkInput] = useState("");

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

      {/* PROJECT NAME */}
      <Input
        label="Project Name"
        value={data.title}
        onChange={(v) => handleData("title", v)}
      />

      {/* LOCATION */}
      <Input
        label="Location"
        value={data.location}
        onChange={(v) => handleData("location", v)}
      />

      {/* DEVELOPER */}
      <Input
        label="Developer Name"
        value={data.developer}
        onChange={(v) => handleData("developer", v)}
      />

      {/* AREA */}
      <Input
        label="Area Range (SQ. FT.)"
        value={data.areaRange}
        onChange={(v) => handleData("areaRange", v)}
        placeholder="1139 - 1458"
      />

      {/* RERA */}
      <Input
        label="RERA Number"
        value={data.reraNumber}
        onChange={(v) => handleData("reraNumber", v)}
      />

      {/* LAST UPDATED */}
      <Input
        type="date"
        label="Last Updated Date"
        value={data.lastUpdated}
        onChange={(v) => handleData("lastUpdated", v)}
      />
       {/* Residential/commercial Toggle */}
      <div className="flex gap-2 mb-4">
        {["residential", "commercial"].map((type) => (
          <button
            key={type}
            type="button"
            onClick={() => handleData("propertyType", type)}
            className={`px-4 py-2 rounded-full text-sm ${data.propertyType === type
                ? "bg-black text-white"
                : "bg-gray-200"
              }`}
          >
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </button>
        ))}
      </div>


      {/* NEW LAUNCH / TRENDING */}
      <div className="flex gap-6 flex-wrap">
        <Checkbox
          label="New Launch Project"
          checked={data.isNewLaunch}
          onChange={(v) => handleData("isNewLaunch", v)}
        />
        <Checkbox
          label="Trending Project"
          checked={data.isTrending}
          onChange={(v) => handleData("isTrending", v)}
        />
        <Checkbox
          label="Apartment"
          checked={data.isApartment}
          onChange={(v) => handleData("isApartment", v)}
        />

        <Checkbox
          label="Builder Floor"
          checked={data.isBuilderFloor}
          onChange={(v) => handleData("isBuilderFloor", v)}
        />

        <Checkbox
          label="Retail Property"
          checked={data.isRetail}
          onChange={(v) => handleData("isRetail", v)}
        />

        <Checkbox
          label="SCO Plot"
          checked={data.isSCO}
          onChange={(v) => handleData("isSCO", v)}
        />
      </div>

      {/* CONFIGURATIONS (BHK) */}
      <div>
        <p className="text-sm font-medium mb-2">Configurations (BHK)</p>

        <div className="flex gap-2">
          <input
            value={bhkInput}
            onChange={(e) => setBhkInput(e.target.value)}
            placeholder="2 BHK / Studio / Duplex"
            className="flex-1 border rounded-lg px-3 py-2 text-sm"
          />
          <button
            type="button"
            onClick={addBHK}
            className="px-4 py-2 bg-black text-white rounded-lg"
          >
            Add
          </button>
        </div>

        <div className="flex gap-2 flex-wrap mt-3">
          {data.configurations?.map((b) => (
            <Chip key={b} label={b} onRemove={() => removeBHK(b)} />
          ))}
        </div>
      </div>

      {/* PRICE */}
      <Input
        label="Price Range"
        value={data.priceRange}
        onChange={(v) => handleData("priceRange", v)}
        placeholder="₹ 81.08 Lakh - 1.05 Cr*"
      />
    </div>
  );
}

/* ================= HELPERS ================= */

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
    <input
      type="checkbox"
      checked={!!checked}
      onChange={(e) => onChange(e.target.checked)}
      className="accent-black"
    />
    {label}
  </label>
);

const Chip = ({ label, onRemove }) => (
  <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border text-sm">
    {label}
    <button
      type="button"
      onClick={onRemove}
      className="text-gray-500 hover:text-black"
    >
      ✕
    </button>
  </div>
);
