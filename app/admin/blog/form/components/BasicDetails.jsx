"use client";

import { useState, useEffect } from "react";

export default function BasicDetails({ formData, setFormData, setImageFile }) {

  /* ========================= */
  /* 🔹 LOCAL PREVIEW STATE    */
  /* ========================= */
  const [previewUrl, setPreviewUrl] = useState("");

  /* ========================= */
  /* 🔹 SYNC EXISTING IMAGE (EDIT MODE FIX) */
  /* ========================= */
  useEffect(() => {
    if (formData.image?.url) {
      setPreviewUrl(formData.image.url);
    }
  }, [formData.image?.url]);

  /* ========================= */
  /* 🔹 TEXT FIELD HANDLER     */
  /* ========================= */
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /* ========================= */
  /* 🔹 IMAGE HANDLER (SAFE)   */
  /* ========================= */
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageFile(file);

    const localPreview = URL.createObjectURL(file);
    setPreviewUrl(localPreview);

    setFormData((prev) => ({
      ...prev,
      image: {
        url: "",
        publicId: "",
      },
    }));
  };

  /* ========================= */
  /* 🔹 REMOVE IMAGE           */
  /* ========================= */
  const removeImage = () => {
    setPreviewUrl("");
    setImageFile(null);

    setFormData((prev) => ({
      ...prev,
      image: {
        url: "",
        publicId: "",
      },
    }));
  };

  /* ========================= */
  /* 🔹 CLEANUP BLOB MEMORY    */
  /* ========================= */
  useEffect(() => {
    return () => {
      if (previewUrl?.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  return (
    <div className="bg-white p-8 rounded-2xl shadow-md space-y-8">

      {/* ================= BASIC DETAILS ================= */}
      <div className="space-y-6">
        <h2 className="text-xl font-semibold border-b pb-3">
          Basic Details
        </h2>

        {/* 🔹 TITLE */}
        <InputField
          label="Main Title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Enter blog title"
        />

        {/* 🔹 DETAIL HEADING */}
        <InputField
          label="Detail Page Heading (H1)"
          name="detailHeading"
          value={formData.detailHeading}
          onChange={handleChange}
          placeholder="Enter H1 heading"
        />

        {/* 🔹 SLUG */}
        <InputField
          label="Slug"
          name="slug"
          value={formData.slug}
          onChange={handleChange}
          placeholder="example-blog-title"
        />

        {/* 🔹 AUTHOR */}
        <InputField
          label="Author"
          name="author"
          value={formData.author}
          onChange={handleChange}
          placeholder="Author name"
        />

        {/* 🔹 CATEGORY */}
        <InputField
          label="Category"
          name="category"
          value={formData.category}
          onChange={handleChange}
          placeholder="Interior / Vastu / Real Estate"
        />

        {/* 🔹 SOURCE */}
        <InputField
          label="Source (Optional)"
          name="source"
          value={formData.source}
          onChange={handleChange}
          placeholder="https://example.com"
        />

        {/* 🔹 EXCERPT */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-600">
            Excerpt
          </label>
          <textarea
            name="excerpt"
            value={formData.excerpt || ""}
            onChange={handleChange}
            placeholder="Short summary of the blog"
            rows={4}
            className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>
      </div>

      {/* ================= SEO SECTION ================= */}
      <div className="space-y-6">
        <h2 className="text-xl font-semibold border-b pb-3">
          SEO Meta Settings
        </h2>

        {/* 🔹 META TITLE */}
        <InputField
          label="Meta Title"
          name="metaTitle"
          value={formData.metaTitle}
          onChange={handleChange}
          placeholder="SEO optimized title (60 characters recommended)"
        />

        {/* 🔹 META DESCRIPTION */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-600">
            Meta Description
          </label>
          <textarea
            name="metaDescription"
            value={formData.metaDescription || ""}
            onChange={handleChange}
            placeholder="SEO description (150-160 characters recommended)"
            rows={3}
            className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>

        {/* 🔹 META KEYWORDS */}
        <InputField
          label="Meta Keywords"
          name="metaKeywords"
          value={formData.metaKeywords}
          onChange={handleChange}
          placeholder="real estate, vastu, home decor (comma separated)"
        />
      </div>

      {/* ================= IMAGE UPLOAD ================= */}
      <div className="space-y-3">
        <h2 className="text-xl font-semibold border-b pb-3">
          Featured Image
        </h2>

        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="w-full"
        />

        {previewUrl && (
          <div className="mt-4 relative">
            <img
              src={previewUrl}
              alt="Preview"
              className="w-full max-h-[300px] object-cover rounded-xl border"
            />

            <button
              type="button"
              onClick={removeImage}
              className="absolute top-2 right-2 bg-black text-white text-xs px-3 py-1 rounded-md"
            >
              Remove
            </button>
          </div>
        )}
      </div>

    </div>
  );
}


/* ================= REUSABLE INPUT COMPONENT ================= */
function InputField({ label, name, value, onChange, placeholder }) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-600">
        {label}
      </label>
      <input
        type="text"
        name={name}
        value={value || ""}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black"
      />
    </div>
  );
}
