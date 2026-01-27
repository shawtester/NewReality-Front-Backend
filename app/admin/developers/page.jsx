"use client";

import { useDevelopers } from "@/lib/firestore/developers/read";
import { Button } from "@nextui-org/react";
import { Edit2 } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

export default function Page() {
  const { data, isLoading, error } = useDevelopers();
  const router = useRouter();

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <main className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold">Developers</h1>

        <Link href="/admin/developers/form">
          <Button className="bg-[#DBA40D]" >Add Developer</Button>
        </Link>
      </div>

      {data?.length === 0 && (
        <p className="text-gray-500">No developers found</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {data?.map((dev) => (
          <div
            key={dev.id}
            className="bg-white rounded-xl shadow p-4 flex flex-col gap-3"
          >
            {/* LOGO */}
            <div className="relative w-20 h-20 mx-auto">
              <Image
                src={dev.logo?.url || "/placeholder.png"}
                alt={dev.title}
                fill
                className="object-contain"
              />
            </div>

            {/* TITLE */}
            <h3 className="text-center font-semibold">
              {dev.title}
            </h3>

            {/* PROJECT COUNT */}
            <p className="text-center text-sm text-gray-500">
              {dev.totalProjects} Projects
            </p>

            {/* STATUS */}
            <span className="text-xs text-center">
              {dev.isActive ? "Active" : "Inactive"}
            </span>

            {/* EDIT BUTTON */}
            <Button
              isIconOnly
              size="sm"
              onClick={() =>
                router.push(`/admin/developers/form?id=${dev.id}`)
              }
              className="self-end bg-[#DBA40D]"
            >
              <Edit2 size={14} />
            </Button>
          </div>
        ))}
      </div>
    </main>
  );
}
