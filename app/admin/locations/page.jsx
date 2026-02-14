"use client";

import { useEffect, useState } from "react";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function LocationManager() {
  const [name, setName] = useState("");
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadLocations = async () => {
    const snap = await getDocs(collection(db, "locations"));
    setLocations(
      snap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
    );
  };

  useEffect(() => {
    loadLocations();
  }, []);

  const addLocation = async () => {
    if (!name.trim()) return;

    setLoading(true);

    await addDoc(collection(db, "locations"), {
      name,
      slug: name.toLowerCase().replace(/\s+/g, "-"),
      isActive: true,
      createdAt: new Date(),
    });

    setName("");
    await loadLocations();
    setLoading(false);
  };

  const deleteLocation = async (id) => {
    const confirmDelete = confirm("Are you sure you want to delete?");
    if (!confirmDelete) return;

    await deleteDoc(doc(db, "locations", id));
    loadLocations();
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white shadow-md rounded-xl p-6 space-y-6">
        <h1 className="text-2xl font-semibold">
          Location Manager
        </h1>

        {/* Add Location */}
        <div className="flex gap-3">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter Location Name"
            className="flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black"
          />

          <button
            onClick={addLocation}
            disabled={loading}
            className="bg-black text-white px-5 py-2 rounded-lg hover:bg-gray-800 transition disabled:opacity-50"
          >
            {loading ? "Adding..." : "Add"}
          </button>
        </div>

        {/* Location List */}
        <div className="space-y-3">
          {locations.length === 0 && (
            <p className="text-gray-500 text-sm">
              No locations added yet.
            </p>
          )}

          {locations.map((loc) => (
            <div
              key={loc.id}
              className="flex items-center justify-between border rounded-lg px-4 py-3 hover:shadow-sm transition"
            >
              <div>
                <p className="font-medium">{loc.name}</p>
                <p className="text-xs text-gray-500">
                  Slug: {loc.slug}
                </p>
              </div>

              <button
                onClick={() => deleteLocation(loc.id)}
                className="text-red-600 text-sm hover:underline"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
