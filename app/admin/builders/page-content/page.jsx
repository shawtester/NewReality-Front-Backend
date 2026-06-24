"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { getSEO } from "@/lib/firestore/seo/read";
import { saveSEO } from "@/lib/firestore/seo/write";

const TinyEditor = dynamic(() => import("@/app/components/RichEditor"), {
  ssr: false,
  loading: () => <p>Loading editor...</p>,
});

export default function TopBuildersPageContentAdmin() {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const data = await getSEO("top-builders-in-gurgaon");
        if (data?.pageContent) {
          setContent(data.pageContent);
        }
      } catch (error) {
        console.error("Failed to load content", error);
      } finally {
        setLoading(false);
      }
    };
    fetchContent();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      // Fetch existing to not overwrite other SEO data if any
      const existing = await getSEO("top-builders-in-gurgaon");
      
      await saveSEO("top-builders-in-gurgaon", {
        ...(existing || {}),
        pageContent: content,
      });
      alert("Content saved successfully!");
    } catch (error) {
      console.error("Save failed", error);
      alert("Failed to save content.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Top Builders Page - Description Content</h1>
      
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Page Introduction / Description
          </label>
          <div className="bg-white rounded-lg overflow-hidden border">
            <TinyEditor
              value={content}
              onChange={setContent}
              imageUploadFolder="seo/content"
            />
          </div>
          
          <button
            onClick={handleSave}
            disabled={saving}
            className="mt-4 px-6 py-2 bg-[#DBA40D] text-white font-medium rounded hover:bg-[#c4920a] disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Content"}
          </button>
        </div>
      )}
    </div>
  );
}
