"use client";

import { uploadToCloudinary } from "@/lib/cloudinary/uploadImage";
import {
  createBlog,
  updateBlog,
} from "@/lib/firestore/blogs/write";
import { getBlogById } from "@/lib/firestore/blogs/read";
import { Button } from "@nextui-org/react";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function BlogForm() {
  const [data, setData] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    image: null,
    faqs: [{ question: "", answer: "" }],
  });

  const [loading, setLoading] = useState(false);
  const [imgLoading, setImgLoading] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const addFaq = () =>
    setData(p => ({ ...p, faqs: [...p.faqs, { question: "", answer: "" }] }));

  const updateFaq = (i, key, value) => {
    const faqs = [...data.faqs];
    faqs[i][key] = value;
    setData({ ...data, faqs });
  };

  const removeFaq = (i) => {
    const faqs = data.faqs.filter((_, idx) => idx !== i);
    setData({ ...data, faqs });
  };


  /* ================= FETCH OLD DATA ================= */
  useEffect(() => {
    if (!id) return;

    const fetch = async () => {
      try {
        const res = await getBlogById({ id });
        if (!res) return toast.error("Blog not found");
        setData(res); // ✅ PREFILL
      } catch (e) {
        toast.error(e.message);
      }
    };

    fetch();
  }, [id]);

  /* ================= IMAGE UPLOAD ================= */
  const handleImage = async (file) => {
    if (!file) return;
    setImgLoading(true);
    try {
      const res = await uploadToCloudinary(file);
      setData((p) => ({ ...p, image: res }));
      toast.success("Image uploaded");
    } catch (e) {
      toast.error(e.message);
    }
    setImgLoading(false);
  };

  /* ================= SUBMIT ================= */
  const submit = async () => {
    if (!data.title) return toast.error("Title required");

    setLoading(true);
    try {
      id
        ? await updateBlog({ data: { ...data, id } })
        : await createBlog({ data });

      toast.success(id ? "Blog updated" : "Blog created");
      router.push("/admin/blog");
    } catch (e) {
      toast.error(e.message);
    }
    setLoading(false);
  };

  return (
    <div className="p-5 max-w-xl">
      <h1 className="text-lg font-semibold mb-4">
        {id ? "Update Blog" : "Create Blog"}
      </h1>

      {/* TITLE */}
      <input
        value={data.title}
        onChange={(e) =>
          setData({ ...data, title: e.target.value })
        }
        placeholder="Title"
        className="border p-2 w-full mb-3"
      />

      {/* SLUG */}
      <input
        value={data.slug}
        onChange={(e) =>
          setData({ ...data, slug: e.target.value })
        }
        placeholder="Slug"
        className="border p-2 w-full mb-3"
      />

      {/* EXCERPT */}
      <textarea
        value={data.excerpt}
        onChange={(e) =>
          setData({ ...data, excerpt: e.target.value })
        }
        placeholder="Excerpt"
        className="border p-2 w-full mb-3"
      />

      {/* CONTENT */}
      <textarea
        value={data.content}
        onChange={(e) =>
          setData({ ...data, content: e.target.value })
        }
        rows={6}
        placeholder="Content"
        className="border p-2 w-full mb-3"
      />

      {/* IMAGE */}
      <input
        type="file"
        accept="image/*"
        onChange={(e) => handleImage(e.target.files[0])}
      />

      {imgLoading && <p className="text-xs mt-1">Uploading...</p>}

      {data.image?.url && (
        <img
          src={data.image.url}
          className="h-32 mt-3 rounded border"
        />
      )}

      <h3 className="font-semibold mt-5">FAQs</h3>

      {data.faqs.map((faq, i) => (
        <div key={i} className="border p-2 mb-2">
          <input
            placeholder="Question"
            value={faq.question}
            onChange={e => updateFaq(i, "question", e.target.value)}
            className="border p-2 w-full mb-2"
          />
          <textarea
            placeholder="Answer"
            value={faq.answer}
            onChange={e => updateFaq(i, "answer", e.target.value)}
            className="border p-2 w-full"
          />
          <button
            onClick={() => removeFaq(i)}
            className="text-red-500 text-xs mt-1"
          >
            Remove
          </button>
        </div>
      ))}

      <button onClick={addFaq} className="text-sm text-blue-600">
        + Add FAQ
      </button>


      <Button
        isLoading={loading}
        className="mt-5"
        onClick={submit}
      >
        {id ? "Update Blog" : "Create Blog"}
      </Button>
    </div>
  );
}
