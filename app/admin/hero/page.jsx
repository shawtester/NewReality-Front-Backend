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
    mobileImages: [],
    desktopImages: [],
    videoUrl: "",
    mediaType: "youtube",
  });

  const [loading, setLoading] = useState(false);
  const [imgLoading, setImgLoading] = useState(false);

  /* ================= FETCH HERO ================= */
  const fetchHeroData = async () => {
    try {
      const res = await getHero();
      if (!res) return;

      setData({
        mobileImages: res.mobileImages || [],
        desktopImages: res.desktopImages || [],
        videoUrl: res.videoUrl || "",
        mediaType: res.mediaType || "youtube",
      });
    } catch (err) {
      console.error("Fetch failed:", err);
    }
  };

  useEffect(() => {
    fetchHeroData();
  }, []);

  /* ================= IMAGE UPLOAD ================= */
  const handleUpload = async (files, type) => {
    if (!files?.length) return;

    try {
      setImgLoading(true);

      const uploadedImages = await Promise.all(
        Array.from(files).map(async (file) => {
          const url = await uploadToCloudinary(file);
          return { url, link: "" };
        })
      );

      setData((prev) => ({
        ...prev,
        [type]: [...prev[type], ...uploadedImages],
      }));

      toast.success("Images uploaded");
    } catch (err) {
      console.error(err);
      toast.error("Upload failed");
    } finally {
      setImgLoading(false);
    }
  };

  /* ================= UPDATE LINK ================= */
  const updateLink = (type, index, value) => {
    setData((prev) => {
      const updated = [...prev[type]];
      updated[index] = { ...updated[index], link: value };
      return { ...prev, [type]: updated };
    });
  };

  /* ================= REMOVE IMAGE ================= */
  const removeImage = (type, index) => {
    setData((prev) => ({
      ...prev,
      [type]: prev[type].filter((_, i) => i !== index),
    }));
  };

  /* ================= SAVE ================= */
  const submit = async () => {
    try {
      setLoading(true);

      const payload = {
        mobileImages: data.mobileImages,
        desktopImages: data.desktopImages,
        videoUrl: data.videoUrl,
        mediaType: data.mediaType,
        updatedAt: new Date().toISOString(),
      };

      console.log("Saving:", payload);

      await updateHero(payload);

      toast.success("Hero updated successfully");

      // ✅ REFRESH AFTER SAVE
      await fetchHeroData();

    } catch (err) {
      console.error(err);
      toast.error("Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-10">
      <h1 className="text-2xl font-semibold">Hero Section Admin</h1>

      {/* VIDEO SETTINGS */}
      <div className="space-y-4 p-6 border rounded-xl bg-gray-50">
        <h2 className="text-lg font-medium">Video Settings</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            type="url"
            label="Video URL"
            value={data.videoUrl}
            onChange={(e) =>
              setData((prev) => ({ ...prev, videoUrl: e.target.value }))
            }
          />

          <Select
            label="Media Type"
            selectedKeys={[data.mediaType]}
            onSelectionChange={(keys) =>
              setData((prev) => ({
                ...prev,
                mediaType: Array.from(keys)[0],
              }))
            }
          >
            <SelectItem key="youtube">YouTube</SelectItem>
            <SelectItem key="instagram">Instagram</SelectItem>
          </Select>
        </div>
      </div>

      {/* MOBILE IMAGES */}
      <div>
        <h2 className="text-xl font-semibold text-blue-600 mb-4">
          📱 Mobile Images
        </h2>

        <input
          type="file"
          multiple
          accept="image/*"
          onChange={(e) => handleUpload(e.target.files, "mobileImages")}
          className="border p-3 rounded-lg w-full mb-6"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.mobileImages.map((img, index) => (
            <div key={index} className="p-4 border rounded-xl bg-white">
              <div className="relative h-48 rounded-lg overflow-hidden">
                <Image
                  src={img.url}
                  alt="Mobile"
                  fill
                  className="object-cover"
                />
              </div>

              <Input
                label="Redirect Link"
                value={img.link || ""}
                onChange={(e) =>
                  updateLink("mobileImages", index, e.target.value)
                }
                className="mt-3"
              />

              <Button
                color="danger"
                variant="flat"
                className="w-full mt-2"
                onClick={() => removeImage("mobileImages", index)}
              >
                Remove
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* DESKTOP IMAGES */}
      <div>
        <h2 className="text-xl font-semibold text-emerald-600 mb-4">
          💻 Desktop Images
        </h2>

        <input
          type="file"
          multiple
          accept="image/*"
          onChange={(e) => handleUpload(e.target.files, "desktopImages")}
          className="border p-3 rounded-lg w-full mb-6"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.desktopImages.map((img, index) => (
            <div key={index} className="p-4 border rounded-xl bg-white">
              <div className="relative h-56 rounded-lg overflow-hidden">
                <Image
                  src={img.url}
                  alt="Desktop"
                  fill
                  className="object-cover"
                />
              </div>

              <Input
                label="Redirect Link"
                value={img.link || ""}
                onChange={(e) =>
                  updateLink("desktopImages", index, e.target.value)
                }
                className="mt-3"
              />

              <Button
                color="danger"
                variant="flat"
                className="w-full mt-2"
                onClick={() => removeImage("desktopImages", index)}
              >
                Remove
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* SAVE BUTTON */}
      <Button
        className="w-full bg-[#DBA40D] text-white text-lg py-8 rounded-xl"
        isLoading={loading}
        onClick={submit}
      >
        💾 Save All Changes
      </Button>
    </div>
  );
}
