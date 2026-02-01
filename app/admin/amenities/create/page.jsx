"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { uploadPropertyImage } from "@/lib/cloudinary/uploadPropertyImage";
import { createAmenity } from "@/lib/firestore/amenities/write";

export default function CreateAmenity() {
  const [name, setName] = useState("");
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const router = useRouter();

  const handleImageUpload = async (file) => {
    setUploading(true);
    try {
      const res = await uploadPropertyImage(file);
      setImage(res);
    } catch (err) {
      toast.error("Image upload failed");
    }
    setUploading(false);
  };

  const handleSave = async () => {
    if (!name.trim()) return toast.error("Amenity name required");

    await createAmenity({
      data: {
        name,
        image: image && image.url ? image : null,
      },
    });

    toast.success("Amenity created");
    router.push("/admin/amenities");
  };

  return (
    <div className="p-6 max-w-xl space-y-6 bg-white rounded-xl shadow">
      <h1 className="text-xl font-semibold">Add Amenity</h1>

      <input
        className="border p-2 rounded w-full"
        placeholder="Amenity name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <input
        type="file"
        accept="image/*"
        onChange={(e) => handleImageUpload(e.target.files[0])}
      />

      {uploading && (
        <p className="text-sm text-gray-400">Uploading...</p>
      )}

      {image?.url && (
        <img
          src={image.url}
          className="h-20 w-20 rounded object-cover"
        />
      )}

      <button
        onClick={handleSave}
        className="px-4 py-2 bg-black text-white rounded"
      >
        Save
      </button>
    </div>
  );
}
