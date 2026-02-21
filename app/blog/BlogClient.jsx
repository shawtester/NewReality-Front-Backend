"use client";

import { useEffect, useState } from "react";
import Pagination from "../components/property/Pagination";
import BlogPage from "./components/section1";
import { getBlogsForHome } from "@/lib/firestore/blogs/read";

export default function BlogClient() {
  const [blogs, setBlogs] = useState([]);
  const [page, setPage] = useState(1);

  const blogsPerPage = 4;

  useEffect(() => {
    const fetchBlogs = async () => {
      const res = await getBlogsForHome();
      setBlogs(res || []);
    };
    fetchBlogs();
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [page]);

  const start = (page - 1) * blogsPerPage;
  const visibleBlogs = blogs.slice(start, start + blogsPerPage);

  return (
    <>
      <div className="max-w-[1240px] mx-auto px-4 py-2 text-sm text-gray-500">
        Home / Blog
      </div>

      <BlogPage blogs={visibleBlogs} />

      <div className="py-10">
        <Pagination
          currentPage={page}
          totalPages={Math.ceil(blogs.length / blogsPerPage)}
          onPageChange={setPage}
        />
      </div>
    </>
  );
}