"use client";

import { useState, useEffect } from "react";
import { useResumes, deleteResume } from "@/lib/firestore/resumes";
import { CircularProgress, Button } from "@nextui-org/react";
import { Trash2 } from "lucide-react";

export default function AdminResumes() {
  const { data, error, isLoading } = useResumes();

  // ⭐ LOCAL STATE for instant UI update
  const [resumes, setResumes] = useState([]);

  useEffect(() => {
    if (data) setResumes(data);
  }, [data]);

  /* ================= DELETE ================= */
  const handleDelete = async (id) => {
    const confirmDelete = confirm("Delete this resume?");
    if (!confirmDelete) return;

    try {
      await deleteResume(id);

      // ✅ instantly remove from UI
      setResumes((prev) => prev.filter((r) => r.id !== id));

      alert("Resume deleted successfully");
    } catch (err) {
      console.error(err);
      alert(err.message || "Delete failed");
    }
  };

  if (isLoading)
    return (
      <div className="flex justify-center py-10">
        <CircularProgress />
      </div>
    );

  if (error) return <div className="text-red-500 p-6">{error}</div>;

  return (
    <div className="flex-1 flex flex-col gap-3 px-5 rounded-xl">
      <h1 className="text-2xl font-bold mb-6">
        Resumes ({resumes?.length || 0})
      </h1>

      {!resumes || resumes.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          No resumes found
        </div>
      ) : (
        <table className="border-separate border-spacing-y-3 w-full">
          <thead>
            <tr>
              <th className="font-semibold border-y bg-white px-3 py-2 border-l rounded-l-lg text-center">
                SN
              </th>
              <th className="font-semibold border-y bg-white px-3 py-2 text-left">
                Name
              </th>
              <th className="font-semibold border-y bg-white px-3 py-2 text-left">
                Email
              </th>
              <th className="font-semibold border-y bg-white px-3 py-2 text-left">
                Mobile
              </th>
              <th className="font-semibold border-y bg-white px-3 py-2 text-left">
                Position
              </th>
              <th className="font-semibold border-y bg-white px-3 py-2 text-left">
                Resume
              </th>
              <th className="font-semibold border-y bg-white px-3 py-2 rounded-r-lg text-center">
                Action
              </th>
            </tr>
          </thead>

          <tbody>
            {resumes.map((item, index) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="border-y bg-white px-3 py-2 border-l rounded-l-lg text-center">
                  {index + 1}
                </td>

                <td className="border-y bg-white px-3 py-2 font-semibold">
                  {item.fullName}
                </td>

                <td className="border-y bg-white px-3 py-2">
                  {item.email}
                </td>

                <td className="border-y bg-white px-3 py-2">
                  {item.mobile}
                </td>

                <td className="border-y bg-white px-3 py-2">
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                    {item.position}
                  </span>
                </td>

                {/* VIEW */}
                <td className="border-y bg-white px-3 py-2">
                  <a
                    href={item.resumeURL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-green-500 text-white text-sm rounded-lg hover:bg-green-600"
                  >
                    📄 View
                  </a>
                </td>

                {/* DELETE */}
                <td className="border-y bg-white px-3 py-2 rounded-r-lg text-center">
                  <Button
                    isIconOnly
                    size="sm"
                    className="bg-red-500 text-white"
                    onClick={() => handleDelete(item.id)}
                  >
                    <Trash2 size={14} />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
