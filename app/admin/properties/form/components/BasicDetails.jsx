"use client";

import { useState, useMemo, useEffect } from "react";
import { uploadBrochureToCloudinary } from "@/lib/cloudinary/uploadBrochure";
import { useBuilders } from "@/lib/firestore/builders/read";
import { uploadVideoToCloudinary } from "@/lib/cloudinary/uploadVideo";


export default function BasicDetails({ data, handleData }) {
  const [bhkInput, setBhkInput] = useState("");

  /* 🔥 BUILDER SEARCH STATES (MISSING THE) */
  const [searchBuilder, setSearchBuilder] = useState(
    data.developer || ""
  );
  const [showDropdown, setShowDropdown] = useState(false);

  const { builders, isLoading } = useBuilders();

  /* 🔥 EDIT MODE FIX — SYNC BUILDER NAME */
  useEffect(() => {
    if (data?.developer) {
      setSearchBuilder(data.developer);
    }
  }, [data?.developer]);


  /* 🔥 FILTERED BUILDERS */
  const filteredBuilders = useMemo(() => {
    return builders.filter((b) =>
      b.name
        ?.toLowerCase()
        .includes(searchBuilder.toLowerCase())
    );
  }, [builders, searchBuilder]);

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
      <h2 className="text-lg font-semibold">
        Basic Details of Property
      </h2>

      <Input
        label="Project Name"
        value={data.title}
        onChange={(v) => handleData("title", v)}
      />

      {/* 🔗 SLUG INPUT */}
      <div>
        <label className="text-xs text-gray-500">
          Custom URL (Slug)
        </label>

        <input
          value={data.slug || ""}
          onChange={(e) =>
            handleData(
              "slug",
              e.target.value
                .toLowerCase()
                .replace(/[^a-z0-9-]/g, "")
                .replace(/\s+/g, "-")
            )
          }
          placeholder="prestige-city-sarjapur"
          className="w-full border rounded-lg px-3 py-2 text-sm"
        />

        {/* 🔍 URL PREVIEW */}
        <p className="text-xs text-gray-400 mt-1">
          URL Preview:{" "}
          <span className="text-gray-700 font-medium">
            https://yourdomain.com/projects/
            {data.slug || "auto-generated-from-title"}
          </span>
        </p>
      </div>

      {/* ================= VIDEO UPLOAD ================= */}
      <div>
        <p className="text-xs text-gray-500 mb-1">
          Upload Property Video (MP4)
        </p>

        <input
          type="file"
          accept="video/mp4"
          onChange={async (e) => {
            const file = e.target.files[0];
            if (!file) return;

            try {
              const video = await uploadVideoToCloudinary(file);
              handleData("video", video);
              alert("Video uploaded successfully!");
            } catch (err) {
              alert(err.message);
            }
          }}
          className="w-full border rounded-lg px-3 py-2 text-sm"
        />

        {data.video?.url && (
          <p className="text-xs text-green-600 mt-1">
            Video uploaded
          </p>
        )}
      </div>




      <Input
        label="Location"
        value={data.location}
        onChange={(v) => handleData("location", v)}
      />

      {/* 🔥 DEVELOPER (SEARCHABLE + TYPEABLE DROPDOWN) */}
      <div className="relative">
        <label className="text-xs text-gray-500">
          Developer
        </label>

        <input
          value={searchBuilder}
          onBlur={() => {
            setTimeout(() => setShowDropdown(false), 200);
          }}
          onChange={(e) => {
            setSearchBuilder(e.target.value);
            setShowDropdown(true);
          }}
          onFocus={() => setShowDropdown(true)}
          placeholder="Search or select developer"
          className="w-full border rounded-lg px-3 py-2 text-sm"
        />

        {showDropdown && (
          <div className="absolute z-30 mt-1 w-full bg-white border rounded-lg shadow max-h-60 overflow-y-auto">
            {isLoading && (
              <p className="p-2 text-sm text-gray-400">
                Loading builders...
              </p>
            )}

            {!isLoading && filteredBuilders.length === 0 && (
              <p className="p-2 text-sm text-gray-400">
                No builders found
              </p>
            )}

            {filteredBuilders.map((b) => (
              <div
                key={b.id}
                onClick={() => {
                  setSearchBuilder(b.name);
                  setShowDropdown(false);

                  handleData("builderId", b.id);
                  handleData("developer", b.name);
                }}
                className="px-3 py-2 text-sm cursor-pointer hover:bg-gray-100"
              >
                {b.name}
              </div>
            ))}
          </div>
        )}
      </div>

      <Input
        label="Area Range (SQ. FT.)"
        value={data.areaRange}
        onChange={(v) => handleData("areaRange", v)}
        placeholder="1139 - 1458"
      />

      {/* ================= RERA ================= */}
      <div className="space-y-2">
        <label className="flex items-center gap-3 text-sm font-medium cursor-pointer">
          <input
            type="checkbox"
            checked={!!data.isRera}
            onChange={(e) => {
              const enabled = e.target.checked;
              handleData("isRera", enabled);

              // ❌ agar disable hua → reraNumber clear
              if (!enabled) {
                handleData("reraNumber", "");
              }
            }}
          />
          RERA Approved Project
        </label>

        <Input
          label="RERA Number"
          value={data.reraNumber}
          onChange={(v) => handleData("reraNumber", v)}
          placeholder="RERA-GRG-1234-2024"
          disabled={!data.isRera}        // 🔥 KEY LINE
        />
      </div>



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
            className={`px-4 py-2 rounded-full text-sm ${data.propertyType === type
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
        <Checkbox
          label="Ready to Move"
          checked={data.isReadyToMove}
          onChange={(v) => handleData("isReadyToMove", v)}
        />

        <Checkbox
          label="Under Construction"
          checked={data.isUnderConstruction}
          onChange={(v) => handleData("isUnderConstruction", v)}
        />

        <Checkbox
          label="Pre Launch"
          checked={data.isPreLaunch}
          onChange={(v) => handleData("isPreLaunch", v)}
        />

        <Checkbox label="Apartment" checked={data.isApartment} onChange={(v) => handleData("isApartment", v)} />
        <Checkbox label="Builder Floor" checked={data.isBuilderFloor} onChange={(v) => handleData("isBuilderFloor", v)} />
        <Checkbox label="Retail Property" checked={data.isRetail} onChange={(v) => handleData("isRetail", v)} />
        <Checkbox label="SCO Plot" checked={data.isSCO} onChange={(v) => handleData("isSCO", v)} />
      </div>

      {/* CONFIGURATIONS */}
      <div>
        <p className="text-sm font-medium mb-2">
          Configurations (BHK)
        </p>

        <div className="flex gap-2">
          <input
            value={bhkInput}
            onChange={(e) => setBhkInput(e.target.value)}
            placeholder="2 BHK / Studio"
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
            <Chip
              key={b}
              label={b}
              onRemove={() => removeBHK(b)}
            />
          ))}
        </div>
      </div>

      <Input
        label="Price Range"
        value={data.priceRange}
        onChange={(v) => handleData("priceRange", v)}
      />

      {/* ================= PAYMENT PLAN (DYNAMIC) ================= */}
      <div>
        <h3 className="text-sm font-semibold mb-3">
          Payment Plan (Dynamic)
        </h3>

        <div className="space-y-3">
          {Array.isArray(data.paymentPlan)
            ? data.paymentPlan.map((plan, index) => (
              <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <Input
                  label="Title"
                  value={plan.title}
                  onChange={(v) => {
                    const updated = [...(data.paymentPlan || [])];
                    updated[index].title = v;
                    handleData("paymentPlan", updated);
                  }}
                  placeholder="Installment 1"
                />

                <Input
                  label="Percent"
                  value={plan.percent}
                  onChange={(v) => {
                    const updated = [...(data.paymentPlan || [])];
                    updated[index].percent = v;
                    handleData("paymentPlan", updated);
                  }}
                  placeholder="10%"
                />

                <Input
                  label="Note"
                  value={plan.note}
                  onChange={(v) => {
                    const updated = [...(data.paymentPlan || [])];
                    updated[index].note = v;
                    handleData("paymentPlan", updated);
                  }}
                  placeholder="Down Payment"
                />

                <button
                  type="button"
                  onClick={() => {
                    const updated = (data.paymentPlan || []).filter((_, i) => i !== index);
                    handleData("paymentPlan", updated);
                  }}
                  className="text-red-500 text-sm"
                >
                  Remove
                </button>
              </div>
            ))
            : null}

        </div>

        <button
          type="button"
          onClick={() =>
            handleData(
              "paymentPlan",
              [
                ...(Array.isArray(data.paymentPlan) ? data.paymentPlan : []),
                { title: "", percent: "", note: "" },
              ]
            )

          }
          className="mt-3 bg-black text-white px-4 py-2 rounded"
        >
          + Add Installment
        </button>
      </div>


      {/* ================= PROJECT QUICK FACTS ================= */}
      <div>
        <h3 className="text-sm font-semibold mb-3">
          Project Quick Facts
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Project Area"
            value={data.projectArea}
            onChange={(v) => handleData("projectArea", v)}
            placeholder="10 Acres"
          />

          <Input
            label="Project Type"
            value={data.projectType}
            onChange={(v) => handleData("projectType", v)}
            placeholder="Luxury Residential"
          />

          <Input
            label="Project Status"
            value={data.projectStatus}
            onChange={(v) => handleData("projectStatus", v)}
            placeholder="Under Construction"
          />

          <Input
            label="Project Elevation / Tower"
            value={data.projectElevation}
            onChange={(v) => handleData("projectElevation", v)}
            placeholder="G+25 Floors"
          />

          <Input
            label="Possession"
            value={data.possession}
            onChange={(v) => handleData("possession", v)}
            placeholder="Dec 2027"
          />
        </div>
      </div>



      {/* BROCHURE */}
      <div>
        <p className="text-xs text-gray-500 mb-1">
          Upload Brochure (PDF)
        </p>
        <input
          type="file"
          accept="application/pdf"
          onChange={(e) =>
            uploadBrochure(e.target.files[0])
          }
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

const Input = ({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  disabled = false,
}) => (
  <div>
    <label className="text-xs text-gray-500">
      {label}
    </label>
    <input
      type={type}
      value={value ?? ""}
      disabled={disabled}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={`w-full border rounded-lg px-3 py-2 text-sm ${disabled ? "bg-gray-100 cursor-not-allowed" : ""
        }`}
    />
  </div>
);


const Checkbox = ({ label, checked, onChange }) => (
  <label className="flex gap-2 text-sm cursor-pointer">
    <input
      type="checkbox"
      checked={!!checked}
      onChange={(e) => onChange(e.target.checked)}
    />
    {label}
  </label>
);

const Chip = ({ label, onRemove }) => (
  <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border text-sm">
    {label}
    <button type="button" onClick={onRemove}>
      ✕
    </button>
  </div>
);
