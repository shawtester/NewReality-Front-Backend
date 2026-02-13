"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import toast from "react-hot-toast";
import { Button } from "@nextui-org/react";

import { uploadToCloudinary } from "@/lib/cloudinary/uploadImage";
import { getHero } from "@/lib/firestore/hero/read";
import { updateHero } from "@/lib/firestore/hero/write";

export default function HeroAdminPage() {
  const [data, setData] = useState({
    images: [], // ✅ Now array of objects { url, link }
    videoUrl: "",
    mediaType: "youtube",
  });

  const [loading, setLoading] = useState(false);
  const [imgLoading, setImgLoading] = useState(false);

  /* ================= FETCH EXISTING HERO ================= */
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getHero();
        if (!res) return;

        setData({
          images: res.images || [],
          videoUrl: res.videoUrl || "",
          mediaType: res.mediaType || "youtube",
        });
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, []);

  /* ================= IMAGE UPLOAD ================= */
  const handleImage = async (files) => {
    if (!files || files.length === 0) return;

    try {
      setImgLoading(true);

      const uploadPromises = Array.from(files).map(async (file) => {
        const url = await uploadToCloudinary(file);
        return { url, link: "" }; // ✅ Add empty link initially
      });

      const uploadedImages = await Promise.all(uploadPromises);

      setData((prev) => ({
        ...prev,
        images: [...prev.images, ...uploadedImages],
      }));

      toast.success(`${uploadedImages.length} images uploaded`);
    } catch (err) {
      toast.error("Upload failed");
    } finally {
      setImgLoading(false);
    }
  };

  /* ================= UPDATE LINK ================= */
  const updateLink = (index, value) => {
    const updated = [...data.images];
    updated[index].link = value;

    setData((prev) => ({
      ...prev,
      images: updated,
    }));
  };

  /* ================= REMOVE IMAGE ================= */
  const removeImage = (index) => {
    setData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  /* ================= SUBMIT ================= */
  const submit = async () => {
    try {
      setLoading(true);
      await updateHero(data);
      toast.success("Hero section updated!");
    } catch (err) {
      toast.error("Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-6xl space-y-6">
      <h1 className="text-2xl font-semibold">Hero Section</h1>

      {/* IMAGE UPLOAD */}
      <input
        type="file"
        multiple
        accept="image/*"
        onChange={(e) => handleImage(e.target.files)}
        className="border p-3 rounded-lg w-full"
      />

      {imgLoading && <p className="text-sm text-blue-600">Uploading...</p>}

      {/* IMAGE GRID */}
      {data.images.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {data.images.map((img, index) => (
            <div
              key={index}
              className="p-4 border rounded-xl shadow-md space-y-3"
            >
              <div className="relative h-40 rounded-lg overflow-hidden">
                <Image
                  src={img.url}
                  alt="Hero"
                  fill
                  className="object-cover"
                />
              </div>

              {/* 🔥 LINK INPUT */}
              <input
                type="text"
                placeholder="Enter redirect link (e.g. /residential/project)"
                value={img.link}
                onChange={(e) => updateLink(index, e.target.value)}
                className="border p-2 w-full rounded-lg"
              />

              <Button
                size="sm"
                color="danger"
                onClick={() => removeImage(index)}
              >
                Remove
              </Button>
            </div>
          ))}
        </div>
      )}

      <Button
        className="w-full bg-[#DBA40D] text-white"
        isLoading={loading}
        onClick={submit}
      >
        Update Hero Section
      </Button>
    </div>
  );
}
