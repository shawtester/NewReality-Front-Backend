"use client";

import Link from "next/link";
import Image from "next/image";

export default function BlogSection({ blogs = [] }) {
  if (!blogs.length) return null;

  return (
    <section className="max-w-[1240px] mx-auto px-4 mt-16">
      {/* HEADER */}
      <div className="relative mb-8">
        {/* CENTER TITLE */}
        <div className="text-center">
          <h2 className="text-3xl font-semibold text-gray-900">
            Blog and News <span className="text-[#DBA40D]">Updates</span>
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Your trusted source for expert updates on real estate.
          </p>
        </div>

        {/* EXPLORE MORE */}
        <div className="mt-4 md:mt-0 md:absolute md:right-0 md:top-1/2 md:-translate-y-1/2 text-center">
          <Link
            href="/blog"
            className="inline-flex items-center justify-center
              bg-[#DBA40D] border border-[#DBA40D]
              rounded-sm text-white font-medium
              px-5 py-2 text-sm transition hover:bg-[#c9920b]"
          >
            Explore More
          </Link>
        </div>
      </div>

      {/* BLOG CARDS */}
      <div className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth pb-6">
        {blogs.map((blog) => (
          <Link
            key={blog.id}
            href={`/blog/${blog.id}`}
            className="min-w-[300px] max-w-[300px] flex-shrink-0"
          >
            <article
              className="group h-full flex flex-col overflow-hidden rounded-2xl
                bg-white shadow-sm hover:shadow-lg transition-all duration-300
                hover:-translate-y-1"
            >
              {/* IMAGE */}
              <div className="relative w-full h-[200px]">
                <Image
                  src={blog.image || "/images/blog/placeholder.jpg"}  // ✅ FIXED
                  alt={blog.title}
                  fill
                  className="object-cover"
                  sizes="300px"
                />
              </div>

              {/* CONTENT */}
              <div className="flex flex-1 flex-col p-4">
                <h3 className="text-base font-semibold text-gray-900 line-clamp-2">
                  {blog.title}
                </h3>

                <p className="mt-2 text-sm text-gray-600 line-clamp-2">
                  {blog.excerpt}
                </p>

                <div className="mt-auto pt-4 flex items-center justify-between">
                  <span className="text-xs text-gray-400">
                    {blog.timestampCreate
                      ? new Date(blog.timestampCreate * 1000).toLocaleDateString(
                          "en-US",
                          { month: "short", day: "2-digit" }
                        )
                      : ""}
                  </span>

                  <span className="text-sm font-medium text-[#DBA40D]">
                    Read More →
                  </span>
                </div>
              </div>
            </article>
          </Link>
        ))}
      </div>
    </section>
  );
}
