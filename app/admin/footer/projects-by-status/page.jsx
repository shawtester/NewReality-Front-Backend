"use client";

import { useEffect, useState } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

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

  const updateValue = (id, value) => {
    setData(prev => ({
      ...prev,
      links: prev.links.map(l =>
        l.id === id ? { ...l, value } : l
      )
    }));
  };

  const saveSingle = async (item) => {
    try {
      setSavingId(item.id);

      const updatedLinks = data.links.map(l =>
        l.id === item.id ? item : l
      );

      await updateDoc(
        doc(db, "footer_links", "projects_by_status"),
        { links: updatedLinks }
      );
    } finally {
      setSavingId(null);
    }
  };

  if (!data) {
    return (
      <div className="p-6 text-center text-gray-500">
        Loading project status...
      </div>
    );
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-2xl font-semibold mb-6">
        {data.title}
      </h2>

      {/* HEADER */}
      <div className="grid grid-cols-12 gap-4 mb-3 text-sm font-medium text-gray-500">
        <div className="col-span-6">Label</div>
        <div className="col-span-4">URL</div>
        <div className="col-span-2 text-right">Action</div>
      </div>

      {/* ROWS */}
      <div className="space-y-3">
        {data.links.map(item => (
          <div
            key={item.id}
            className="grid grid-cols-12 gap-4 items-center bg-white border rounded-lg px-4 py-3 hover:shadow-sm transition"
          >
            <div className="col-span-6 text-sm text-gray-800">
              {item.label}
            </div>

            <div className="col-span-4">
              <input
                value={item.value}
                onChange={(e) =>
                  updateValue(item.id, e.target.value)
                }
                className="w-full border rounded-md px-3 py-2 text-sm
                           focus:outline-none focus:ring-2 focus:ring-purple-500"
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
        ))}
      </div>
    </div>
  );
}
