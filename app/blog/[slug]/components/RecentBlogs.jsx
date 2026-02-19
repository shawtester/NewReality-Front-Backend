"use client";

import Image from "next/image";
import Link from "next/link";

export default function RecentBlogs({ recentBlogs = [] }) {
  if (!recentBlogs.length) return null;

  return (
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
  );
}
