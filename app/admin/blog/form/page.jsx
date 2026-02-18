"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

import { createBlog, updateBlog } from "@/lib/firestore/blogs/write";
import { getBlogById } from "@/lib/firestore/blogs/read";
import { uploadToCloudinary } from "@/lib/cloudinary/uploadImage";
import { defaultBlog } from "@/constants/defaultBlog";

import BasicDetails from "./components/BasicDetails";
import ContentEditor from "./components/ContentEditor";
import FAQBuilder from "./components/FAQBuilder";

export default function BlogFormPage() {

  const params = useParams();
  const router = useRouter();

  const blogId = params?.id; // present only in edit mode

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
        console.error(error);
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

      let finalImage = formData.image;

      if (imageFile) {
        const uploadResult = await uploadToCloudinary(imageFile);

        finalImage = {
          url: uploadResult.secure_url,
          publicId: uploadResult.public_id,
        };
      }

      const finalData = {
        ...formData,
        image: finalImage,
      };

      if (blogId) {
        await updateBlog({ id: blogId, data: finalData });
        alert("Blog Updated ✅");
      } else {
        await createBlog({ data: finalData });
        alert("Blog Created ✅");
      }

      router.push("/admin/blog");

    } catch (error) {
      console.error(error);
      alert("Error saving blog ❌");
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading blog...
      </div>
    );
  }

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
          className="px-8 py-3 rounded-xl text-white bg-black"
        >
          {blogId ? "Update Blog" : "Publish Blog"}
        </button>
      </div>

    </div>
  );
}

