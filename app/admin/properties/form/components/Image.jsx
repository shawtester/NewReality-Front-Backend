"use client";

import { useState } from "react";
import { uploadPropertyImage } from "@/lib/cloudinary/uploadPropertyImage";

export default function Image({ data, handleData, slug }) {
  const [uploading, setUploading] = useState(false);

  /* 🔹 Upload Handler */
  const uploadImages = async (files, type = "gallery") => {
    if (!slug) {
      alert("Please enter project title first");
      return;
    }

    setUploading(true);
    try {
      const uploaded = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];

        // 🔥 UNIQUE SUFFIX LOGIC
        let suffix = "";

        if (type === "main") {
          suffix = "cover";
        } else {
          const startIndex = data.gallery?.length || 0;
          suffix = `gallery-${startIndex + i + 1}`;
        }

        const res = await uploadPropertyImage(file, slug, suffix);

        console.log("🔥 CLOUDINARY RESPONSE:", res);

        uploaded.push({
          url: res.url,
          publicId: res.publicId,
        });
      }

      console.log("✅ FINAL UPLOADED IMAGE OBJ:", uploaded);

      if (type === "main") {
        handleData("mainImage", uploaded[0] || null);
      } else {
        handleData("gallery", [...(data.gallery || []), ...uploaded]);
      }
    } catch (err) {
      alert(err.message);
    }
    setUploading(false);
  };

  const removeImage = (publicId, type = "gallery") => {
    if (type === "main") {
      handleData("mainImage", { url: "", publicId: "" });
    } else {
      handleData(
        "gallery",
        (data.gallery || []).filter((img) => img.publicId !== publicId)
      );
    }
  };

  return (
    <div className="bg-white rounded-xl p-6 space-y-8 shadow-sm">
      <h2 className="text-lg font-semibold">Project Images</h2>

      {/* 🔹 MAIN IMAGE */}
      <div className="space-y-2">
        <p className="text-sm font-medium">
          Main Image (Primary Banner Dimension:1640 × 772 px)
        </p>
        <input
          type="file"
          accept="image/*"
          disabled={uploading}
          onChange={(e) => uploadImages(Array.from(e.target.files), "main")}
        />

        {data.mainImage?.url && (
          <div className="relative w-40 mt-2">
            <img src={data.mainImage.url} className="rounded-lg" />
            <button
              type="button"
              onClick={() => removeImage(null, "main")}
              className="absolute top-1 right-1 bg-black text-white px-2 text-xs rounded"
            >
              ✕
            </button>
          </div>
        )}
      </div>

      {/* 🔹 GALLERY */}
      <div className="space-y-2">
        <p className="text-sm font-medium">Child Images (Gallery / Slider)</p>
        <input
          type="file"
          accept="image/*"
          multiple
          disabled={uploading}
          onChange={(e) => uploadImages(Array.from(e.target.files), "gallery")}
        />

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-2">
          {data.gallery?.map((img) => (
            <div key={img.publicId} className="relative">
              <img
                src={img.url}
                className="h-24 w-full object-cover rounded"
              />
              <button
                type="button"
                onClick={() => removeImage(img.publicId)}
                className="absolute top-1 right-1 bg-black text-white text-xs px-2 rounded"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      </div>

      {uploading && (
        <p className="text-sm text-gray-500">Uploading images...</p>
      )}
    </div>
  );
}