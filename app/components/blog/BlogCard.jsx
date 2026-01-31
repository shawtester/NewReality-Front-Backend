"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function BlogCard({ blog }) {
  const [imgSrc, setImgSrc] = useState(
    typeof blog.image === "string"
      ? blog.image
      : blog.image?.url ||
        blog.coverImage ||
        "/images/placeholder.jpg"
  );

  const blogId = blog.id;

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition">
      
      {/* IMAGE */}
      <div className="relative w-full h-[220px] bg-gray-100">
        <Image
          src={imgSrc}
          alt={blog.title || "Blog"}
          fill
          className="object-cover"
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
            {blog.timestampCreate
              ? new Date(
                  blog.timestampCreate * 1000
                ).toLocaleDateString("en-US", {
                  month: "short",
                  day: "2-digit",
                })
              : ""}
          </span>

          <Link
            href={`/blog/${blogId}`}
            className="text-sm font-medium text-[#DBA40D] hover:underline"
          >
            Read More →
          </Link>
        </div>
      </div>
    </div>
  );
}

