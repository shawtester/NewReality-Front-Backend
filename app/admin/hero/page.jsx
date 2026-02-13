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
    images: [],
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

        // ✅ TERA FIRESTORE DIRECT STRUCTURE
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

  /* ================= IMAGE UPLOAD - MULTIPLE ✅ ================= */
  const handleImage = async (files) => {
    if (!files || files.length === 0) return;

    // ✅ No limit - upload all selected images
    try {
      setImgLoading(true);

      // Upload all files concurrently
      const uploadPromises = Array.from(files).map(async (file) => {
        try {
          return await uploadToCloudinary(file);
        } catch (err) {
          console.error(`Failed to upload ${file.name}:`, err);
          return null;
        }
      });

      const uploadedUrls = (await Promise.all(uploadPromises)).filter(Boolean);

      if (uploadedUrls.length > 0) {
        setData((prev) => ({
          ...prev,
          images: [...prev.images, ...uploadedUrls],
        }));
        toast.success(`${uploadedUrls.length} images uploaded successfully!`);
      } else {
        toast.error("No images were uploaded successfully");
      }
    } catch (err) {
      toast.error("Upload failed");
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

  /* ================= CLEAR ALL IMAGES ================= */
  const clearAllImages = () => {
    setData((prev) => ({
      ...prev,
      images: [],
    }));
    toast.success("All images cleared!");
  };

  /* ================= SUBMIT ================= */
  const submit = async () => {
    try {
      setLoading(true);

      // ✅ DIRECT OBJECT SEND (NEW WRITE STRUCTURE)
      await updateHero(data);

      toast.success("Hero section updated!");
    } catch (err) {
      console.error(err);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-6xl space-y-6">
      <h1 className="text-2xl font-semibold">Hero Section</h1>

      {/* ================= IMAGES - MULTIPLE UPLOAD ✅ ================= */}
      <div className="space-y-3">
        <div>
          <label className="text-sm font-medium block mb-2">Hero Images (Multiple Select - No Limit)</label>
          <input
            type="file"
            accept="image/*"
            multiple // ✅ Enable multiple file selection
            onChange={(e) => handleImage(e.target.files)}
            className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#DBA40D] file:text-white hover:file:bg-[#F5A300] border border-gray-300 p-3 w-full rounded-lg"
          />
        </div>

        {imgLoading && (
          <div className="flex items-center gap-2 text-sm text-blue-600">
            <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
            Uploading images...
          </div>
        )}

        {/* Images Preview Grid */}
        {data.images.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">
                {data.images.length} images selected
              </p>
              <Button 
                size="sm" 
                variant="light" 
                color="danger"
                onClick={clearAllImages}
              >
                Clear All
              </Button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {data.images.map((img, index) => (
                <div key={index} className="relative group h-28 sm:h-32 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-200">
                  <Image
                    src={img}
                    alt={`Hero ${index + 1}`}
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-300"
                  />

                  <button
                    onClick={() => removeImage(index)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-6 h-6 rounded-full flex items-center justify-center shadow-lg hover:bg-red-600 transition-all duration-200 opacity-0 group-hover:opacity-100"
                    title="Remove image"
                  >
                    ✕
                  </button>
                  
                  {/* Image index badge */}
                  <div className="absolute -bottom-2 -right-2 bg-[#DBA40D]/90 text-white text-xs px-2 py-1 rounded-full shadow-lg">
                    {index + 1}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ================= MEDIA TYPE RADIO ================= */}
      <div className="space-y-2 p-4 bg-gray-50 rounded-xl">
        <label className="text-sm font-medium">Select Media Type</label>

        <div className="flex gap-5 p-3 bg-white rounded-lg border">
          <label className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
            <input
              type="radio"
              name="mediaType"
              checked={data.mediaType === "youtube"}
              onChange={() =>
                setData((prev) => ({ ...prev, mediaType: "youtube" }))
              }
              className="w-4 h-4 text-[#DBA40D]"
            />
            <span className="text-sm">YouTube</span>
          </label>

          <label className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
            <input
              type="radio"
              name="mediaType"
              checked={data.mediaType === "instagram"}
              onChange={() =>
                setData((prev) => ({ ...prev, mediaType: "instagram" }))
              }
              className="w-4 h-4 text-[#DBA40D]"
            />
            <span className="text-sm">Instagram</span>
          </label>
        </div>
      </div>

      {/* ================= CONDITIONAL INPUT ================= */}
      {data.mediaType === "youtube" && (
        <div className="space-y-2 p-4 bg-gray-50 rounded-xl">
          <label className="text-sm font-medium">YouTube Embed URL</label>
          <input
            value={data.videoUrl}
            onChange={(e) =>
              setData((prev) => ({ ...prev, videoUrl: e.target.value }))
            }
            placeholder="https://www.youtube.com/embed/xxxx"
            className="border border-gray-300 p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-[#DBA40D] focus:border-transparent"
          />
        </div>
      )}

      {data.mediaType === "instagram" && (
        <div className="space-y-2 p-4 bg-gray-50 rounded-xl">
          <label className="text-sm font-medium">Instagram Reel/Post URL</label>
          <input
            value={data.videoUrl}
            onChange={(e) =>
              setData((prev) => ({ ...prev, videoUrl: e.target.value }))
            }
            placeholder="https://www.instagram.com/reel/xxxx"
            className="border border-gray-300 p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-[#DBA40D] focus:border-transparent"
          />
        </div>
      )}

      <Button 
        className="w-full bg-[#DBA40D] text-white py-3 text-base font-semibold hover:bg-[#F5A300] shadow-lg" 
        isLoading={loading} 
        onClick={submit}
        size="lg"
      >
        Update Hero Section
      </Button>
    </div>
  );
}
