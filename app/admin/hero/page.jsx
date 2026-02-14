"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import toast from "react-hot-toast";
import { Button, Input, Select, SelectItem } from "@nextui-org/react";

import { uploadToCloudinary } from "@/lib/cloudinary/uploadImage";
import { getHero } from "@/lib/firestore/hero/read";
import { updateHero } from "@/lib/firestore/hero/write";

export default function HeroAdminPage() {
  const [data, setData] = useState({
    images: [], // ✅ Array of objects { url, link }
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

  /* ================= UPDATE VIDEO URL ================= */
  const updateVideoUrl = (value) => {
    setData((prev) => ({
      ...prev,
      videoUrl: value,
    }));
  };

  /* ================= UPDATE MEDIA TYPE ================= */
  const updateMediaType = (value) => {
    setData((prev) => ({
      ...prev,
      mediaType: value,
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
      <h1 className="text-2xl font-semibold">Hero Section Admin</h1>

      {/* 🔥 VIDEO SECTION */}
      <div className="space-y-4 p-6 border rounded-xl bg-gray-50">
        <h2 className="text-lg font-medium">Video Settings</h2>
        <h4 className="text-sm text-gray-600 mt-2">
          example of links:
          YouTube Example: https://www.youtube.com/embed/watch?v=abcd1234 <br />
          Instagram Reel Example: https://www.instagram.com/reel/ABC123XYZ/
        </h4>

        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Video URL */}
          <div>
            <label className="block text-sm font-medium mb-2">Video URL</label>
            <Input
              type="url"
              placeholder="https://www.youtube.com/watch?v=..."
              value={data.videoUrl}
              onChange={(e) => updateVideoUrl(e.target.value)}
              className="w-full"
            />
            <p className="text-xs text-gray-500 mt-1">
              YouTube: paste full URL or embed link
            </p>
          </div>

          {/* Media Type */}
          <div>
            <label className="block text-sm font-medium mb-2">Media Type</label>
            <Select
              selectedKeys={data.mediaType}
              onSelectionChange={(keys) => updateMediaType(Array.from(keys)[0])}
              className="w-full"
            >
              <SelectItem key="youtube" value="youtube">YouTube</SelectItem>
              <SelectItem key="instagram" value="instagram">Instagram</SelectItem>
            </Select>
          </div>
        </div>

        {data.videoUrl && (
          <div className="mt-4 p-4 bg-white rounded-lg border">
            <p className="text-sm font-medium mb-2">Preview:</p>
            {data.mediaType === "youtube" ? (
              <iframe
                width="100%"
                height="200"
                src={data.videoUrl.includes("youtube.com") 
                  ? data.videoUrl.replace("watch?v=", "embed/") + "?autoplay=0"
                  : data.videoUrl}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                className="rounded-lg"
              />
            ) : (
              <blockquote
                className="instagram-media w-full h-[200px] rounded-lg overflow-hidden"
                data-instgrm-permalink={data.videoUrl}
                data-instgrm-version="14"
              />
            )}
          </div>
        )}
      </div>

      {/* IMAGE UPLOAD */}
      <div>
        <label className="block text-sm font-medium mb-3">Upload Hero Images</label>
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={(e) => handleImage(e.target.files)}
          className="border p-3 rounded-lg w-full file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#DBA40D] file:text-white hover:file:bg-yellow-500"
        />
      </div>

      {imgLoading && <p className="text-sm text-blue-600">Uploading images...</p>}

      {/* IMAGE GRID */}
      {data.images.length > 0 && (
        <div>
          <h2 className="text-lg font-medium mb-4">Hero Images ({data.images.length})</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.images.map((img, index) => (
              <div
                key={index}
                className="p-4 border rounded-xl shadow-md space-y-3 bg-white"
              >
                <div className="relative h-48 md:h-52 rounded-lg overflow-hidden">
                  <Image
                    src={img.url}
                    alt={`Hero ${index + 1}`}
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-200"
                  />
                </div>

                {/* 🔥 LINK INPUT */}
                <Input
                  type="url"
                  label="Redirect Link"
                  placeholder="https://yoursite.com/project or /residential/project"
                  value={img.link || ""}
                  onChange={(e) => updateLink(index, e.target.value)}
                  className="w-full"
                />

                <Button
                  size="sm"
                  color="danger"
                  variant="flat"
                  onClick={() => removeImage(index)}
                  className="w-full"
                >
                  🗑️ Remove Image
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SAVE BUTTON */}
      <Button
        className="w-full bg-[#DBA40D] text-white text-lg py-8 rounded-xl shadow-lg hover:bg-yellow-500 transition-all duration-200"
        isLoading={loading}
        onClick={submit}
        size="lg"
      >
        💾 Save All Changes (Images + Video)
      </Button>
    </div>
  );
}
