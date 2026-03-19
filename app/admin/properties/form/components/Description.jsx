"use client";

import RichEditor from "@/app/components/RichEditor";

export default function Description({ data, handleData }) {
  return (
    <section className="flex-1 bg-white border rounded-xl p-4">
      
      <h2 className="font-semibold mb-2">
        Description
      </h2>

      {/* ✅ RICH EDITOR */}
      <div className="border rounded-lg overflow-hidden">
        <RichEditor
          value={data.description || ""}
          onChange={(value) =>
            handleData("description", value)
          }
        />
      </div>

      <p className="text-xs text-gray-500 mt-2">
        You can use full formatting (bold, images, lists, etc.)
      </p>

    </section>
  );
}

