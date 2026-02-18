"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

export default function BlogContent({ blog, onHeadingsReady }) {
  const wrapperRef = useRef(null);

  if (!blog) return null;

  const imageSrc = blog.image?.url || null;

  const formattedDate = blog.timestampCreate
    ? new Date(blog.timestampCreate * 1000).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : null;

  useEffect(() => {
    if (!wrapperRef.current) return;

    const headings = wrapperRef.current.querySelectorAll("h2, h3");

    onHeadingsReady?.(headings);
  }, [blog]);

  return (
    <article className="space-y-8 max-w-[900px] xl:max-w-[1050px]">

      {/* ================= TITLE ================= */}
      <header className="space-y-4">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight tracking-tight text-gray-900">
          {blog.detailHeading || blog.title}
        </h1>

        <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500">
          <span>
            By{" "}
            <span className="font-medium text-gray-800">
              {blog.author || "Admin"}
            </span>
          </span>

          {formattedDate && (
            <>
              <span>•</span>
              <span>{formattedDate}</span>
            </>
          )}

          {blog.category && (
            <>
              <span>•</span>
              <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                {blog.category}
              </span>
            </>
          )}
        </div>

        {blog.excerpt && (
          <p className="text-lg text-gray-600 leading-relaxed">
            {blog.excerpt}
          </p>
        )}
      </header>

      {/* ================= FEATURE IMAGE ================= */}
      {imageSrc && (
        <div className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden shadow-sm">
          <Image
            src={imageSrc}
            alt={blog.title}
            fill
            priority
            className="object-cover"
          />
        </div>
      )}

      {/* ================= BLOG BODY ================= */}
      <div
        ref={wrapperRef}
        id="blog-wrapper"
        className="prose prose-lg max-w-none prose-headings:scroll-mt-32 prose-img:rounded-xl prose-a:text-black hover:prose-a:underline"
        dangerouslySetInnerHTML={{ __html: blog.content }}
      />

    </article>
  );
}
