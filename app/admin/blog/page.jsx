"use client";

import { getAdminBlogs } from "@/lib/firestore/blogs/read";
import { deleteBlog } from "@/lib/firestore/blogs/write";
import { Button } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function AdminBlogPage() {
  const [blogs, setBlogs] = useState([]);
  const router = useRouter();

  const fetchBlogs = async () => {
    const res = await getAdminBlogs();
    setBlogs(res);
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Delete this blog?")) return;
    await deleteBlog({ id });
    toast.success("Blog deleted");
    fetchBlogs();
  };

  return (
    <div className="p-5 space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold">Blogs</h1>
        <Button className="bg-[#DBA40D]" onClick={() => router.push("/admin/blog/form")}>
          Add Blog
        </Button>
      </div>

      <table className="w-full border-separate border-spacing-y-2">
        <thead>
          <tr>
            <th className="text-left">Title</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {blogs.map((blog) => (
            <tr key={blog.id} className="bg-white">
              <td className="p-3">{blog.title}</td>
              <td className="p-3 flex gap-2">
                <Button
                  className="bg-[#DBA40D]"
                  size="sm"
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
        </tbody>
      </table>
    </div>
  );
}
