"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { Button } from "@nextui-org/react";

import { uploadToCloudinary } from "@/lib/cloudinary/uploadImage";
import { createBlog, updateBlog } from "@/lib/firestore/blogs/write";
import { getBlogById } from "@/lib/firestore/blogs/read";

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
    sections: [{ heading: "", description: "" }],
  });

  const [data, setData] = useState(dataRef.current);

  /* ================= SYNC REF + STATE ================= */
  const updateField = useCallback((key, value) => {
    dataRef.current[key] = value;
    setData((p) => ({ ...p, [key]: value }));
  }, []);

  /* ================= FETCH BLOG (EDIT MODE) ================= */
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
          mainTitle: res.mainTitle || res.title || "",
          detailHeading: res.detailHeading || "",
          slug: res.slug || "",
          excerpt: res.excerpt || "",
          image: res.image || null,
          sections:
            res.sections?.length > 0
              ? res.sections
              : [{ heading: "", description: "" }],
        };

        dataRef.current = filledData;
        setData(filledData);
      } catch (err) {
        toast.error("Failed to load blog");
      }
    };

    fetchBlog();
  }, [id, router]);

  /* ================= SECTION HANDLERS ================= */
  const addSection = () => {
    const sections = [
      ...dataRef.current.sections,
      { heading: "", description: "" },
    ];
    updateField("sections", sections);
  };

  const updateSection = (index, key, value) => {
    const sections = [...dataRef.current.sections];
    sections[index][key] = value;
    updateField("sections", sections);
  };

  const removeSection = (index) => {
    const sections = dataRef.current.sections.filter((_, i) => i !== index);
    updateField("sections", sections);
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

    if (!current.mainTitle.trim())
      return toast.error("Main title required");

    if (!current.slug.trim())
      return toast.error("Slug required");

    const validSections = current.sections.filter(
      (s) => s.heading.trim() && s.description.trim()
    );

    if (!validSections.length)
      return toast.error("Add at least one section");

    setLoading(true);

    try {
      const payload = {
        mainTitle: current.mainTitle.trim(),
        detailHeading: current.detailHeading.trim(),
        slug: current.slug.trim(),
        excerpt: current.excerpt.trim(),
        image: current.image,
        sections: validSections,
      };

      if (id) {
        await updateBlog({ data: { ...payload, id } });
        toast.success("Blog updated");
      } else {
        await createBlog({ data: payload });
        toast.success("Blog created");
      }

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

      <input
        type="file"
        accept="image/*"
        onChange={(e) => handleImage(e.target.files?.[0])}
      />

      {imgLoading && <p className="text-sm">Uploading...</p>}

      {data.image?.url && (
        <img src={data.image.url} className="h-32 rounded border" />
      )}

      <h3 className="font-semibold mt-6">Sections</h3>

      {data.sections.map((sec, i) => (
        <div key={i} className="border p-4 rounded mb-3">
          <input
            className="border p-2 w-full mb-2"
            placeholder="Section Heading"
            value={sec.heading}
            onChange={(e) =>
              updateSection(i, "heading", e.target.value)
            }
          />
          <textarea
            rows={4}
            className="border p-2 w-full"
            placeholder="Section Description"
            value={sec.description}
            onChange={(e) =>
              updateSection(i, "description", e.target.value)
            }
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
