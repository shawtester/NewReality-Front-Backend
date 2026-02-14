"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import toast from "react-hot-toast";
import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css";

import { uploadBuilderLogo } from "@/lib/cloudinary/uploadBuilderLogo";
import { updateBuilder } from "@/lib/firestore/builders/write";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";

// 🔥 ReactQuill (SSR OFF)
const ReactQuill = dynamic(() => import("react-quill"), {
  ssr: false,
});

export default function EditBuilderPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [logo, setLogo] = useState(null);

  const [establishedYear, setEstablishedYear] = useState("");
  const [ongoingProjects, setOngoingProjects] = useState("");
  const [citiesPresent, setCitiesPresent] = useState("");
  const [totalProjects, setTotalProjects] = useState(0);
  const [manualTotalProjects, setManualTotalProjects] = useState(""); // 🔥 NEW

  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  /* 🔹 FETCH BUILDER */
  useEffect(() => {
    if (!id) return;

    const fetchBuilder = async () => {
      try {
        const snap = await getDoc(doc(db, "builders", id));
        if (!snap.exists()) {
          toast.error("Builder not found");
          router.push("/admin/builders");
          return;
        }

        const data = snap.data();

        setName(data.name || "");
        setDescription(data.description || "");
        setLogo(data.logo || null);

        setEstablishedYear(data.establishedYear || "");
        setOngoingProjects(data.ongoingProjects || 0);
        setCitiesPresent(data.citiesPresent || 0);
        setTotalProjects(data.totalProjects || 0);
        setManualTotalProjects(data.manualTotalProjects || 0); // 🔥 NEW
      } catch {
        toast.error("Failed to load builder");
      }
      setLoading(false);
    };

    fetchBuilder();
  }, [id, router]);

  /* 🔹 LOGO UPLOAD */
  const handleLogoUpload = async (file) => {
    if (!file) return;

    setUploading(true);
    try {
      const res = await uploadBuilderLogo(file);
      setLogo(res);
      toast.success("Logo updated");
    } catch (err) {
      toast.error(err.message || "Upload failed");
    }
    setUploading(false);
  };

  const removeLogo = () => setLogo(null);

  /* 🔹 SUBMIT */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Builder name is required");
      return;
    }

    setSaving(true);
    try {
      await updateBuilder({
        id,
        data: {
          name: name.trim(),
          description,
          logo: logo || null,
          establishedYear: establishedYear
            ? Number(establishedYear)
            : null,
          ongoingProjects: Number(ongoingProjects) || 0,
          citiesPresent: Number(citiesPresent) || 0,
          manualTotalProjects:
            Number(manualTotalProjects) || 0, // 🔥 NEW
        },
      });

      toast.success("Builder updated");
      router.push("/admin/builders");
    } catch (err) {
      toast.error(err.message || "Update failed");
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="p-6 text-sm text-gray-400">
        Loading builder...
      </div>
    );
  }

  return (
    <>
      {/* 🔥 QUILL LINK FIX – LOCAL ONLY */}
      <style jsx global>{`
        .ql-tooltip {
          z-index: 9999 !important;
        }
      `}</style>

      <form onSubmit={handleSubmit} className="p-6 max-w-2xl space-y-6">
        <h1 className="text-xl font-semibold">Edit Builder</h1>

        {/* NAME */}
        <div>
          <label className="text-xs text-gray-500">
            Builder Name
          </label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 text-sm"
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
            modules={modules}
            formats={formats}
            bounds="body"
            className="bg-white"
          />
        </div>

        {/* STATS */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <input
            type="number"
            placeholder="Established Year"
            value={establishedYear}
            onChange={(e) =>
              setEstablishedYear(e.target.value)
            }
            className="border rounded-lg px-3 py-2 text-sm"
          />

          <input
            type="number"
            placeholder="Ongoing Projects"
            value={ongoingProjects}
            onChange={(e) =>
              setOngoingProjects(e.target.value)
            }
            className="border rounded-lg px-3 py-2 text-sm"
          />

          <input
            type="number"
            placeholder="Cities Present"
            value={citiesPresent}
            onChange={(e) =>
              setCitiesPresent(e.target.value)
            }
            className="border rounded-lg px-3 py-2 text-sm"
          />

          {/* 🔥 AUTO TOTAL (DISABLED) */}
          <input
            type="number"
            value={totalProjects}
            disabled
            className="border rounded-lg px-3 py-2 text-sm bg-gray-100"
          />

          {/* 🔥 NEW ADMIN EDITABLE */}
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
            onChange={(e) =>
              handleLogoUpload(e.target.files[0])
            }
          />

          {logo?.url && (
            <div className="mt-3 flex items-center gap-4">
              <Image
                src={logo.url}
                alt="Builder Logo"
                width={96}
                height={96}
                className="object-contain"
              />
              <button
                type="button"
                onClick={removeLogo}
                className="px-3 py-1 bg-red-500 text-white text-xs rounded"
              >
                Remove
              </button>
            </div>
          )}
        </div>

        {/* ACTIONS */}
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={saving}
            className="px-5 py-2 bg-blue-600 text-white rounded"
          >
            {saving ? "Saving..." : "Update Builder"}
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

/* 🔹 QUILL CONFIG */
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
