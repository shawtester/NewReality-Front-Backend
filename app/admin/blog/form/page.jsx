"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { Button } from "@nextui-org/react";
import dynamic from "next/dynamic";

import { uploadToCloudinary } from "@/lib/cloudinary/uploadImage";
import { createBlog, updateBlog } from "@/lib/firestore/blogs/write";
import { getBlogById } from "@/lib/firestore/blogs/read";

import "react-quill/dist/quill.snow.css";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

const quillModules = {
  toolbar: [
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    ["bold", "italic", "underline"],
    [{ list: "ordered" }, { list: "bullet" }],
    ["link"],
    ["clean"],
  ],
};

export default function BlogForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const [loading, setLoading] = useState(false);
  const [imgLoading, setImgLoading] = useState(false);

  const dataRef = useRef({
    mainTitle: "",
    detailHeading: "",
    slug: "",
    excerpt: "",
    image: null,
    category: "",
    author: "",
    source: "",
    metaTitle: "",
    metaDescription: "",
    sections: "",
    anchors: [{ id: "", label: "" }],
    faqs: [{ question: "", answer: "" }],
    status: "draft",
  });

  const [data, setData] = useState(dataRef.current);

  const updateField = useCallback((key, value) => {
    dataRef.current[key] = value;
    setData((prev) => ({ ...prev, [key]: value }));
  }, []);

  /* ================= FETCH BLOG ================= */
  useEffect(() => {
    if (!id) return;

    const fetchBlog = async () => {
      const res = await getBlogById({ id });
      if (!res) return;

      const filled = {
        ...dataRef.current,
        ...res,
        description: res.description || "",
        anchors: res.anchors || [{ id: "", label: "" }],
        faqs: res.faqs || [{ question: "", answer: "" }],
        status: res.isActive ? "published" : "draft",
      };

      dataRef.current = filled;
      setData(filled);
    };

    fetchBlog();
  }, [id]);

  /* ================= IMAGE ================= */
  const handleImage = async (file) => {
    if (!file) return;
    setImgLoading(true);
    try {
      const res = await uploadToCloudinary(file);
      updateField("image", res);
      toast.success("Image uploaded");
    } catch {
      toast.error("Upload failed");
    } finally {
      setImgLoading(false);
    }
  };

  /* ================= ANCHOR FUNCTIONS ================= */

  const addAnchor = () => {
    updateField("anchors", [
      ...data.anchors,
      { id: "", label: "" },
    ]);
  };

  const updateAnchor = (index, key, value) => {
    const updated = [...data.anchors];
    updated[index][key] = value;
    updateField("anchors", updated);
  };

  const removeAnchor = (index) => {
    const updated = data.anchors.filter((_, i) => i !== index);
    updateField("anchors", updated);
  };

  /* ================= FAQ FUNCTIONS ================= */

  const addFaq = () => {
    updateField("faqs", [
      ...data.faqs,
      { question: "", answer: "" },
    ]);
  };

  const updateFaq = (index, key, value) => {
    const updated = [...data.faqs];
    updated[index][key] = value;
    updateField("faqs", updated);
  };

  const removeFaq = (index) => {
    const updated = data.faqs.filter((_, i) => i !== index);
    updateField("faqs", updated);
  };

  /* ================= SUBMIT ================= */

  const submit = async () => {
    const current = dataRef.current;

    if (!current.mainTitle.trim())
      return toast.error("Title required");

    if (!current.slug.trim())
      return toast.error("Slug required");

    const validFaqs = current.faqs.filter(
      (f) => f.question.trim() && f.answer.trim()
    );

    const payload = {
      ...current,
      faqs: validFaqs,
      isActive: current.status === "published",
    };

    setLoading(true);

    try {
      id
        ? await updateBlog({ data: { ...payload, id } })
        : await createBlog({ data: payload });

      toast.success(id ? "Updated" : "Created");
      router.push("/admin/blog");
    } catch {
      toast.error("Failed");
    } finally {
      setLoading(false);
    }
  };

  /* ================= UI ================= */

  return (
    <div className="max-w-4xl p-6 space-y-6">

      <h1 className="text-2xl font-bold">
        {id ? "Update Blog" : "Create Blog"}
      </h1>

      <input
        className="border p-3 rounded w-full"
        placeholder="Main Title"
        value={data.mainTitle}
        onChange={(e) => updateField("mainTitle", e.target.value)}
      />

      <input
        className="border p-3 rounded w-full"
        placeholder="Detail Page Heading (H1)"
        value={data.detailHeading}
        onChange={(e) => updateField("detailHeading", e.target.value)}
      />

      <input
        className="border p-3 rounded w-full"
        placeholder="Slug"
        value={data.slug}
        onChange={(e) => updateField("slug", e.target.value)}
      />

      <textarea
        rows={3}
        className="border p-3 rounded w-full"
        placeholder="Excerpt"
        value={data.excerpt}
        onChange={(e) => updateField("excerpt", e.target.value)}
      />

      <div className="grid grid-cols-2 gap-4">
        <input
          className="border p-3 rounded w-full"
          placeholder="Category"
          value={data.category}
          onChange={(e) => updateField("category", e.target.value)}
        />
        <input
          className="border p-3 rounded w-full"
          placeholder="Author"
          value={data.author}
          onChange={(e) => updateField("author", e.target.value)}
        />
      </div>

      <input
        className="border p-3 rounded w-full"
        placeholder="Source"
        value={data.source}
        onChange={(e) => updateField("source", e.target.value)}
      />

      <h3 className="font-semibold">SEO</h3>

      <input
        className="border p-3 rounded w-full"
        placeholder="Meta Title"
        value={data.metaTitle}
        onChange={(e) => updateField("metaTitle", e.target.value)}
      />

      <textarea
        rows={3}
        className="border p-3 rounded w-full"
        placeholder="Meta Description"
        value={data.metaDescription}
        onChange={(e) => updateField("metaDescription", e.target.value)}
      />

      <input type="file" onChange={(e) => handleImage(e.target.files?.[0])} />
      {imgLoading && <p>Uploading...</p>}
      {data.image?.url && (
        <img src={data.image.url} className="h-32 rounded border" />
      )}

      <h3 className="font-semibold">Description</h3>

      <ReactQuill
        theme="snow"
        value={data.description}
        onChange={(val) => updateField("sections", val)}
        modules={quillModules}
      />

      <h3 className="font-semibold mt-6">Table of Contents Anchors</h3>

      {data.anchors.map((anchor, i) => (
        <div key={i} className="border p-3 rounded space-y-2">
          <input
            placeholder="Anchor ID (no space)"
            value={anchor.id}
            onChange={(e) => updateAnchor(i, "id", e.target.value)}
            className="border p-2 rounded w-full"
          />
          <input
            placeholder="Display Label"
            value={anchor.label}
            onChange={(e) => updateAnchor(i, "label", e.target.value)}
            className="border p-2 rounded w-full"
          />
        </div>
      ))}

      <Button variant="light" onClick={addAnchor}>
        + Add Anchor
      </Button>

      <Button
        isLoading={loading}
        onClick={submit}
        className="bg-[#DBA40D]"
      >
        {id ? "Update Blog" : "Create Blog"}
      </Button>

    </div>
  );
}
