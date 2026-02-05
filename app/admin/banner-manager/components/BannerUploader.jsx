"use client";

import { useState } from "react";
import Image from "next/image";
import { uploadToCloudinary } from "@/lib/cloudinary/uploadBanner";
import { updateBanner } from "@/lib/firestore/banners/write";

export default function BannerUploader({ category }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!file) return alert("Select banner");

    setLoading(true);

    try {
      // 🔥 Upload to Cloudinary (banners folder)
      const imageUrl = await uploadToCloudinary(file, "banners");

      // 🔥 Save in Firestore
      await updateBanner({
        category,
        image: imageUrl,
      });

      alert("Banner Updated Successfully");
      setFile(null);
    } catch (err) {
      console.error(err);
      alert("Upload Failed");
    }

    setLoading(false);
  };

  return (
    <div className="space-y-4">

      {/* Preview */}
      {file && (
        <div className="relative w-full h-40">
          <Image
            src={URL.createObjectURL(file)}
            alt="preview"
            fill
            className="object-cover rounded"
          />
        </div>
      )}

      {/* File Input */}
      <input
        type="file"
        onChange={(e) => setFile(e.target.files[0])}
      />

      {/* Save Button */}
      <button
        onClick={handleSave}
        className="bg-black text-white px-4 py-2 rounded"
        disabled={loading}
      >
        {loading ? "Uploading..." : "Save Banner"}
      </button>
    </div>
  );
}
