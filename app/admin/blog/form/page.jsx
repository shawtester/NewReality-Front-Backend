"use client";

import { useEffect, useState, useCallback, useRef } from "react";
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
  
  // 🔥 USE REF TO BYPASS STATE RACE CONDITION
  const dataRef = useRef({
    mainTitle: "",
    detailHeading: "",
    slug: "",
    excerpt: "",
    image: null,
    sections: [{ heading: "", description: "" }],
  });

  const [data, setData] = useState(dataRef.current);

  /* ================= SYNC REF + STATE ================= */
  const updateDataField = useCallback((field, value) => {
    dataRef.current[field] = value;
    setData(prev => ({ ...prev, [field]: value }));
  }, []);

  /* ================= FETCH BLOG (EDIT MODE) ================= */
  useEffect(() => {
    if (!id) return;
    
    console.log("🔍 Fetching blog ID:", id);
    
    const fetchBlog = async () => {
      try {
        const res = await getBlogById({ id });
        
        if (!res) {
          toast.error("Blog not found");
          router.push("/admin/blog");
          return;
        }

        console.log("📄 Fetched blog:", res);
        
        const newData = {
          mainTitle: res.mainTitle || "",
          detailHeading: res.detailHeading || "",
          slug: res.slug || "",
          excerpt: res.excerpt || "",
          image: res.image || null,
          sections: res.sections?.length > 0 ? res.sections : [{ heading: "", description: "" }],
        };
        
        dataRef.current = newData;
        setData(newData);
      } catch (err) {
        console.error("❌ Fetch error:", err);
        toast.error("Failed to load blog");
      }
    };

    fetchBlog();
  }, [id, router]);

  /* ================= SECTION HANDLERS ================= */
  const addSection = useCallback(() => {
    const newSections = [...dataRef.current.sections, { heading: "", description: "" }];
    dataRef.current.sections = newSections;
    setData(prev => ({ ...prev, sections: newSections }));
  }, []);

  const updateSection = useCallback((index, key, value) => {
    const sections = [...dataRef.current.sections];
    sections[index][key] = value;
    dataRef.current.sections = sections;
    setData(prev => ({ ...prev, sections }));
  }, []);

  const removeSection = useCallback((index) => {
    const sections = dataRef.current.sections.filter((_, i) => i !== index);
    dataRef.current.sections = sections;
    setData(prev => ({ ...prev, sections }));
  }, []);

  /* ================= IMAGE UPLOAD ================= */
  const handleImage = async (file) => {
    if (!file) return;

    setImgLoading(true);
    try {
      console.log("🖼️ Uploading image...");
      const res = await uploadToCloudinary(file);
      updateDataField('image', res);
      toast.success("Image uploaded successfully!");
    } catch (err) {
      console.error("❌ Image upload failed:", err);
      toast.error("Image upload failed");
    } finally {
      setImgLoading(false);
    }
  };

  /* ================= BULLETPROOF SUBMIT ================= */
  const submit = async () => {
    // 🔥 USE REF FOR VALIDATION - NO STATE RACE CONDITION
    const currentData = dataRef.current;
    
    console.log("🔍 REF DATA (100% accurate):", currentData);
    console.log("mainTitle:", `"${currentData.mainTitle}" (length: ${currentData.mainTitle?.length || 0})`);
    console.log("detailHeading:", `"${currentData.detailHeading}"`);

    // 🔥 VALIDATE FROM REF - INSTANT ACCESS
    if (!currentData.mainTitle?.trim()) {
      console.log("❌ mainTitle FAILED (ref value):", `"${currentData.mainTitle}"`);
      return toast.error("Main title is required");
    }
    
    if (!currentData.detailHeading?.trim()) {
      return toast.error("Detail page heading is required");
    }
    
    if (!currentData.slug?.trim()) {
      return toast.error("Slug is required");
    }

    const validSections = currentData.sections.filter(
      (s) => s.heading?.trim() && s.description?.trim()
    );

    if (validSections.length === 0) {
      return toast.error("Add at least one complete section");
    }

    console.log("✅ ALL VALIDATIONS PASSED ✅");
    console.log("Valid sections:", validSections.length);

    setLoading(true);

    try {
      const payload = {
        mainTitle: currentData.mainTitle.trim(),
        detailHeading: currentData.detailHeading.trim(),
        slug: currentData.slug.trim(),
        excerpt: currentData.excerpt?.trim() || "",
        image: currentData.image,
        sections: validSections.map(s => ({
          heading: s.heading.trim(),
          description: s.description.trim()
        })),
      };

      console.log("📤 FINAL PAYLOAD:", payload);

      if (id) {
        console.log("📝 Calling updateBlog...");
        await updateBlog({ id, data: payload });
        toast.success("Blog updated successfully!");
      } else {
        console.log("➕ Calling createBlog...");
        await createBlog({ data: payload });
        toast.success("Blog created successfully!");
      }

      router.push("/admin/blog");
      router.refresh();
    } catch (err) {
      console.error("💥 SAVE ERROR:", err);
      toast.error(err.message || "Failed to save blog");
    } finally {
      setLoading(false);
    }
  };

  /* ================= UI ================= */
  return (
    <div className="max-w-3xl p-6 space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">
        {id ? "Update Blog" : "Create New Blog"}
      </h1>

      {/* MAIN TITLE */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Main Title (Admin / Listing) <span className="text-red-500">*</span>
        </label>
        <input
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#DBA40D] focus:border-transparent transition-all"
          placeholder="Enter main title..."
          value={data.mainTitle}
          onChange={(e) => updateDataField('mainTitle', e.target.value)}
        />
      </div>

      {/* DETAIL HEADING */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Detail Page Heading (H1) <span className="text-red-500">*</span>
        </label>
        <input
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#DBA40D] focus:border-transparent transition-all"
          placeholder="Enter H1 title..."
          value={data.detailHeading}
          onChange={(e) => updateDataField('detailHeading', e.target.value)}
        />
      </div>

      {/* SLUG */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Slug <span className="text-red-500">*</span>
        </label>
        <input
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#DBA40D] focus:border-transparent transition-all"
          placeholder="Enter slug (e.g., my-first-blog)"
          value={data.slug}
          onChange={(e) => updateDataField('slug', e.target.value)}
        />
      </div>

      {/* EXCERPT */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Excerpt</label>
        <textarea
          rows={3}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#DBA40D] focus:border-transparent resize-vertical transition-all"
          placeholder="Short description for blog listing..."
          value={data.excerpt}
          onChange={(e) => updateDataField('excerpt', e.target.value)}
        />
      </div>

      {/* IMAGE UPLOAD */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Featured Image</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => handleImage(e.target.files?.[0])}
          className="w-full p-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-[#DBA40D] cursor-pointer transition-all"
          disabled={imgLoading}
        />
        {imgLoading && (
          <p className="text-sm text-[#DBA40D] mt-2 flex items-center">
            <span className="w-4 h-4 border-2 border-[#DBA40D] border-t-transparent rounded-full animate-spin mr-2"></span>
            Uploading...
          </p>
        )}
        {data.image?.url && (
          <div className="mt-3">
            <img
              src={data.image.url}
              alt="Blog preview"
              className="h-32 w-48 object-cover border rounded-lg shadow-sm"
            />
          </div>
        )}
      </div>

      {/* SECTIONS */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Blog Sections <span className="text-red-500">*</span></h3>
          <span className="text-sm text-gray-500">
            {data.sections.filter(s => s.heading.trim() && s.description.trim()).length} valid
          </span>
        </div>

        {data.sections.map((sec, i) => (
          <div key={i} className="border border-gray-200 p-6 mb-4 rounded-xl bg-white shadow-sm">
            <input
              className="w-full p-3 border border-gray-300 rounded-lg mb-3 focus:ring-2 focus:ring-[#DBA40D] focus:border-transparent"
              placeholder="Section Heading"
              value={sec.heading}
              onChange={(e) => updateSection(i, "heading", e.target.value)}
            />
            <textarea
              rows={4}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#DBA40D] focus:border-transparent resize-vertical"
              placeholder="Section Description"
              value={sec.description}
              onChange={(e) => updateSection(i, "description", e.target.value)}
            />
            {data.sections.length > 1 && (
              <button
                type="button"
                onClick={() => removeSection(i)}
                className="text-red-500 hover:text-red-700 text-sm font-medium mt-3"
              >
                ❌ Remove Section
              </button>
            )}
          </div>
        ))}

        <button
          type="button"
          onClick={addSection}
          className="text-[#DBA40D] hover:text-[#B88A0A] text-sm font-medium flex items-center mt-2"
          disabled={loading}
        >
          ➕ Add New Section
        </button>
      </div>

      {/* ACTIONS */}
      <div className="flex gap-4 pt-4 border-t">
        <Button
          type="button"
          variant="light"
          onClick={addSection}
          className="text-[#DBA40D] border-[#DBA40D]"
          startContent="➕"
          disabled={loading}
        >
          Add Section
        </Button>

        <Button
          type="button"
          color="primary"
          isLoading={loading}
          onClick={submit}
          className="bg-[#DBA40D] hover:bg-[#B88A0A] min-w-[140px] font-medium shadow-lg"
          disabled={loading}
        >
          {id ? "Update Blog" : "Create Blog"}
        </Button>
      </div>

      <div className="text-xs text-gray-500 mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
        
      </div>
    </div>
  );
}
