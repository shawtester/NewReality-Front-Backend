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
    images: [], // store string URLs
    videoUrl: "",
  });

  const [loading, setLoading] = useState(false);
  const [imgLoading, setImgLoading] = useState(false);

  /* ================= FETCH EXISTING HERO ================= */
  useEffect(() => {
    const fetchData = async () => {
      const res = await getHero();
      if (res) {
        setData({
          images: res.images || [],
          videoUrl: res.videoUrl || "",
        });
      }
    };
    fetchData();
  }, []);

  /* ================= IMAGE UPLOAD ================= */
  const handleImage = async (file) => {
    if (!file) return;

    if (data.images.length >= 4) {
      toast.error("Maximum 4 images allowed");
      return;
    }

    try {
      setImgLoading(true);
      const imageUrl = await uploadToCloudinary(file); // returns string URL
      setData((prev) => ({
        ...prev,
        images: [...prev.images, imageUrl],
      }));
      toast.success("Image uploaded successfully!");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setImgLoading(false);
    }
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
    setLoading(true);
    try {
      await updateHero({ data });
      toast.success("Hero section updated!");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-xl space-y-5">
      <h1 className="text-xl font-semibold">Hero Section</h1>

      {/* ================= IMAGES ================= */}
      <div>
        <label className="text-sm">Hero Images (Max 4)</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => handleImage(e.target.files[0])}
        />
        {imgLoading && <p className="text-xs">Uploading…</p>}

        <div className="grid grid-cols-2 gap-3 mt-3">
          {data.images.map((img, index) => (
            <div key={index} className="relative h-32 rounded overflow-hidden">
              <Image
                src={img}
                alt={`Hero ${index + 1}`}
                fill
                className="object-cover"
              />
              <button
                onClick={() => removeImage(index)}
                className="absolute top-1 right-1 bg-black/70 text-white text-xs px-2 py-1 rounded"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* ================= VIDEO ================= */}
      <div>
        <label className="text-sm">YouTube Embed URL</label>
        <input
          value={data.videoUrl}
          onChange={(e) =>
            setData((prev) => ({ ...prev, videoUrl: e.target.value }))
          }
          placeholder="https://www.youtube.com/embed/xxxx"
          className="border p-2 w-full rounded"
        />
      </div>

      <Button className="bg-[#DBA40D]" isLoading={loading} onClick={submit}>
        Update Hero
      </Button>
    </div>
  );
}