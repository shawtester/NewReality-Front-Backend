"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";

export default function BlogPage({ blogs = [] }) {
  const [query, setQuery] = useState("");

  /* ================= SEARCH ================= */
  const finalBlogs = blogs.filter((blog) =>
    `${blog.title || ""} ${blog.excerpt || ""}`
      .toLowerCase()
      .includes(query.toLowerCase())
  );

  /* ================= RECENT BLOGS (AUTO) ================= */
  const recentBlogs = useMemo(() => {
    return [...blogs]
      .sort(
        (a, b) =>
          (b.timestampCreate || 0) - (a.timestampCreate || 0)
      )
      .slice(0, 5);
  }, [blogs]);

  return (
    <main className="bg-white py-1">

      {/* ===== HEADING ===== */}
      <div className="max-w-[1240px] mx-auto px-4 text-center mb-10">
        <h1 className="text-3xl md:text-4xl font-bold">
          Blog and News Updates
        </h1>
        <p className="mt-4 text-sm md:text-base text-gray-500">
          Your trusted source for expert updates on residential and
          commercial real estate.
        </p>
      </div>

      {/* ===== MAIN GRID ===== */}
      <section className="max-w-[1240px] mx-auto px-4 grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-10 items-start">

        {/* ===== LEFT : BLOG CARDS ===== */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {finalBlogs.length > 0 ? (
            finalBlogs.map((blog) => (
              <Link
                key={blog.id}
                href={`/blog/${blog.id}`}
                className="block bg-white border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition"
              >
                {/* IMAGE */}
                <div className="relative h-48 w-full">
                  <Image
                    src={blog.image?.url || blog.image || "/images/placeholder.jpg"}
                    alt={blog.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />

                  {/* DATE */}
                  {blog.timestampCreate && (
                    <div className="absolute -bottom-6 right-4 bg-white rounded-2xl px-4 py-2 text-center shadow">
                      <span className="text-xs text-gray-600">
                        {new Date(
                          blog.timestampCreate * 1000
                        ).toLocaleDateString("en-US", {
                          month: "short",
                          day: "2-digit",
                        })}
                      </span>
                    </div>
                  )}
                </div>

                {/* CONTENT */}
                <div className="px-5 pt-8 pb-5">
                  <h2 className="text-sm md:text-base font-semibold line-clamp-2">
                    {blog.title}
                  </h2>

                  <p className="mt-2 text-xs md:text-sm text-gray-500 line-clamp-2">
                    {blog.excerpt}
                  </p>

                  <span className="inline-block mt-4 text-xs font-semibold text-black">
                    Read More →
                  </span>
                </div>
              </Link>
            ))
          ) : (
            query && (
              <p className="text-sm text-gray-500">
                No blogs found for “{query}”
              </p>
            )
          )}
        </div>

        {/* ===== RIGHT : SIDEBAR ===== */}
        <aside className="space-y-6 lg:sticky lg:top-24">

          {/* SEARCH */}
          <div className="bg-white border rounded-xl p-5 shadow-sm">
            <h3 className="font-semibold mb-3">Search Blogs</h3>
            <div className="flex items-center border rounded-full px-4 py-2">
              <input
                type="text"
                placeholder="Search here..."
                className="w-full text-sm outline-none"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
          </div>

          {/* RECENT BLOGS (DYNAMIC + EXCERPT) */}
          <div className="bg-white border rounded-xl p-5 shadow-sm">
            <h3 className="font-semibold mb-4 border-b pb-2">
              Recent Blogs
            </h3>

            <ul className="space-y-5">
              {recentBlogs.map((blog) => (
                <li key={blog.id}>
                  <Link
                    href={`/blog/${blog.id}`}
                    className="flex gap-3 items-start group"
                  >
                    {/* IMAGE */}
                    <div className="relative w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                      <Image
                        src={blog.image?.url || blog.image || "/images/placeholder.jpg"}
                        alt={blog.title}
                        fill
                        className="object-cover"
                      />
                    </div>

                    {/* CONTENT */}
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-gray-800 line-clamp-2 group-hover:text-black">
                        {blog.title}
                      </p>

                      {/* EXCERPT */}
                      {blog.excerpt && (
                        <p className="mt-1 text-xs text-gray-500 line-clamp-2">
                          {blog.excerpt}
                        </p>
                      )}

                      <span className="inline-block mt-1 text-xs font-semibold text-black">
                        Read More →
                      </span>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* SUBSCRIBE */}
          <div className="bg-white border rounded-xl p-5 shadow-sm">
            <h3 className="font-semibold mb-2">Subscribe</h3>
            <p className="text-xs text-gray-500 mb-3">
              Stay updated with everything real estate!
            </p>
            <input
              type="email"
              placeholder="Enter email"
              className="w-full border rounded-md px-3 py-2 text-sm outline-none"
            />
          </div>

        </aside>
      </section>
    </main>
  );
}