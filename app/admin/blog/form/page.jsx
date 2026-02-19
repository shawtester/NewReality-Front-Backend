"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Timestamp } from "firebase/firestore";

import { createBlog, updateBlog } from "@/lib/firestore/blogs/write";
import { getBlogById } from "@/lib/firestore/blogs/read";
import { uploadToCloudinary } from "@/lib/cloudinary/uploadBlogImage";
import { defaultBlog } from "@/constants/defaultBlog";

import BasicDetails from "./components/BasicDetails";
import ContentEditor from "./components/ContentEditor";
import FAQBuilder from "./components/FAQBuilder";

export default function BlogFormPage() {
  const params = useParams();
  const router = useRouter();
  const blogId = params?.id;

  const [formData, setFormData] = useState({
    ...defaultBlog,
    timestampCreate: Timestamp.now(),
  });

  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(false);
  const [actionType, setActionType] = useState(null); // draft or publish

  /* ================= FETCH FOR EDIT ================= */
  useEffect(() => {
    if (!blogId) return;

    const fetchBlog = async () => {
      try {
        setInitialLoading(true);

        const blogData = await getBlogById({ id: blogId });
        if (!blogData) return;

        setFormData({
          ...defaultBlog,
          ...blogData,
        });
      } catch (error) {
        console.error("Fetch blog error:", error);
      } finally {
        setInitialLoading(false);
      }
    };

    fetchBlog();
  }, [blogId]);

  /* ================= SUBMIT ================= */
  const handleSubmit = async (type) => {
    try {
      setLoading(true);
      setActionType(type);

      let finalImage = formData.image || null;

      /* ================= IMAGE LOGIC ================= */
      if (imageFile) {
        const uploadResult = await uploadToCloudinary(imageFile);
        finalImage = uploadResult;
      }

      if (!imageFile && !formData.image?.url) {
        finalImage = null;
      }

      /* ================= FINAL DATA ================= */
      const finalData = {
        ...formData,
        image: finalImage,
        isActive: type === "publish", // 🔥 Draft or Publish
        timestampUpdate: Timestamp.now(),
      };

      if (!blogId) {
        finalData.timestampCreate = Timestamp.now();
      }

      if (blogId) {
        await updateBlog({
          id: blogId,
          data: finalData,
        });

        alert(
          type === "publish"
            ? "Blog Published ✅"
            : "Blog Saved as Draft 📝"
        );
      } else {
        await createBlog({ data: finalData });

        alert(
          type === "publish"
            ? "Blog Published ✅"
            : "Blog Saved as Draft 📝"
        );
      }

      router.push("/admin/blog");

    } catch (error) {
      console.error("Save blog error:", error);
      alert("Error saving blog ❌");
    } finally {
      setLoading(false);
      setActionType(null);
    }
  };

  /* ================= LOADING STATE ================= */
  if (initialLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading blog...
      </div>
    );
  }

  /* ================= UI ================= */
  return (
    <div className="max-w-5xl mx-auto py-10 px-6 space-y-10">

      <h1 className="text-2xl font-bold">
        {blogId ? "Edit Blog" : "Create Blog"}
      </h1>

      <BasicDetails
        formData={formData}
        setFormData={setFormData}
        setImageFile={setImageFile}
      />

      <ContentEditor
        formData={formData}
        setFormData={setFormData}
      />

      <FAQBuilder
        formData={formData}
        setFormData={setFormData}
      />

      {/* 🔥 ACTION BUTTONS */}
      <div className="flex justify-end gap-4 pt-4 border-t">

        {/* Draft Button */}
        <button
          onClick={() => handleSubmit("draft")}
          disabled={loading}
          className="px-6 py-3 rounded-xl border border-gray-400 text-gray-700 hover:bg-gray-100 transition disabled:opacity-50"
        >
          {loading && actionType === "draft"
            ? "Saving..."
            : "Save as Draft"}
        </button>

        {/* Publish Button */}
        <button
          onClick={() => handleSubmit("publish")}
          disabled={loading}
          className="px-8 py-3 rounded-xl text-white bg-black disabled:opacity-50"
        >
          {loading && actionType === "publish"
            ? "Publishing..."
            : blogId
              ? "Update & Publish"
              : "Publish Blog"}
        </button>

      </div>

    </div>
  );
}
