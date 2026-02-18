"use client";

import Image from "next/image";
import Link from "next/link";

export default function BlogTOC({
  tocItems = [],
  activeId,
  scrollToHeading,
  recentBlogs = [],
}) {
  return (
    <div className="space-y-6 w-[300px] lg:w-[320px] xl:w-[340px]">

      {/* ===== TABLE OF CONTENTS ===== */}
      <div className="bg-white rounded-lg p-5 shadow-sm">
        <h3 className="text-lg font-semibold mb-4">
          Table of Contents
        </h3>

        <ul className="space-y-2 text-sm">
          {tocItems.map((item) => (
            <li key={item.id}>

              {/* ===== H2 ===== */}
              <button
                onClick={() => scrollToHeading(item.id)}
                className={`
                  w-full text-left pl-3 py-1.5 border-l-2 transition-all duration-200
                  ${
                    activeId === item.id
                      ? "border-[#993F7F] text-[#DBA40D] font-semibold bg-[#FFF8F2]"
                      : "border-transparent text-gray-700 hover:text-[#DBA40D]"
                  }
                `}
              >
                {item.label}
              </button>

              {/* ===== H3 CHILDREN ===== */}
              {item.children?.length > 0 && (
                <ul className="mt-1 space-y-1">
                  {item.children.map((child) => (
                    <li key={child.id}>
                      <button
                        onClick={() => scrollToHeading(child.id)}
                        className={`
                          w-full text-left pl-6 py-1 border-l-2 transition-all duration-200 text-[13px]
                          ${
                            activeId === child.id
                              ? "border-[#993F7F] text-[#DBA40D] font-medium bg-[#FFF8F2]"
                              : "border-transparent text-gray-500 hover:text-[#DBA40D]"
                          }
                        `}
                      >
                        {child.label}
                      </button>
                    </li>
                  ))}
                </ul>
              )}

            </li>
          ))}
        </ul>
      </div>

      {/* ===== LATEST BLOGS ===== */}
      {recentBlogs.length > 0 && (
        <section className="bg-white rounded-lg p-5 shadow-sm">
          <h3 className="font-semibold mb-2">
            Latest Blogs
          </h3>

          <p className="text-xs text-gray-400 mb-4">
            Updates from around the world
          </p>

          <ul className="space-y-4">
            {recentBlogs.map((blog) => (
              <li key={blog.id} className="flex gap-3">
                <Image
                  src={blog.image?.url || "/images/placeholder.jpg"}
                  alt={blog.title}
                  width={44}
                  height={44}
                  className="rounded-full object-cover"
                />
                <div>
                  <p className="text-sm font-medium line-clamp-2">
                    {blog.title}
                  </p>
                  <Link
                    href={`/blog/${blog.slug}`}
                    className="text-xs text-[#993F7F] font-semibold"
                  >
                    Read More
                  </Link>
                </div>
              </li>
            ))}
          </ul>

          <div className="flex justify-center mt-4">
            <Link
              href="/blog"
              className="bg-[#DBA40D] text-white px-4 py-2 rounded-lg text-sm font-semibold"
            >
              View more
            </Link>
          </div>
        </section>
      )}
    </div>
  );
}
