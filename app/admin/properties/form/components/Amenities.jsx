"use client";

import { useState } from "react";
import { uploadToCloudinary } from "@/lib/cloudinary/uploadImage";

export default function Amenities({ data, handleData }) {
  const [amenity, setAmenity] = useState("");
  const [uploadingIndex, setUploadingIndex] = useState(null);

  const amenities =
    (data.amenities || []).map((a) =>
      typeof a === "string" ? { name: a, image: null } : a
    );

  const addAmenity = () => {
    if (!amenity.trim()) return;
    handleData("amenities", [
      ...amenities,
      { name: amenity.trim(), image: null },
    ]);
    setAmenity("");
  };

  const uploadAmenityImage = async (file, index) => {
    setUploadingIndex(index);
    const res = await uploadToCloudinary(file);

    const updated = [...amenities];
    updated[index].image = {
      url: res.secure_url,
      publicId: res.public_id,
    };

    handleData("amenities", updated);
    setUploadingIndex(null);
  };

  return (
    <div className="bg-white rounded-xl p-6 space-y-6 shadow-sm">
      <h2 className="text-lg font-semibold">Amenities</h2>

      <div className="flex gap-3">
        <input
          value={amenity}
          onChange={(e) => setAmenity(e.target.value)}
          className="border px-3 py-2 rounded flex-1"
          placeholder="Add Amenity"
        />
        <button
          type="button"
          onClick={addAmenity}
          className="bg-black text-white px-4 py-2 rounded bg-[#DBA40D]"
        >
          Add
        </button>
      </div>

      {amenities.map((a, i) => (
        <div key={i} className="border rounded-lg p-3 flex items-center gap-4">
          <span className="flex-1">{a.name}</span>

          <input
            type="file"
            accept="image/*"
            onChange={(e) => uploadAmenityImage(e.target.files[0], i)}
          />

          {a.image?.url && (
            <img src={a.image.url} className="h-10 w-10 rounded object-cover" />
          )}

          {uploadingIndex === i && (
            <span className="text-xs text-gray-400">Uploading...</span>
          )}
        </div>
      ))}
    </div>
  );
}
