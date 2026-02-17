"use client";

import { getAdminBlogs } from "@/lib/firestore/blogs/read";
import { deleteBlog, updateBlog } from "@/lib/firestore/blogs/write";
import { Button } from "@nextui-org/react";
import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function AdminBlogPage() {
  const [blogs, setBlogs] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const router = useRouter();

  const fetchBlogs = async () => {
    const res = await getAdminBlogs();
    setBlogs(res);
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  /* ================= DELETE ================= */
  const handleDelete = async (id) => {
    if (!confirm("Delete this blog?")) return;
    await deleteBlog({ id });
    toast.success("Blog deleted");
    fetchBlogs();
  };

  /* ================= TOGGLE STATUS ================= */
  const toggleStatus = async (blog) => {
    try {
      await updateBlog({
        data: {
          ...blog,
          id: blog.id,
          isActive: !blog.isActive,
        },
      });

      toast.success(
        blog.isActive ? "Moved to Draft" : "Published successfully"
      );

      fetchBlogs();
    } catch {
      toast.error("Failed to update status");
    }
  };

  /* ================= FILTER + SEARCH ================= */
  const filteredBlogs = useMemo(() => {
    return blogs
      .filter((blog) => {
        if (statusFilter === "published") return blog.isActive;
        if (statusFilter === "draft") return !blog.isActive;
        return true;
      })
      .filter((blog) =>
        blog.mainTitle
          ?.toLowerCase()
          .includes(search.toLowerCase())
      );
  }, [blogs, search, statusFilter]);

  return (
    <div className="p-6 space-y-6">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Blogs</h1>
        <Button
          className="bg-[#DBA40D]"
          onClick={() => router.push("/admin/blog/form")}
        >
          Add Blog
        </Button>
      </div>

      {/* SEARCH + FILTER */}
      <div className="flex flex-col md:flex-row gap-4 md:items-center">
        <input
          type="text"
          placeholder="Search by title..."
          className="border p-3 rounded w-full md:w-1/3"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="border p-3 rounded w-full md:w-48"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
        </select>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto bg-white rounded-xl shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="text-left p-4">Title</th>
              <th className="text-left p-4">Category</th>
              <th className="text-left p-4">Author</th>
              <th className="text-left p-4">Status</th>
              <th className="text-left p-4">Created</th>
              <th className="text-center p-4">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredBlogs.map((blog) => (
              <tr
                key={blog.id}
                className="border-t hover:bg-gray-50 transition"
              >
                <td className="p-4 font-medium">
                  {blog.mainTitle}
                </td>

                <td className="p-4">
                  {blog.category || "-"}
                </td>

                <td className="p-4">
                  {blog.author || "-"}
                </td>

                {/* STATUS */}
                <td className="p-4">
                  <button
                    onClick={() => toggleStatus(blog)}
                    className={`px-3 py-1 text-xs rounded-full font-semibold transition ${
                      blog.isActive
                        ? "bg-green-100 text-green-700 hover:bg-green-200"
                        : "bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
                    }`}
                  >
                    {blog.isActive ? "Published" : "Draft"}
                  </button>
                </td>

                <td className="p-4">
                  {blog.timestampCreate
                    ? new Date(blog.timestampCreate * 1000).toLocaleDateString()
                    : "-"}
                </td>

                <td className="p-4 flex justify-center gap-2">
                  <Button
                    size="sm"
                    className="bg-[#DBA40D]"
                    onClick={() =>
                      router.push(`/admin/blog/form?id=${blog.id}`)
                    }
                  >
                    Edit
                  </Button>

                  <Button
                    size="sm"
                    color="danger"
                    onClick={() => handleDelete(blog.id)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}

            {filteredBlogs.length === 0 && (
              <tr>
                <td
                  colSpan="6"
                  className="text-center p-6 text-gray-500"
                >
                  No blogs found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

