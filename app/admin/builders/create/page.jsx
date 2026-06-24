"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import toast from "react-hot-toast";
import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css";

import { uploadBuilderLogo } from "@/lib/cloudinary/uploadBuilderLogo";
import { createBuilder } from "@/lib/firestore/builders/write";

const ReactQuill = dynamic(() => import("react-quill"), {
  ssr: false,
});

export default function CreateBuilderPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [establishedYear, setEstablishedYear] = useState("");
  const [ongoingProjects, setOngoingProjects] = useState("");
  const [citiesPresent, setCitiesPresent] = useState("");
  const [manualTotalProjects, setManualTotalProjects] = useState(""); // 🔥 NEW

  // 🔹 SEO
  const [slug, setSlug] = useState("");
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [metaKeywords, setMetaKeywords] = useState("");

  const [logo, setLogo] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleLogoUpload = async (file) => {
    if (!file) return;
    setUploading(true);
    try {
      const res = await uploadBuilderLogo(file);
      setLogo(res);
      toast.success("Logo uploaded");
    } catch (err) {
      toast.error(err.message || "Upload failed");
    }
    setUploading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Builder name is required");
      return;
    }

    setSaving(true);
    try {
      await createBuilder({
        data: {
          name: name.trim(),
          description,
          logo: logo || null,
          establishedYear: establishedYear
            ? Number(establishedYear)
            : null,
          ongoingProjects: Number(ongoingProjects) || 0,
          citiesPresent: Number(citiesPresent) || 0,
          totalProjects: 0, // 🔥 AUTO
          manualTotalProjects: Number(manualTotalProjects) || 0, // 🔥 ADMIN EDITABLE
          slug: slug.trim(),
          metaTitle: metaTitle.trim(),
          metaDescription: metaDescription.trim(),
          metaKeywords: metaKeywords.trim(),
        },
      });

      toast.success("Builder created");
      router.push("/admin/builders");
    } catch (err) {
      toast.error(err.message || "Failed to create builder");
    }
    setSaving(false);
  };

  return (
    <>
      {/* 🔥 QUILL FIX – LOCAL CSS (NO GLOBAL FILE) */}
      <style jsx global>{`
        .ql-tooltip {
          z-index: 9999 !important;
        }
      `}</style>

      <form onSubmit={handleSubmit} className="p-6 max-w-2xl space-y-6">
        <h1 className="text-xl font-semibold">Add Builder</h1>

        {/* NAME */}
        <div>
          <label className="text-xs text-gray-500">Builder Name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 text-sm"
            placeholder="Max Estates"
          />
        </div>

        {/* DESCRIPTION */}
        <div>
          <label className="text-xs text-gray-500 mb-1 block">
            Description
          </label>

          <ReactQuill
            theme="snow"
            value={description}
            onChange={setDescription}
            placeholder="About the builder..."
            modules={modules}
            formats={formats}
            bounds="body"
            className="bg-white"
          />
        </div>

        {/* STATS */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input
            type="number"
            placeholder="Established Year"
            value={establishedYear}
            onChange={(e) => setEstablishedYear(e.target.value)}
            className="border rounded-lg px-3 py-2 text-sm"
          />
          <input
            type="number"
            placeholder="Ongoing Projects"
            value={ongoingProjects}
            onChange={(e) => setOngoingProjects(e.target.value)}
            className="border rounded-lg px-3 py-2 text-sm"
          />
          <input
            type="number"
            placeholder="Cities Present"
            value={citiesPresent}
            onChange={(e) => setCitiesPresent(e.target.value)}
            className="border rounded-lg px-3 py-2 text-sm"
          />

          {/* 🔥 NEW FIELD */}
          <input
            type="number"
            placeholder="Manual Total Projects"
            value={manualTotalProjects}
            onChange={(e) =>
              setManualTotalProjects(e.target.value)
            }
            className="border rounded-lg px-3 py-2 text-sm"
          />
        </div>

        {/* LOGO */}
        <div>
          <label className="text-xs text-gray-500 mb-1 block">
            Builder Logo
          </label>
          <input
            type="file"
            accept="image/*"
            disabled={uploading}
            onChange={(e) => handleLogoUpload(e.target.files[0])}
          />

          {logo?.url && (
            <div className="mt-3 w-24 h-24 relative">
              <Image
                src={logo.url}
                alt="Builder Logo"
                width={96}
                height={96}
                className="object-contain"
              />
            </div>
          )}
        </div>

        {/* SEO CONFIGURATION */}
        <div className="border-t pt-6">
          <h2 className="text-lg font-semibold mb-4">SEO Configuration</h2>
          <div className="space-y-4">
            <div>
              <label className="text-xs text-gray-500">Slug (Optional, auto-generated if blank)</label>
              <input
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="w-full border rounded-lg px-3 py-2 text-sm"
                placeholder="max-estates"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500">Meta Title</label>
              <input
                value={metaTitle}
                onChange={(e) => setMetaTitle(e.target.value)}
                className="w-full border rounded-lg px-3 py-2 text-sm"
                placeholder="Top Projects by Max Estates"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500 block mb-1">Meta Description</label>
              <textarea
                value={metaDescription}
                onChange={(e) => setMetaDescription(e.target.value)}
                className="w-full border rounded-lg px-3 py-2 text-sm"
                rows="3"
                placeholder="Explore the best properties by Max Estates in Gurgaon..."
              />
            </div>
            <div>
              <label className="text-xs text-gray-500 block mb-1">Meta Keywords</label>
              <input
                value={metaKeywords}
                onChange={(e) => setMetaKeywords(e.target.value)}
                className="w-full border rounded-lg px-3 py-2 text-sm"
                placeholder="real estate, builders, gurgaon"
              />
            </div>
          </div>
        </div>

        {/* ACTIONS */}
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={saving}
            className="px-5 py-2 bg-green-600 text-white rounded"
          >
            {saving ? "Saving..." : "Create Builder"}
          </button>

          <button
            type="button"
            onClick={() => router.back()}
            className="px-5 py-2 bg-gray-200 rounded"
          >
            Cancel
          </button>
        </div>
      </form>
    </>
  );
}

/* 🔹 Toolbar */
const modules = {
  toolbar: [
    ["bold", "italic", "underline"],
    [{ list: "ordered" }, { list: "bullet" }],
    ["link"],
    ["clean"],
  ],
};

const formats = [
  "bold",
  "italic",
  "underline",
  "list",
  "bullet",
  "link",
];
