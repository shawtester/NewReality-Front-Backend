"use client";

import { useEffect, useState } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import RichEditor from "@/app/components/RichEditor"; // ✅ Add this

export default function AdminFooterProjectLocation() {
  const [data, setData] = useState(null);
  const [savingId, setSavingId] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const snap = await getDoc(
      doc(db, "footer_links", "projects_by_location")
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

  const saveSingle = async (item) => {
    try {
      setSavingId(item.id);

      const updatedLinks = data.links.map((l) =>
        l.id === item.id ? item : l
      );

      await updateDoc(
        doc(db, "footer_links", "projects_by_location"),
        { links: updatedLinks }
      );
    } finally {
      setSavingId(null);
    }
  };

  if (!data) {
    return (
      <div className="p-6 text-center text-gray-500">
        Loading project locations...
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-2xl font-semibold mb-6">
        {data.title}
      </h2>

      <div className="space-y-6">
        {data.links.map((item) => (
          <div
            key={item.id}
            className="bg-white border rounded-xl p-6 shadow-sm"
          >
            {/* ================= TOP ROW ================= */}
            <div className="grid grid-cols-12 gap-4 mb-4 items-center">
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
                  placeholder="SEO Heading"
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

            {/* ================= DESCRIPTION ================= */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                SEO Description
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
                You can use full Word-style formatting (tables, images, headings, etc.)
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
