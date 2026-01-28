"use client";

import { useState } from "react";
import { Mail, MapPin, Phone } from "lucide-react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import toast from "react-hot-toast";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    message: "",
    type: "residential",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await addDoc(collection(db, "contacts"), {
        ...formData,
        source: "contact-page", // track page origin
        status: "new",
        createdAt: serverTimestamp(),
      });

      toast.success("Contact submitted successfully ✅");

      // Reset form
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        message: "",
        type: "residential",
      });
    } catch (err) {
      console.error("Failed to submit contact:", err);
      toast.error("Failed to submit contact ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="bg-white">
      {/* HEADER */}
      <section className="bg-[#F8FBFF] py-12 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-3xl font-bold">
            Contact <span className="text-[#DBA40D]">Us</span>
          </h1>
          <p className="mt-4 text-sm text-[#6D717F]">
            Looking for your dream home or a prime investment opportunity? Our experts are here to guide you with trusted advice and personalized solutions.
          </p>
        </div>
      </section>

      {/* MAIN CARD */}
      <section className="px-4 py-16">
        <div className="mx-auto max-w-5xl overflow-hidden rounded-2xl shadow-[0_18px_45px_rgba(0,0,0,0.06)] flex flex-col md:flex-row">
          {/* LEFT INFO */}
          <aside className="md:w-5/12 bg-[#D79D26] text-white px-8 py-12 flex flex-col justify-between">
            <div>
              <h2 className="text-2xl md:text-3xl font-semibold mb-4">Let’s get in touch</h2>
              <p className="text-sm text-white/90 mb-10">
                Fill out the form and our team will connect with you shortly. We’re happy to assist with residential, commercial, or investment-related queries.
              </p>
              <div className="space-y-6 text-sm">
                <div className="flex items-center gap-4">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full border border-white/60">
                    <Phone className="h-4 w-4" />
                  </span>
                  <span>+1 012 3456 789</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full border border-white/60">
                    <Mail className="h-4 w-4" />
                  </span>
                  <span>demo@gmail.com</span>
                </div>
                <div className="flex items-start gap-4">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full border border-white/60">
                    <MapPin className="h-4 w-4" />
                  </span>
                  <span>
                    132 Dartmouth Street Boston,
                    <br />
                    Massachusetts 02156 United States
                  </span>
                </div>
              </div>
            </div>
          </aside>

          {/* RIGHT FORM */}
          <section className="md:w-7/12 bg-white px-8 py-12">
            <div className="max-w-xl mx-auto space-y-10">
              {/* SELECT */}
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">
                  How can we help you with*
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="w-full border border-slate-300 text-sm text-slate-600 py-2 px-3 rounded-md focus:outline-none focus:border-[#DBA40D]"
                >
                  <option value="residential">Residential</option>
                  <option value="commercial">Commercial</option>
                </select>
              </div>

              {/* FORM */}
              <form className="space-y-8" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <label className="text-xs font-medium text-slate-700">First Name*</label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      className="w-full border-0 border-b border-slate-300 text-sm py-1 focus:outline-none focus:border-[#DBA40D]"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-slate-700">Last Name*</label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      className="w-full border-0 border-b border-slate-300 text-sm py-1 focus:outline-none focus:border-[#DBA40D]"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <label className="text-xs font-medium text-slate-700">Email*</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full border-0 border-b border-slate-300 text-sm py-1 focus:outline-none focus:border-[#DBA40D]"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-slate-700">Phone Number*</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full border-0 border-b border-slate-300 text-sm py-1 focus:outline-none focus:border-[#DBA40D]"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium text-slate-700">Message</label>
                  <textarea
                    name="message"
                    rows={3}
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full border-0 border-b border-slate-300 text-sm py-1 resize-none focus:outline-none focus:border-[#DBA40D]"
                  />
                </div>

                <div className="pt-4 flex justify-center">
                  <button
                    type="submit"
                    disabled={loading}
                    className="rounded-md bg-[#DBA40D] px-10 py-3 text-sm font-semibold text-white shadow-md hover:bg-[#c8950a] transition disabled:opacity-50"
                  >
                    {loading ? "Submitting..." : "Send Message"}
                  </button>
                </div>
              </form>
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}
