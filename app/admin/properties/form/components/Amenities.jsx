"use client";

  import { useState, useRef, useEffect } from "react";
  import { useAmenities } from "@/lib/firestore/amenities/read";

  export default function Amenities({ data, handleData }) {
    const { amenities, isLoading } = useAmenities();
    const selected = data.amenities || [];

    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState("");
    const dropdownRef = useRef(null);

    // Close on outside click
    useEffect(() => {
      const handler = (e) => {
        if (!dropdownRef.current?.contains(e.target)) {
          setOpen(false);
        }
      };
      document.addEventListener("mousedown", handler);
      return () => document.removeEventListener("mousedown", handler);
    }, []);

    const toggleAmenity = (id) => {
      if (selected.includes(id)) {
        handleData(
          "amenities",
          selected.filter((a) => a !== id)
        );
      } else {
        handleData("amenities", [...selected, id]);
      }
    };

    const selectedAmenities = amenities.filter((a) =>
      selected.includes(a.id)
    );

    const filteredAmenities = amenities.filter((a) =>
      a.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
      <div className="bg-white rounded-xl p-6 space-y-4 shadow-sm">
        <h2 className="text-lg font-semibold">Amenities</h2>

        {/* DROPDOWN */}
        <div className="relative" ref={dropdownRef}>
          <div
            onClick={() => setOpen(!open)}
            className="border rounded-lg px-3 py-2 min-h-[42px] cursor-pointer flex flex-wrap gap-2 items-center"
          >
            {selectedAmenities.length === 0 && (
              <span className="text-gray-400 text-sm">
                Select amenities
              </span>
            )}

            {selectedAmenities.map((a) => (
              <span
                key={a.id}
                className="flex items-center gap-2 bg-gray-100 rounded-full px-3 py-1 text-sm"
              >
                {a.image?.url && (
                  <img
                    src={a.image.url}
                    className="h-4 w-4 rounded object-cover"
                  />
                )}
                {a.name}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleAmenity(a.id);
                  }}
                  className="text-red-500"
                >
                  ✕
                </button>
              </span>
            ))}
          </div>

          {open && (
            <div className="absolute z-20 mt-2 w-full bg-white border rounded-lg shadow-lg max-h-64 overflow-y-auto">
              <input
                className="w-full px-3 py-2 border-b outline-none text-sm"
                placeholder="Search amenities..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />

              {isLoading && (
                <p className="p-3 text-sm text-gray-400">
                  Loading...
                </p>
              )}

              {!isLoading &&
                filteredAmenities.map((a) => (
                  <div
                    key={a.id}
                    onClick={() => toggleAmenity(a.id)}
                    className="px-3 py-2 flex items-center gap-3 cursor-pointer hover:bg-gray-50"
                  >
                    <input
                      type="checkbox"
                      checked={selected.includes(a.id)}
                      readOnly
                    />

                    {a.image?.url && (
                      <img
                        src={a.image.url}
                        className="h-6 w-6 rounded object-cover"
                      />
                    )}

                    <span>{a.name}</span>
                  </div>
                ))}

              {!isLoading && filteredAmenities.length === 0 && (
                <p className="p-3 text-sm text-gray-400">
                  No amenities found
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }
