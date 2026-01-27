"use client";

import { getCategory } from "@/lib/firestore/categories/read_server";
import {
  createNewCategory,
  updateCategory,
} from "@/lib/firestore/categories/write";
import { uploadToCloudinary } from "@/lib/cloudinary/uploadImage";
import { Button } from "@nextui-org/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function Form() {
  const [data, setData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [imgLoading, setImgLoading] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  /* ================= FETCH ================= */
  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        const res = await getCategory({ id });
        if (!res) toast.error("Category Not Found");
        else setData(res);
      } catch (err) {
        toast.error("Fetch failed");
      }
    };

    fetchData();
  }, [id]);

  /* ================= HANDLE ================= */
  const handleData = (key, value) => {
    setData((prev) => ({ ...prev, [key]: value }));
  };

  /* ================= IMAGE UPLOAD ================= */
  const handleImageUpload = async (file) => {
    if (!file) return;

    setImgLoading(true);
    try {
      const res = await uploadToCloudinary(file);

      handleData("image", {
        url: res.secure_url,
        publicId: res.public_id, // ✅ IMPORTANT
      });

      toast.success("Image uploaded");
    } catch (err) {
      toast.error(err.message);
    }
    setImgLoading(false);
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async () => {
    if (!data.name || !data.slug) {
      toast.error("Name & Slug required");
      return;
    }

    setIsLoading(true);
    try {
      if (id) {
        await updateCategory({ data });
        toast.success("Updated");
        router.push("/admin/categories");
      } else {
        await createNewCategory({ data });
        toast.success("Created");
        setData({});
      }
    } catch (err) {
      toast.error(err.message);
    }
    setIsLoading(false);
  };

  return (
    <div className="bg-white p-5 rounded-xl w-full md:w-[420px]">
      <h1 className="text-lg font-semibold mb-4">
        {id ? "Update" : "Create"} Category
      </h1>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
        className="flex flex-col gap-4"
      >
        {/* NAME */}
        <input
          placeholder="Category Name"
          value={data.name ?? ""}
          onChange={(e) => handleData("name", e.target.value)}
          className="border px-4 py-2 rounded-lg"
        />

        {/* SLUG */}
        <input
          placeholder="Slug"
          value={data.slug ?? ""}
          onChange={(e) => handleData("slug", e.target.value)}
          className="border px-4 py-2 rounded-lg"
        />

        {/* IMAGE */}
        <input
          type="file"
          accept="image/*"
          onChange={(e) => handleImageUpload(e.target.files[0])}
        />

        {imgLoading && (
          <p className="text-xs text-gray-400">Uploading...</p>
        )}

        {data?.image?.url && (
          <div className="relative w-32 h-32">
            <img
              src={data.image.url}
              className="w-full h-full object-cover rounded-lg border"
            />
            <button
              type="button"
              onClick={() => handleData("image", null)}
              className="absolute top-1 right-1 bg-black text-white text-xs px-2 py-1 rounded"
            >
              ✕
            </button>
          </div>
        )}

        <Button type="submit" isLoading={isLoading} className="bg-[#DBA40D]">
          {id ? "Update" : "Create"}
        </Button>
      </form>
    </div>
  );
}
