"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { uploadToCloudinary } from "@/lib/cloudinary/uploadImage";
import {
  addCareerSliderImage,
  deleteCareerSliderImage,
  updateCareerSliderImage,
} from "@/lib/firestore/career_slider/write";

import {
  getAllCareerSliderImages,
} from "@/lib/firestore/career_slider/read";

export default function LifeAtNeevAdmin() {
  const [images, setImages] = useState([]);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    const res = await getAllCareerSliderImages();
    setImages(res);
  };

  useEffect(() => {
    fetchData();
  }, []);

  /* UPLOAD */
  const handleUpload = async () => {
    if (!file) return alert("Select image");

    setLoading(true);

    const imageUrl = await uploadToCloudinary(file);

    await addCareerSliderImage({
      image: imageUrl,
      order: images.length + 1,
      isActive: true,
    });

    setFile(null);
    setLoading(false);
    fetchData();
  };

  /* TOGGLE */
  const toggleActive = async (img) => {
    await updateCareerSliderImage(img.id, {
      isActive: !img.isActive,
    });
    fetchData();
  };

  /* DELETE */
  const remove = async (id) => {
    if (!confirm("Delete image?")) return;
    await deleteCareerSliderImage(id);
    fetchData();
  };

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-semibold">
        Life At Neev – Admin
      </h1>

      {/* Upload */}
      <div className="flex gap-3">
        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
        />
        <button
          onClick={handleUpload}
          disabled={loading}
          className="bg-[#DBA40D] px-5 py-2 text-white rounded"
        >
          {loading ? "Uploading..." : "Upload"}
        </button>
      </div>

      {/* List */}
      <div className="grid md:grid-cols-2 gap-4">
        {images.map((img) => (
          <div
            key={img.id}
            className="border rounded-xl p-3 space-y-2"
          >
            <Image
              src={img.image}
              alt=""
              width={400}
              height={220}
              className="rounded"
            />

            <div className="flex justify-between text-sm">
              <span>Order: {img.order}</span>
              <span>
                {img.isActive ? "Active" : "Inactive"}
              </span>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => toggleActive(img)}
                className="border px-3 py-1 rounded"
              >
                Toggle
              </button>

              <button
                onClick={() => remove(img.id)}
                className="border px-3 py-1 rounded text-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
