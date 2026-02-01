"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import toast from "react-hot-toast";
import { uploadPropertyImage } from "@/lib/cloudinary/uploadPropertyImage";
import { updateAmenity } from "@/lib/firestore/amenities/write";

export default function EditAmenity() {
  const params = useSearchParams();
  const id = params.get("id");
  const router = useRouter();

  const [name, setName] = useState("");
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const fetchAmenity = async () => {
      const snap = await getDoc(doc(db, "amenities", id));
      if (snap.exists()) {
        const d = snap.data();
        setName(d.name);
        setImage(d.image || null);
      }
    };
    fetchAmenity();
  }, [id]);

  const handleImageUpload = async (file) => {
    setUploading(true);
    try {
      const res = await uploadPropertyImage(file);
      setImage(res);
    } catch {
      toast.error("Image upload failed");
    }
    setUploading(false);
  };

  const handleUpdate = async () => {
    await updateAmenity({
      id,
      data: {
        name,
        image: image && image.url ? image : null,
      },
    });

    toast.success("Amenity updated");
    router.push("/admin/amenities");
  };

  return (
    <div className="p-6 max-w-xl space-y-6 bg-white rounded-xl shadow">
      <h1 className="text-xl font-semibold">Edit Amenity</h1>

      <input
        className="border p-2 rounded w-full"
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
        onClick={handleUpdate}
        className="px-4 py-2 bg-black text-white rounded"
      >
        Update
      </button>
    </div>
  );
}
