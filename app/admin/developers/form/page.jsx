"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@nextui-org/react";
import toast from "react-hot-toast";
import Image from "next/image";
import { uploadToCloudinary } from "@/lib/cloudinary/uploadDevloperLogo";

import {
  createDeveloper,
  updateDeveloper,
} from "@/lib/firestore/developers/write";
import { useDeveloper } from "@/lib/firestore/developers/read";

export default function Page() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const { data: devData, isLoading } = useDeveloper({ id });

  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [data, setData] = useState({
    title: "",
    totalProjects: "",
    isActive: true,
    logo: { url: "" },
  });

  /* ================= EDIT MODE ================= */
  useEffect(() => {
    if (devData) {
      setData({
        title: devData.title || "",
        totalProjects: devData.totalProjects || "",
        isActive: devData.isActive ?? true,
        logo: devData.logo || { url: "" },
      });
    }
  }, [devData]);

  const handleChange = (key, value) => {
    setData((prev) => ({ ...prev, [key]: value }));
  };

  /* ================= LOGO UPLOAD ================= */
  const handleLogoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setUploading(true);

      const res = await uploadToCloudinary(file);

      // ⭐⭐⭐ MOST IMPORTANT FIX ⭐⭐⭐
      setData((prev) => ({
        ...prev,
        logo: {
          url: res.secure_url,
          publicId: res.public_id,
        },
      }));

      toast.success("Logo uploaded");
    } catch (err) {
      console.error(err);
      toast.error("Logo upload failed");
    }

    setUploading(false);
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (!data.title) throw new Error("Developer name required");
      if (!data.totalProjects) throw new Error("Total projects required");
      if (uploading) throw new Error("Logo is uploading...");
      if (!data.logo?.url) throw new Error("Developer logo required");

      setLoading(true);

      const payload = {
        title: data.title,
        totalProjects: Number(data.totalProjects),
        isActive: data.isActive,
        logo: data.logo,
      };

      if (id) {
        await updateDeveloper({ id, data: payload });
        toast.success("Developer updated");
      } else {
        await createDeveloper({ data: payload });
        toast.success("Developer created");
      }

      router.push("/admin/developers");
    } catch (err) {
      toast.error(err.message);
    }

    setLoading(false);
  };

  if (id && isLoading) return <p className="p-6">Loading...</p>;

  return (
    <form onSubmit={handleSubmit} className="p-6 max-w-xl space-y-5">
      <h1 className="text-xl font-semibold">
        {id ? "Update Developer" : "Add Developer"}
      </h1>

      {/* Developer Name */}
      <div>
        <label className="text-sm">Developer Name</label>
        <input
          className="w-full border px-3 py-2 rounded"
          value={data.title}
          onChange={(e) => handleChange("title", e.target.value)}
        />
      </div>

      {/* Total Projects */}
      <div>
        <label className="text-sm">Total Projects</label>
        <input
          type="number"
          className="w-full border px-3 py-2 rounded"
          value={data.totalProjects}
          onChange={(e) =>
            handleChange("totalProjects", e.target.value)
          }
        />
      </div>

      {/* ================= LOGO UPLOAD ================= */}
      <div className="space-y-2">
        <label className="text-sm">Developer Logo</label>

        {data.logo?.url && (
          <div className="relative w-24 h-24 border rounded">
            <Image
              src={data.logo.url}
              alt="Developer Logo"
              fill
              className="object-contain"
            />
          </div>
        )}

        <input
          type="file"
          accept="image/*"
          onChange={handleLogoUpload}
        />

        {uploading && (
          <p className="text-xs text-gray-500">
            Uploading logo...
          </p>
        )}
      </div>

      {/* Active */}
      <label className="flex gap-2 items-center text-sm">
        <input
          type="checkbox"
          checked={data.isActive}
          onChange={(e) =>
            handleChange("isActive", e.target.checked)
          }
        />
        Active
      </label>

      {/* Submit */}
      <Button
        className="bg-[#DBA40D]"
        type="submit"
        isLoading={loading}
        isDisabled={uploading}
      >
        {uploading
          ? "Uploading Logo..."
          : id
          ? "Update Developer"
          : "Save Developer"}
      </Button>
    </form>
  );
}
