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

    // Send actual file to parent (for Cloudinary upload)
    setImageFile(file);

    // Create preview only (local blob)
    const localPreview = URL.createObjectURL(file);
    setPreviewUrl(localPreview);

    // DO NOT save blob URL to Firestore
    setFormData((prev) => ({
      ...prev,
      image: {
        url: "",       // will be filled after upload
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
    <div className="bg-white p-8 rounded-2xl shadow-md space-y-6">

      <h2 className="text-xl font-semibold border-b pb-3">
        Basic Details
      </h2>

      {/* 🔹 TITLE */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-600">
          Main Title
        </label>
        <input
          type="text"
          name="title"
          value={formData.title || ""}
          onChange={handleChange}
          placeholder="Enter blog title"
          className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black"
        />
      </div>

      {/* 🔹 DETAIL HEADING */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-600">
          Detail Page Heading (H1)
        </label>
        <input
          type="text"
          name="detailHeading"
          value={formData.detailHeading || ""}
          onChange={handleChange}
          placeholder="Enter H1 heading"
          className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black"
        />
      </div>

      {/* 🔹 SLUG */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-600">
          Slug
        </label>
        <input
          type="text"
          name="slug"
          value={formData.slug || ""}
          onChange={handleChange}
          placeholder="example-blog-title"
          className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black"
        />
      </div>

      {/* 🔹 AUTHOR */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-600">
          Author
        </label>
        <input
          type="text"
          name="author"
          value={formData.author || ""}
          onChange={handleChange}
          placeholder="Author name"
          className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black"
        />
      </div>

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

      {/* 🔹 IMAGE UPLOAD */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-gray-600">
          Featured Image
        </label>

        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="w-full"
        />

        {/* 🔥 Preview */}
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
