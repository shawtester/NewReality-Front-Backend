"use client";

import { useDevelopers } from "@/lib/firestore/developers/read";
import { deleteDeveloper } from "@/lib/firestore/developers/write"; // ✅ DELETE FUNCTION
import { Button } from "@nextui-org/react";
import { Edit2, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

export default function Page() {
  const { data, isLoading, error } = useDevelopers();
  const router = useRouter();

  /* ================= DELETE HANDLER ================= */
  const handleDelete = async (id) => {
    const confirmDelete = confirm(
      "Are you sure you want to delete this developer?"
    );
    if (!confirmDelete) return;

    try {
      await deleteDeveloper(id);
      alert("Developer deleted successfully");
    } catch (err) {
      alert(err.message || "Delete failed");
    }
  };

  if (isLoading)
    return (
      <main className="p-6">
        <p className="text-sm text-gray-500">Loading developers...</p>
      </main>
    );

  if (error)
    return (
      <main className="p-6">
        <p className="text-red-500">{error}</p>
      </main>
    );

  return (
    <main className="p-6 space-y-6">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold">Developers</h1>

        <Link href="/admin/developers/form">
          <Button className="bg-[#DBA40D] text-black">
            Add Developer
          </Button>
        </Link>
      </div>

      {/* EMPTY STATE */}
      {data?.length === 0 && (
        <div className="text-center text-gray-500 py-10">
          No developers found
        </div>
      )}

      {/* GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {data?.map((dev) => {
          const logoSrc =
            dev?.logo?.url && dev.logo.url !== ""
              ? dev.logo.url
              : "/placeholder.png";

          return (
            <div
              key={dev.id}
              className="bg-white rounded-xl shadow hover:shadow-md transition p-4 flex flex-col gap-3"
            >
              {/* LOGO */}
              <div className="relative w-20 h-20 mx-auto border rounded-lg overflow-hidden">
                <Image
                  src={logoSrc}
                  alt={dev.title || "Developer"}
                  fill
                  sizes="80px"
                  className="object-contain"
                />
              </div>

              {/* TITLE */}
              <h3 className="text-center font-semibold">
                {dev.title}
              </h3>

              {/* PROJECT COUNT */}
              <p className="text-center text-sm text-gray-500">
                {dev.totalProjects || 0} Projects
              </p>

              {/* STATUS BADGE */}
              <span
                className={`text-xs text-center px-2 py-1 rounded-full ${
                  dev.isActive
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-100 text-gray-500"
                }`}
              >
                {dev.isActive ? "Active" : "Inactive"}
              </span>

              {/* ACTION BUTTONS */}
              <div className="flex justify-between mt-2">
                {/* EDIT LEFT */}
                <Button
                  isIconOnly
                  size="sm"
                  className="bg-[#DBA40D]"
                  onClick={() =>
                    router.push(`/admin/developers/form?id=${dev.id}`)
                  }
                >
                  <Edit2 size={14} />
                </Button>

                {/* DELETE RIGHT */}
                <Button
                  isIconOnly
                  size="sm"
                  className="bg-red-500 text-white"
                  onClick={() => handleDelete(dev.id)}
                >
                  <Trash2 size={14} />
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
}
