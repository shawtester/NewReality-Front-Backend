"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function BlogCard({ blog }) {

  const [imgSrc, setImgSrc] = useState(
    blog.image?.url || blog.image || "/images/placeholder.jpg"
  );

  /* ===== SAFE DATE FORMATTER ===== */
  const formatBlogDate = (timestamp) => {
    if (!timestamp) return null;

    try {
      // Firestore Timestamp
      if (typeof timestamp?.toDate === "function") {
        return timestamp.toDate();
      }

      // Firestore object { seconds }
      if (timestamp?.seconds) {
        return new Date(timestamp.seconds * 1000);
      }

      // If already number
      if (typeof timestamp === "number") {
        return new Date(timestamp);
      }

      return null;
    } catch {
      return null;
    }
  };

  const formattedDate = formatBlogDate(blog.timestampCreate);

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition">

      {/* IMAGE */}
      <div className="relative w-full h-[220px] bg-gray-100">
        <Image
          src={imgSrc}
          alt={blog.title || "Blog"}
          fill
          className="object-cover"
          sizes="(max-width:768px) 100vw, 33vw"
          onError={() => setImgSrc("/images/placeholder.jpg")}
        />
      </div>

      {/* CONTENT */}
      <div className="p-4 flex flex-col gap-2">
        <h3 className="text-base font-semibold text-gray-900 line-clamp-2">
          {blog.title}
        </h3>

        <p className="text-sm text-gray-600 line-clamp-2">
          {blog.excerpt}
        </p>

        <div className="flex items-center justify-between mt-3">
          <span className="text-xs text-gray-400">
            {formattedDate
              ? formattedDate.toLocaleDateString("en-US", {
                  month: "short",
                  day: "2-digit",
                })
              : ""}
          </span>

          <Link
            href={`/blog/${blog.slug}`}
            className="text-sm font-medium text-[#DBA40D] hover:underline"
          >
            Read More →
          </Link>
        </div>
      </div>
    </div>
  );
}