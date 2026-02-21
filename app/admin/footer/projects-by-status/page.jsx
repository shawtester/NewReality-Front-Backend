"use client";

import { useEffect, useState } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import RichEditor from "@/app/components/RichEditor";

export default function AdminFooterProjectStatus() {
  const [data, setData] = useState(null);
  const [savingId, setSavingId] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const snap = await getDoc(
      doc(db, "footer_links", "projects_by_status")
    );
    setData(snap.data());
  };

  /* ================= UPDATE FIELD ================= */
  const updateField = (id, key, value) => {
    setData((prev) => ({
      ...prev,
      links: prev.links.map((l) =>
        l.id === id ? { ...l, [key]: value } : l
      ),
    }));
  };

  /* ================= SAVE ================= */
  const saveSingle = async (item) => {
    try {
      setSavingId(item.id);

      const updatedLinks = data.links.map((l) =>
        l.id === item.id ? item : l
      );

      await updateDoc(
        doc(db, "footer_links", "projects_by_status"),
        { links: updatedLinks }
      );
    } catch (err) {
      alert("Something went wrong ❌");
    } finally {
      setSavingId(null);
    }
  };

  if (!data) {
    return (
      <div className="p-6 text-center text-gray-500">
        Loading project status links...
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-2xl font-semibold mb-6">
        {data.title}
      </h2>

      <div className="space-y-8">
        {data.links.map((item) => (
          <div
            key={item.id}
            className="bg-white border rounded-2xl p-6 shadow-sm"
          >
            {/* ================= TOP ROW ================= */}
            <div className="grid grid-cols-12 gap-4 mb-6 items-center">
              <div className="col-span-2 text-sm font-medium text-gray-800">
                {item.label}
              </div>

              <div className="col-span-3">
                <input
                  value={item.value}
                  onChange={(e) =>
                    updateField(item.id, "value", e.target.value)
                  }
                  className="w-full border rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-[#DBA40D]"
                />
              </div>

              <div className="col-span-5">
                <input
                  placeholder="SEO Heading (H1)"
                  value={item.heading || ""}
                  onChange={(e) =>
                    updateField(item.id, "heading", e.target.value)
                  }
                  className="w-full border rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-[#DBA40D]"
                />
              </div>

              <div className="col-span-2 text-right">
                <button
                  onClick={() => saveSingle(item)}
                  disabled={savingId === item.id}
                  className={`px-4 py-2 rounded-md text-sm text-white transition
                    ${
                      savingId === item.id
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-[#DBA40D] hover:bg-yellow-700"
                    }`}
                >
                  {savingId === item.id ? "Saving..." : "Save"}
                </button>
              </div>
            </div>

            {/* ================= CONTENT DESCRIPTION ================= */}
            <div className="mb-8">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                SEO Description (Content Section)
              </label>

              <div className="border rounded-lg overflow-hidden">
                <RichEditor
                  value={item.description || ""}
                  onChange={(val) =>
                    updateField(item.id, "description", val)
                  }
                />
              </div>

              <p className="text-xs text-gray-500 mt-2">
                Full Word-style formatting supported (tables, headings, links, images).
              </p>
            </div>

            {/* ================= SEO META SECTION ================= */}
            <div className="border-t pt-6">
              <h4 className="text-lg font-semibold text-gray-800 mb-4">
                SEO Meta Settings
              </h4>

              <div className="grid grid-cols-12 gap-6">
                {/* Meta Title */}
                <div className="col-span-12 md:col-span-6">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Meta Title
                  </label>
                  <input
                    value={item.metaTitle || ""}
                    onChange={(e) =>
                      updateField(item.id, "metaTitle", e.target.value)
                    }
                    className="w-full border rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-[#DBA40D]"
                    placeholder="Enter meta title"
                  />
                  <p
                    className={`text-xs mt-1 ${
                      (item.metaTitle || "").length > 60
                        ? "text-red-500"
                        : "text-gray-500"
                    }`}
                  >
                    {(item.metaTitle || "").length}/60 characters
                  </p>
                </div>

                {/* Meta Keywords */}
                <div className="col-span-12 md:col-span-6">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Meta Keywords (comma separated)
                  </label>
                  <input
                    value={item.metaKeywords || ""}
                    onChange={(e) =>
                      updateField(item.id, "metaKeywords", e.target.value)
                    }
                    className="w-full border rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-[#DBA40D]"
                    placeholder="under construction, ready to move, ongoing projects"
                  />
                </div>

                {/* Meta Description */}
                <div className="col-span-12">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Meta Description
                  </label>
                  <textarea
                    rows={3}
                    value={item.metaDescription || ""}
                    onChange={(e) =>
                      updateField(item.id, "metaDescription", e.target.value)
                    }
                    className="w-full border rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-[#DBA40D]"
                    placeholder="Enter meta description for SEO"
                  />
                  <p
                    className={`text-xs mt-1 ${
                      (item.metaDescription || "").length > 160
                        ? "text-red-500"
                        : "text-gray-500"
                    }`}
                  >
                    {(item.metaDescription || "").length}/160 characters
                  </p>
                </div>
              </div>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}