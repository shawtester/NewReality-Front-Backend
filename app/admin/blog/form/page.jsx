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

/* ================= QUILL TOOLBAR ================= */
const quillModules = {
  toolbar: [
    [{ font: [] }],
    [{ size: ["small", false, "large", "huge"] }],
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    ["bold", "italic", "underline", "strike"],
    [{ script: "sub" }, { script: "super" }],
    [{ color: [] }, { background: [] }],
    [{ align: [] }],
    [{ list: "ordered" }, { list: "bullet" }],
    [{ indent: "-1" }, { indent: "+1" }],
    ["blockquote", "code-block"],
    ["link", "image", "video"],
    ["clean"],
  ],
};

const quillFormats = [
  "font",
  "size",
  "header",
  "bold",
  "italic",
  "underline",
  "strike",
  "script",
  "color",
  "background",
  "align",
  "list",
  "bullet",
  "indent",
  "blockquote",
  "code-block",
  "link",
  "image",
  "video",
];

export default function BlogForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const [loading, setLoading] = useState(false);
  const [imgLoading, setImgLoading] = useState(false);

  const dataRef = useRef({
    id: "",
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
    status: "draft",
    sections: [""],
    faqs: [{ question: "", answer: "" }],
  });

  const [data, setData] = useState(dataRef.current);

  const updateField = useCallback((key, value) => {
    dataRef.current[key] = value;
    setData((p) => ({ ...p, [key]: value }));
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

  /* ================= FAQ FUNCTIONS ================= */
  const addFaq = () => {
    const updated = [...data.faqs, { question: "", answer: "" }];
    updateField("faqs", updated);
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

    if (!current.mainTitle.trim()) return toast.error("Title required");
    if (!current.slug.trim()) return toast.error("Slug required");

    const validFaqs = current.faqs.filter(
      (f) => f.question.trim() && f.answer.trim()
    );

    const payload = {
      ...current,
      faqs: validFaqs,
      mainTitle: current.mainTitle.trim(),
      detailHeading: current.detailHeading.trim(),
      slug: current.slug.trim(),
      excerpt: current.excerpt.trim(),
      metaTitle: current.metaTitle.trim(),
      metaDescription: current.metaDescription.trim(),
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

      {/* BASIC INFO */}
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

      {/* CATEGORY + AUTHOR */}
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
        placeholder="Source (optional)"
        value={data.source}
        onChange={(e) => updateField("source", e.target.value)}
      />

      {/* STATUS */}
      <div className="flex gap-6">
        <label className="flex items-center gap-2">
          <input
            type="radio"
            checked={data.status === "draft"}
            onChange={() => updateField("status", "draft")}
          />
          Draft
        </label>

        <label className="flex items-center gap-2">
          <input
            type="radio"
            checked={data.status === "published"}
            onChange={() => updateField("status", "published")}
          />
          Published
        </label>
      </div>

      {/* SEO */}
      <h3 className="font-semibold mt-4">SEO Settings</h3>

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

      {/* IMAGE */}
      <input type="file" accept="image/*" onChange={(e) => handleImage(e.target.files?.[0])} />
      {imgLoading && <p>Uploading...</p>}
      {data.image?.url && (
        <img src={data.image.url} className="h-32 rounded border" />
      )}

      {/* CONTENT */}
      <h3 className="font-semibold">Sections</h3>
      {data.sections.map((content, i) => (
        <ReactQuill
          key={i}
          theme="snow"
          value={content}
          onChange={(val) => {
            const arr = [...data.sections];
            arr[i] = val;
            updateField("sections", arr);
          }}
          modules={quillModules}
          formats={quillFormats}
        />
      ))}

      {/* FAQ SECTION */}
      <h3 className="font-semibold mt-6">FAQs</h3>

      {data.faqs.map((faq, i) => (
        <div key={i} className="border p-4 rounded space-y-3">
          <input
            className="border p-2 rounded w-full"
            placeholder="Question"
            value={faq.question}
            onChange={(e) => updateFaq(i, "question", e.target.value)}
          />

          <textarea
            rows={3}
            className="border p-2 rounded w-full"
            placeholder="Answer"
            value={faq.answer}
            onChange={(e) => updateFaq(i, "answer", e.target.value)}
          />

          {data.faqs.length > 1 && (
            <button
              className="text-red-500 text-sm"
              onClick={() => removeFaq(i)}
            >
              Remove FAQ
            </button>
          )}
        </div>
      ))}

      <Button variant="light" onClick={addFaq}>
        + Add FAQ
      </Button>

      <Button isLoading={loading} onClick={submit} className="bg-[#DBA40D]">
        {id ? "Update Blog" : "Create Blog"}
      </Button>
    </div>
  );
}
