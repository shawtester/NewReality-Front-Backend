"use client";

import { useEffect, useState } from "react";
import {
  addTestimonial,
  updateTestimonial,
  deleteTestimonial,
} from "@/lib/firestore/testimonials/write";

// ✅ CORRECT IMPORT
import { uploadToCloudinary } from "@/lib/cloudinary/uploadImage";

import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function AdminTestimonialsPage() {
  const [testimonials, setTestimonials] = useState([]);
  const [form, setForm] = useState({
    id: null,
    name: "",
    role: "",
    quote: "",
    avatar: "",
  });
  const [file, setFile] = useState(null);

  // 🔄 LOAD ALL
  async function loadTestimonials() {
    const snap = await getDocs(collection(db, "testimonials"));
    setTestimonials(
      snap.docs.map((d) => ({ id: d.id, ...d.data() }))
    );
  }

  useEffect(() => {
    loadTestimonials();
  }, []);

  // ➕ ADD / ✏️ UPDATE
  async function handleSubmit(e) {
    e.preventDefault();

    let avatarUrl = form.avatar;

    // ✅ CLOUDINARY UPLOAD
    if (file) {
      const uploaded = await uploadToCloudinary(file);
      avatarUrl = uploaded.secure_url;
    }

    if (form.id) {
      // ✏️ UPDATE
      await updateTestimonial(form.id, {
        name: form.name,
        role: form.role,
        quote: form.quote,
        avatar: avatarUrl,
      });
    } else {
      // ➕ ADD
      await addTestimonial({
        name: form.name,
        role: form.role,
        quote: form.quote,
        avatar: avatarUrl,
      });
    }

    // ♻️ RESET
    setForm({ id: null, name: "", role: "", quote: "", avatar: "" });
    setFile(null);
    loadTestimonials();
  }

  function handleEdit(item) {
    setForm(item);
  }

  async function handleDelete(id) {
    if (confirm("Delete this testimonial?")) {
      await deleteTestimonial(id);
      loadTestimonials();
    }
  }

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

        <textarea
          placeholder="Quote"
          value={form.quote}
          onChange={(e) =>
            setForm({ ...form, quote: e.target.value })
          }
          className="w-full border p-2"
          required
        />

        {/* IMAGE CHOOSE */}
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
