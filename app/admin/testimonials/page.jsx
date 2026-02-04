"use client";

import { useEffect, useState } from "react";
import {
  addTestimonial,
  updateTestimonial,
  deleteTestimonial,
} from "@/lib/firestore/testimonials/write";
import { uploadToCloudinary } from "@/lib/cloudinary/uploadImage";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function AdminTestimonialsPage() {
  const [testimonials, setTestimonials] = useState([]);
  const [file, setFile] = useState(null);

  const [form, setForm] = useState({
    id: null,
    name: "",
    role: "",
    quote: "",
    avatar: "",
    rating: 5,
  });

  /* ================= LOAD ================= */
  const loadTestimonials = async () => {
    const snap = await getDocs(collection(db, "testimonials"));
    setTestimonials(
      snap.docs.map((d) => ({ id: d.id, ...d.data() }))
    );
  };

  useEffect(() => {
    loadTestimonials();
  }, []);

  /* ================= ADD / UPDATE ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    let avatarUrl = form.avatar || "";

    // ✅ CORRECT CLOUDINARY USAGE
    if (file) {
      avatarUrl = await uploadToCloudinary(file); // 🔥 STRING
    }

    const payload = {
      name: form.name,
      role: form.role,
      quote: form.quote,
      avatar: avatarUrl, // ✅ STRING URL
      rating: form.rating ?? 5,
    };

    if (form.id) {
      await updateTestimonial(form.id, payload);
    } else {
      await addTestimonial(payload);
    }

    // RESET
    setForm({
      id: null,
      name: "",
      role: "",
      quote: "",
      avatar: "",
      rating: 5,
    });
    setFile(null);

    loadTestimonials();
  };

  /* ================= EDIT ================= */
  const handleEdit = (item) => {
    setForm({
      id: item.id,
      name: item.name || "",
      role: item.role || "",
      quote: item.quote || "",
      avatar: item.avatar || "",
      rating: item.rating ?? 5,
    });
    setFile(null);
  };

  /* ================= DELETE ================= */
  const handleDelete = async (id) => {
    if (confirm("Delete this testimonial?")) {
      await deleteTestimonial(id);
      loadTestimonials();
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-2xl font-semibold mb-6">
        Testimonials Admin
      </h1>

      {/* FORM */}
      <form onSubmit={handleSubmit} className="space-y-4 mb-10">
        <input
          placeholder="Name"
          value={form.name}
          onChange={(e) =>
            setForm({ ...form, name: e.target.value })
          }
          className="w-full border p-2"
          required
        />

        <input
          placeholder="Role"
          value={form.role}
          onChange={(e) =>
            setForm({ ...form, role: e.target.value })
          }
          className="w-full border p-2"
          required
        />

        <input
          placeholder="Quote"
          value={form.quote}
          onChange={(e) =>
            setForm({ ...form, quote: e.target.value })
          }
          className="w-full border p-2"
          required
        />

        {/* ⭐ RATING */}
        <select
          value={form.rating}
          onChange={(e) =>
            setForm({
              ...form,
              rating: Number(e.target.value),
            })
          }
          className="w-full border p-2"
        >
          {[5, 4, 3, 2, 1].map((r) => (
            <option key={r} value={r}>
              {r} Star{r > 1 && "s"}
            </option>
          ))}
        </select>

        {/* IMAGE */}
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files[0])}
        />

        <button className="bg-[#DBA40D] text-white px-6 py-2 rounded">
          {form.id ? "Update" : "Add"} Testimonial
        </button>
      </form>

      {/* LIST */}
      <div className="space-y-4">
        {testimonials.map((t) => (
          <div
            key={t.id}
            className="border p-4 flex justify-between items-center"
          >
            <div>
              <p className="font-semibold">{t.name}</p>
              <p className="text-sm text-gray-500">{t.role}</p>
              <p className="text-sm">⭐ {t.rating ?? 5}</p>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => handleEdit(t)}
                className="text-blue-600"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(t.id)}
                className="text-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}