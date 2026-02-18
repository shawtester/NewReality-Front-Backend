"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

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

  const [formData, setFormData] = useState(defaultBlog);
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(false);

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
  const handleSubmit = async () => {
    try {
      setLoading(true);

      let finalImage = formData.image || null;

      /* ================= IMAGE LOGIC ================= */

      // ✅ Case 1: New image selected
      if (imageFile) {
        console.log("Uploading image...");
        const uploadResult = await uploadToCloudinary(imageFile);
        console.log("Upload Result:", uploadResult);

        finalImage = uploadResult; // 🔥 Direct assign
      }

      // ✅ Case 2: Image removed intentionally
      if (!imageFile && !formData.image?.url) {
        finalImage = null;
      }

      /* ================= FINAL DATA ================= */

      const finalData = {
        ...formData,
        image: finalImage,
      };

      if (blogId) {
        await updateBlog({
          id: blogId,
          data: finalData,
        });
        alert("Blog Updated ✅");
      } else {
        await createBlog({ data: finalData });
        alert("Blog Created ✅");
      }

      router.push("/admin/blog");
    } catch (error) {
      console.error("Save blog error:", error);
      alert("Error saving blog ❌");
    } finally {
      setLoading(false);
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

      <div className="flex justify-end pt-4 border-t">
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="px-8 py-3 rounded-xl text-white bg-black disabled:opacity-50"
        >
          {loading
            ? blogId
              ? "Updating..."
              : "Publishing..."
            : blogId
            ? "Update Blog"
            : "Publish Blog"}
        </button>
      </div>
    </div>
  );
}
