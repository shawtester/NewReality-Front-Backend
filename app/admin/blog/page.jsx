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
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  /* ================= FETCH BLOGS ================= */
  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const res = await getAdminBlogs();
      setBlogs(res);
    } catch (err) {
      toast.error("Failed to load blogs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  /* ================= DELETE ================= */
  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this blog?")) return;

    try {
      await deleteBlog({ id });
      toast.success("Blog deleted successfully");
      fetchBlogs();
    } catch {
      toast.error("Failed to delete blog");
    }
  };

  /* ================= TOGGLE STATUS ================= */
  const toggleStatus = async (blog) => {
    try {
      await updateBlog({
        data: {
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
      .filter((blog) => {
        const searchValue = search.toLowerCase();
        return (
          blog.title?.toLowerCase().includes(searchValue) ||
          blog.slug?.toLowerCase().includes(searchValue) ||
          blog.author?.toLowerCase().includes(searchValue)
        );
      });
  }, [blogs, search, statusFilter]);

  /* ================= DATE FORMAT ================= */
  const formatDate = (timestamp) => {
    if (!timestamp) return "-";
    return new Date(timestamp * 1000).toLocaleDateString();
  };

  return (
    <div className="p-8 space-y-8">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Blogs</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage and publish blog articles
          </p>
        </div>

        <Button
          className="bg-black text-white"
          onClick={() => router.push("/admin/blog/form")}
        >
          + Add Blog
        </Button>
      </div>

      {/* SEARCH + FILTER */}
      <div className="flex flex-col md:flex-row gap-4 md:items-center">
        <input
          type="text"
          placeholder="Search by title, slug or author..."
          className="border px-4 py-2 rounded-lg w-full md:w-1/3 focus:outline-none focus:ring-2 focus:ring-black"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="border px-4 py-2 rounded-lg w-full md:w-48 focus:outline-none focus:ring-2 focus:ring-black"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
        </select>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto bg-white rounded-2xl shadow-md">

        {loading ? (
          <div className="p-10 text-center text-gray-500">
            Loading blogs...
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="text-left p-4">Title</th>
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
                    {blog.title}
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
                    {formatDate(blog.timestampCreate)}
                  </td>

                  <td className="p-4 flex justify-center gap-2">
                    <Button
                      size="sm"
                      className="bg-black text-white"
                      onClick={() =>
                        router.push(`/admin/blog/form/${blog.id}`)
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
                    colSpan="5"
                    className="text-center p-8 text-gray-500"
                  >
                    No blogs found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}

      </div>
    </div>
  );
}

