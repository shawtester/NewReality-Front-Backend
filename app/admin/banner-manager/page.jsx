"use client";

import { useState } from "react";
import CategorySelect from "./components/CategorySelect";
import BannerUploader from "./components/BannerUploader";

export default function BannerManagerPage() {
  const [category, setCategory] = useState("residential");

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Banner Manager</h1>

      {/* Category Dropdown */}
      <CategorySelect
        category={category}
        setCategory={setCategory}
      />

      {/* Upload Section */}
      <BannerUploader category={category} />
    </div>
  );
}
