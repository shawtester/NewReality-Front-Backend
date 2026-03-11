"use client";

import Image from "next/image";
import Link from "next/link";

export default function BlogCard({ blog }) {

  /* SAFE IMAGE SOURCE */
  const imageSrc =
    blog?.image?.url ||
    blog?.image?.secure_url ||
    (typeof blog?.image === "string" ? blog?.image : null);

  /* DATE FORMAT */
  const formatBlogDate = (timestamp) => {
    if (!timestamp) return null;

    try {
      if (timestamp?.toDate) return timestamp.toDate();

      if (timestamp?.seconds)
        return new Date(timestamp.seconds * 1000);

      if (typeof timestamp === "string") {
        const date = new Date(timestamp);
        return isNaN(date.getTime()) ? null : date;
      }

      return null;
    } catch {
      return null;
    }
  };

  const formattedDate = formatBlogDate(
    blog?.timestampCreate || blog?.timestampUpdate
  );

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition">

      {/* IMAGE */}
      <div className="relative w-full h-[220px] bg-gray-100">

        {imageSrc ? (
          <Image
            src={imageSrc}
            alt={blog?.title || "Blog"}
            fill
            sizes="(max-width:768px) 100vw, 33vw"
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
            No Image
          </div>
        )}

      </div>

      {/* CONTENT */}
      <div className="p-4 flex flex-col gap-2">

        <h3 className="text-base font-semibold text-gray-900 line-clamp-2">
          {blog?.title || "Untitled Blog"}
        </h3>

        <p className="text-sm text-gray-600 line-clamp-2">
          {blog?.excerpt || blog?.shortDescription || ""}
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
            href={`/blog/${blog?.slug}`}
            className="text-sm font-medium text-[#DBA40D] hover:underline"
          >
            Read More →
          </Link>

        </div>

      </div>
    </div>
  );
}