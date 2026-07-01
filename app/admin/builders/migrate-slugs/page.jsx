"use client";

import { useState } from "react";
import toast from "react-hot-toast";

export default function MigrateBuilderSlugsPage() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);

  const handleMigrate = async () => {
    if (
      !confirm(
        "This will generate URL slugs for all builders without slugs. Continue?"
      )
    ) {
      return;
    }

    setLoading(true);
    setResults(null);

    try {
      const response = await fetch("/api/admin/migrate-builder-slugs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(`Migration completed! ${data.updated} builders updated.`);
        setResults(data);
      } else {
        toast.error(data.message || "Migration failed");
        setResults(data);
      }
    } catch (error) {
      toast.error(error.message || "Migration failed");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl space-y-6">
      <h1 className="text-2xl font-semibold">Migrate Builder URL Slugs</h1>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          <strong>What does this do?</strong> This migration will automatically
          generate URL-friendly slugs for all builders that don't have one yet.
        </p>
        <p className="text-sm text-blue-800 mt-2">
          <strong>Example:</strong> Instead of `/builder/Azz4VW9nHcSEkXWT5TAb`,
          builders will have URLs like `/builder/indiabulls-estate`
        </p>
      </div>

      <div className="flex gap-3">
        <button
          onClick={handleMigrate}
          disabled={loading}
          className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Migrating..." : "Start Migration"}
        </button>
      </div>

      {results && (
        <div className="space-y-4">
          <div className="bg-white border rounded-lg p-4">
            <h2 className="font-semibold text-lg mb-3">Migration Results</h2>

            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="bg-green-50 p-3 rounded">
                <p className="text-sm text-gray-600">Updated</p>
                <p className="text-2xl font-semibold text-green-600">
                  {results.updated || 0}
                </p>
              </div>
              <div className="bg-yellow-50 p-3 rounded">
                <p className="text-sm text-gray-600">Skipped</p>
                <p className="text-2xl font-semibold text-yellow-600">
                  {results.skipped || 0}
                </p>
              </div>
              <div className="bg-blue-50 p-3 rounded">
                <p className="text-sm text-gray-600">Total</p>
                <p className="text-2xl font-semibold text-blue-600">
                  {results.total || 0}
                </p>
              </div>
            </div>

            {results.results && results.results.length > 0 && (
              <div>
                <h3 className="font-semibold mb-2">Details</h3>
                <div className="bg-gray-50 rounded p-3 max-h-96 overflow-y-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2">Builder Name</th>
                        <th className="text-left p-2">New Slug</th>
                        <th className="text-left p-2">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {results.results.map((result) => (
                        <tr key={result.id} className="border-b">
                          <td className="p-2">{result.name}</td>
                          <td className="p-2 text-gray-600">
                            {result.slug || "-"}
                          </td>
                          <td className="p-2">
                            {result.status === "updated" && (
                              <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
                                ✓ Updated
                              </span>
                            )}
                            {result.status === "skipped" && (
                              <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs">
                                ⏭ Skipped
                              </span>
                            )}
                            {result.status === "error" && (
                              <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs">
                                ✗ Error
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
