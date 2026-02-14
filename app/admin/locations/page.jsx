"use client";

import { useEffect, useState } from "react";
import { collection, addDoc, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function LocationManager() {
  const [name, setName] = useState("");
  const [locations, setLocations] = useState([]);

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
    if (!name) return;

    await addDoc(collection(db, "locations"), {
      name,
      slug: name.toLowerCase().replace(/\s+/g, "-"),
      isActive: true,
    });

    setName("");
    loadLocations();
  };

  return (
    <div className="p-6 max-w-xl">
      <h1 className="text-xl font-semibold mb-4">
        Location Manager
      </h1>

      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Enter Location"
        className="border px-3 py-2 rounded w-full"
      />

      <button
        onClick={addLocation}
        className="bg-black text-white px-4 py-2 mt-3 rounded"
      >
        Add Location
      </button>

      <div className="mt-6 space-y-2">
        {locations.map((loc) => (
          <div key={loc.id} className="border p-2 rounded">
            {loc.name}
          </div>
        ))}
      </div>
    </div>
  );
}
