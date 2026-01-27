"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import toast from "react-hot-toast";
import { Button } from "@nextui-org/react";

import { uploadToCloudinary } from "@/lib/cloudinary/uploadImage";
import { getHero } from "@/lib/firestore/hero/read";
import { updateHero } from "@/lib/firestore/hero/write";

export default function HeroAdminPage() {
  const [data, setData] = useState({
    image: null,
    videoUrl: "",
  });

  const [loading, setLoading] = useState(false);
  const [imgLoading, setImgLoading] = useState(false);

  /* FETCH EXISTING */
  useEffect(() => {
    const fetch = async () => {
      const res = await getHero();
      if (res) setData(res);
    };
    fetch();
  }, []);

  /* IMAGE UPLOAD */
  const handleImage = async (file) => {
    if (!file) return;
    setImgLoading(true);
    try {
      const res = await uploadToCloudinary(file);
      setData((p) => ({ ...p, image: res }));
      toast.success("Hero image updated");
    } catch (e) {
      toast.error(e.message);
    }
    setImgLoading(false);
  };

  /* SUBMIT */
  const submit = async () => {
    setLoading(true);
    try {
      await updateHero({ data });
      toast.success("Hero section updated");
    } catch (e) {
      toast.error(e.message);
    }
    setLoading(false);
  };

  return (
    <div className="p-6 max-w-xl space-y-4">
      <h1 className="text-xl font-semibold">Hero Section</h1>

      {/* IMAGE */}
      <div>
        <label className="text-sm">Hero Background Image</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => handleImage(e.target.files[0])}
        />

        {imgLoading && <p className="text-xs">Uploading…</p>}

        {data.image?.url && (
          <div className="relative mt-3 w-full h-40 rounded overflow-hidden">
            <Image
              src={data.image.url}
              alt="Hero"
              fill
              className="object-cover"
            />
          </div>
        )}
      </div>

      {/* VIDEO */}
      <div>
        <label className="text-sm">YouTube Embed URL</label>
        <input
          value={data.videoUrl}
          onChange={(e) =>
            setData((p) => ({ ...p, videoUrl: e.target.value }))
          }
          placeholder="https://www.youtube.com/embed/xxxx"
          className="border p-2 w-full rounded"
        />
      </div>

      <Button className="bg-[#DBA40D]" isLoading={loading} onClick={submit}>
        Update Hero
      </Button>
    </div>
  );
}
