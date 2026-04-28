"use client";

import { useRef, useState } from "react";
import { uploadPropertyImage } from "@/lib/cloudinary/uploadPropertyImage";

export default function PropertyImageUpload({ data, handleData }) {
  const [uploading, setUploading] = useState(false);

  const mainInputRef = useRef(null);
  const galleryInputRef = useRef(null);

  const getProjectImageName = () =>
    (data?.title || data?.slug || "property-image")
      .toString()
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "property-image";

  const uploadImages = async (files, type = "gallery") => {
    if (!files || files.length === 0) return;

    setUploading(true);

    try {
      const projectImageName = getProjectImageName();
      const existingGalleryCount = data.gallery?.length || 0;

      const uploadPromises = files.map((file, index) =>
        uploadPropertyImage(file, {
          folder: "properties",
          publicId:
            type === "main"
              ? projectImageName
              : `${projectImageName}-${existingGalleryCount + index + 1}`,
        })
      );

      const results = await Promise.all(uploadPromises);

      const uploaded = results
        .filter((res) => res?.url)
        .map((res) => ({
          url: res.url,
          publicId: res.publicId,
        }));

      console.log("FINAL UPLOADED:", uploaded);

      if (type === "main") {
        if (uploaded.length > 0) {
          handleData("mainImage", uploaded[0]);
        } else {
          alert("Image upload failed");
        }
      } else {
        handleData("gallery", [...(data.gallery || []), ...uploaded]);
      }

      if (type === "main" && mainInputRef.current) {
        mainInputRef.current.value = "";
      }
      if (type === "gallery" && galleryInputRef.current) {
        galleryInputRef.current.value = "";
      }
    } catch (err) {
      console.error(err);
      alert("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (publicId, type = "gallery") => {
    if (type === "main") {
      handleData("mainImage", null);
    } else {
      handleData(
        "gallery",
        (data.gallery || []).filter((img) => img.publicId !== publicId)
      );
    }
  };

  return (
    <div className="bg-white rounded-xl p-6 space-y-8 shadow-sm">
      <h2 className="text-lg font-semibold">Project Images</h2>

      <div className="space-y-2">
        <p className="text-sm font-medium">Main Image (1640 x 772 px)</p>

        <input
          ref={mainInputRef}
          type="file"
          accept="image/*"
          disabled={uploading}
          onChange={(e) => uploadImages(Array.from(e.target.files), "main")}
        />

        {data.mainImage?.url && (
          <div className="relative w-40 mt-2">
            <img src={data.mainImage.url} className="rounded-lg" alt="Main" />
            <button
              type="button"
              onClick={() => removeImage(null, "main")}
              className="absolute top-1 right-1 bg-black text-white px-2 text-xs rounded"
            >
              X
            </button>
          </div>
        )}
      </div>

      <div className="space-y-2">
        <p className="text-sm font-medium">Gallery Images</p>

        <input
          ref={galleryInputRef}
          type="file"
          accept="image/*"
          multiple
          disabled={uploading}
          onChange={(e) => uploadImages(Array.from(e.target.files), "gallery")}
        />

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-2">
          {data.gallery?.map((img) => (
            <div key={img.publicId} className="relative">
              <img
                src={img.url}
                className="h-24 w-full object-cover rounded"
                alt="Gallery"
              />
              <button
                type="button"
                onClick={() => removeImage(img.publicId)}
                className="absolute top-1 right-1 bg-black text-white text-xs px-2 rounded"
              >
                X
              </button>
            </div>
          ))}
        </div>
      </div>

      {uploading && <p className="text-sm text-gray-500">Uploading images...</p>}
    </div>
  );
}
