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
    [{ header: [1, 2, 3, false] }],
    ["bold", "italic", "underline"],
    [{ color: [] }, { background: [] }],
    ["link"],
    [{ list: "ordered" }, { list: "bullet" }],
    ["clean"],
  ],
};

const quillFormats = [
  "header",
  "bold",
  "italic",
  "underline",
  "color",
  "background",
  "list",
  "bullet",
  "link",
];

export default function BlogForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const [loading, setLoading] = useState(false);
  const [imgLoading, setImgLoading] = useState(false);

  /* ================= SOURCE OF TRUTH ================= */
  const dataRef = useRef({
    id: "",
    mainTitle: "",
    detailHeading: "",
    slug: "",
    excerpt: "",
    image: null,
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
      try {
        const res = await getBlogById({ id });
        if (!res) {
          toast.error("Blog not found");
          router.push("/admin/blog");
          return;
        }

        const filledData = {
          id: res.id,
          mainTitle: res.mainTitle || "",
          detailHeading: res.detailHeading || "",
          slug: res.slug || "",
          excerpt: res.excerpt || "",
          image: res.image || null,
          sections: res.sections?.length ? res.sections : [""],
          faqs: res.faqs?.length ? res.faqs : [{ question: "", answer: "" }],
        };

        dataRef.current = filledData;
        setData(filledData);
      } catch {
        toast.error("Failed to load blog");
      }
    };

    fetchBlog();
  }, [id, router]);

  /* ================= SECTIONS ================= */
  const addSection = () => {
    updateField("sections", [...dataRef.current.sections, ""]);
  };

  const updateSection = (i, val) => {
    const sections = [...dataRef.current.sections];
    sections[i] = val;
    updateField("sections", sections);
  };

  const removeSection = (i) => {
    updateField(
      "sections",
      dataRef.current.sections.filter((_, idx) => idx !== i)
    );
  };

  /* ================= FAQ ================= */
  const addFaq = () => {
    updateField("faqs", [...dataRef.current.faqs, { question: "", answer: "" }]);
  };

  const updateFaq = (i, key, value) => {
    const faqs = [...dataRef.current.faqs];
    faqs[i] = { ...faqs[i], [key]: value };
    updateField("faqs", faqs);
  };

  const removeFaq = (i) => {
    updateField(
      "faqs",
      dataRef.current.faqs.filter((_, idx) => idx !== i)
    );
  };

  /* ================= IMAGE ================= */
  const handleImage = async (file) => {
    if (!file) return;
    setImgLoading(true);
    try {
      const res = await uploadToCloudinary(file);
      updateField("image", res);
      toast.success("Image uploaded");
    } catch {
      toast.error("Image upload failed");
    } finally {
      setImgLoading(false);
    }
  };

  /* ================= SUBMIT ================= */
  const submit = async () => {
    const current = dataRef.current;

    if (!current.mainTitle.trim()) return toast.error("Main title required");
    if (!current.slug.trim()) return toast.error("Slug required");

    const validSections = current.sections.filter(
      (s) => s && s.replace(/<(.|\n)*?>/g, "").trim()
    );

    if (!validSections.length)
      return toast.error("Add at least one section");

    const validFaqs = current.faqs.filter(
      (f) => f.question.trim() && f.answer.trim()
    );

    setLoading(true);

    try {
      const payload = {
        mainTitle: current.mainTitle.trim(),
        detailHeading: current.detailHeading.trim(),
        slug: current.slug.trim(),
        excerpt: current.excerpt.trim(),
        image: current.image,
        sections: validSections,
        faqs: validFaqs,
      };

      id
        ? await updateBlog({ data: { ...payload, id } })
        : await createBlog({ data: payload });

      toast.success(id ? "Blog updated" : "Blog created");
      router.push("/admin/blog");
      router.refresh();
    } catch (err) {
      toast.error(err.message || "Failed to save blog");
    } finally {
      setLoading(false);
    }
  };

  /* ================= UI ================= */
  return (
    <div className="max-w-3xl p-6 space-y-6">
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

      <input type="file" accept="image/*" onChange={(e) => handleImage(e.target.files?.[0])} />
      {imgLoading && <p className="text-sm">Uploading...</p>}
      {data.image?.url && (
        <img src={data.image.url} className="h-32 rounded border" />
      )}

      <h3 className="font-semibold mt-6">Sections</h3>

      {data.sections.map((content, i) => (
        <div key={i} className="border p-4 rounded mb-4">
          <ReactQuill
            theme="snow"
            value={content}
            onChange={(val) => updateSection(i, val)}
            modules={quillModules}
            formats={quillFormats}
          />
          {data.sections.length > 1 && (
            <button
              className="text-red-500 text-sm mt-2"
              onClick={() => removeSection(i)}
            >
              Remove Section
            </button>
          )}
        </div>
      ))}

      <Button variant="light" onClick={addSection}>
        + Add Section
      </Button>

      <h3 className="font-semibold mt-8">FAQs</h3>

      {data.faqs.map((faq, i) => (
        <div key={i} className="border p-4 rounded space-y-3">
          <input
            className="border p-2 rounded w-full"
            placeholder="Question"
            value={faq.question}
            onChange={(e) => updateFaq(i, "question", e.target.value)}
          />
          <textarea
            className="border p-2 rounded w-full"
            placeholder="Answer"
            rows={3}
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