"use client";

import { useCategories } from "@/lib/firestore/categories/read";
import { deleteCategory } from "@/lib/firestore/categories/write";
import { Button, CircularProgress } from "@nextui-org/react";
import { Edit2, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

export default function ListView() {
  const { data: categories, error, isLoading } = useCategories();

  if (isLoading) {
    return (
      <div className="flex justify-center py-10">
        <CircularProgress />
      </div>
    );
  }

  if (error) return <div>{error}</div>;

  return (
    <div className="flex-1 flex flex-col gap-3 px-5">
      <h1 className="text-xl font-semibold">Categories</h1>

      <table className="border-separate border-spacing-y-3">
        <thead>
          <tr>
            <th className="border-y bg-white px-3 py-2 border-l rounded-l-lg">
              SN
            </th>
            <th className="border-y bg-white px-3 py-2">Image</th>
            <th className="border-y bg-white px-3 py-2 text-left">Name</th>
            <th className="border-y bg-white px-3 py-2 border-r rounded-r-lg text-center">
              Actions
            </th>
          </tr>
        </thead>

        <tbody>
          {categories.map((item, index) => (
            <Row key={item.id} item={item} index={index} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Row({ item, index }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm("Are you sure?")) return;
    setIsDeleting(true);
    try {
      await deleteCategory({ id: item.id });
      toast.success("Successfully Deleted");
    } catch (error) {
      toast.error(error.message);
    }
    setIsDeleting(false);
  };

  return (
    <tr>
      <td className="border-y bg-white px-3 py-2 border-l rounded-l-lg text-center">
        {index + 1}
      </td>

      {/* ✅ IMAGE FIX */}
      <td className="border-y bg-white px-3 py-2 text-center">
        <div className="flex justify-center">
          {item?.image?.url ? (
            <img
              src={item.image.url}
              alt={item.name}
              className="h-10 w-10 rounded object-cover"
            />
          ) : (
            <div className="h-10 w-10 bg-gray-200 rounded text-xs flex items-center justify-center">
              N/A
            </div>
          )}
        </div>
      </td>

      <td className="border-y bg-white px-3 py-2">
        {item.name}
      </td>

      <td className="border-y bg-white px-3 py-2 border-r rounded-r-lg">
        <div className="flex gap-2 justify-center">
          <Button
            className="bg-[#DBA40D]" 
            isIconOnly
            size="sm"
            onClick={() => router.push(`/admin/categories?id=${item.id}`)}
          >
            <Edit2 size={14} />
          </Button>

          <Button
            isIconOnly
            size="sm"
            color="danger"
            isLoading={isDeleting}
            onClick={handleDelete}
          >
            <Trash2 size={14} />
          </Button>
        </div>
      </td>
    </tr>
  );
}
