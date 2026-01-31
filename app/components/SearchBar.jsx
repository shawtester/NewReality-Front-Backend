"use client";
import { useState } from "react";
import { index } from "@/lib/algoliaSearch";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  const handleChange = async (e) => {
    const value = e.target.value;
    setQuery(value);

    if (value.length < 2) {
      setResults([]);
      return;
    }

    const { hits } = await index.search(value);
    setResults(hits);
  };

  return (
    <div className="relative w-full max-w-xl">
      <input
        value={query}
        onChange={handleChange}
        placeholder="Search by City, Locality, or Project"
        className="w-full border px-4 py-3 rounded-xl"
      />

      {results.length > 0 && (
        <div className="absolute w-full bg-white shadow-lg rounded-xl mt-2 z-50">
          {results.map((item) => (
            <a
              key={item.objectID}
              href={`/property/${item.slug}`}
              className="block p-3 hover:bg-gray-100"
            >
              <p className="font-semibold">{item.title}</p>
              <p className="text-sm text-gray-500">{item.location}</p>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
