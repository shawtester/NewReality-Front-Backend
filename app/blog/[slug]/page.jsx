"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";

export default function BlogDetailPage({ params }) {
  const blogId = params.slug;

  const [blog, setBlog] = useState(null);
  const [activeId, setActiveId] = useState("");
  /* ================= RECENT BLOGS ================= */
  const recentBlogs = [
    {
      title: "IGRSUP 2025: Complete Guide to Online Property Registration in UP",
      logo: "/images/blogsection/logo1.png",
    },
    {
      title: "20 Simple False Ceiling Design for Hall",
      logo: "/images/blogsection/logo2.png",
    },
    {
      title: "Top Citizenship by Investment Agents in 2026",
      logo: "/images/blogsection/logo3.jpg",
    },
    {
      title: "Managing AR and AP in Real Estate Projects for Better Cash Flow",
      logo: "/images/blogsection/logo4.jpg",
    },
    {
      title: "Top 15 Posh Areas in Delhi NCR (2025)",
      logo: "/images/blogsection/logo5.png",
    },
  ];
  /* ================= FETCH BLOG ================= */
  useEffect(() => {
    const fetchBlog = async () => {
      const ref = doc(db, "blogs", blogId);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        setBlog(snap.data());
        setActiveId("section-0");
      }
    };
    fetchBlog();
  }, [blogId]);

  /* ================= TOC ================= */
  const tocItems =
    blog?.sections?.map((sec, i) => ({
      id: `section-${i}`,
      label: sec.heading,
    })) || [];

  /* ================= OBSERVER ================= */
  useEffect(() => {
    if (!tocItems.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: "-120px 0px -60% 0px" }
    );

    tocItems.forEach((item) => {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [tocItems]);

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (!el) return;
    const y = el.getBoundingClientRect().top + window.scrollY - 120;
    window.scrollTo({ top: y, behavior: "smooth" });
  };

  if (!blog) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <>
      {/* HEADER */}
      <Header />

      <main className="bg-[#f6f6f6] w-full">
        <div className="max-w-[1400px] mx-auto px-10">

          {/* BREADCRUMB */}
          <div className="py-4 text-sm text-gray-500">
            Home / Blog /{" "}
            <span className="text-gray-900 font-medium">{blog.title}</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[4fr_1fr] gap-10">

            {/* ================= LEFT CONTENT ================= */}
            <div className="space-y-12 max-w-[1080px]">

              <h1 className="text-2xl md:text-3xl font-semibold">
                {blog.title}
              </h1>

              <p className="text-sm text-gray-500">
                By <span className="text-blue-700">Silky Malhotra</span> • Nov 12, 2025
              </p>

              {blog.image && (
                <div className="relative w-full aspect-[16/7] rounded-xl overflow-hidden">
                  <Image
                    src={blog.image}
                    alt={blog.title}
                    fill
                    priority
                    className="object-cover"
                  />
                </div>
              )}

              {/* BLOG SECTIONS */}
              {blog.sections.map((sec, i) => (
                <section
                  key={i}
                  id={`section-${i}`}
                  className="bg-white rounded-xl p-8 shadow-sm space-y-6"
                >
                  <div className="flex gap-4 items-start">
                    <span className="w-[4px] bg-[#8B2C6F] rounded mt-1"></span>
                    <h2 className="text-xl font-semibold">
                      {sec.heading}
                    </h2>
                  </div>

                  <p className="text-gray-700 leading-[1.9] text-[15px]">
                    {sec.description}
                  </p>
                </section>
              ))}

              {/* ================= FAQ SECTION ================= */}
              {blog.faqs?.length > 0 && (
                <section className="bg-white rounded-xl p-8 shadow-sm">
                  <h2 className="text-xl font-semibold mb-6">
                    Frequently Asked Questions
                  </h2>

                  <div className="space-y-3">
                    {blog.faqs.map((faq, i) => (
                      <details
                        key={i}
                        className="group border rounded-lg p-4"
                      >
                        <summary className="cursor-pointer font-medium flex justify-between items-center">
                          {faq.question}
                          <span className="transition-transform group-open:rotate-180">
                            ▾
                          </span>
                        </summary>

                        <p className="mt-3 text-sm text-gray-600 leading-relaxed">
                          {faq.answer}
                        </p>
                      </details>
                    ))}
                  </div>
                </section>
              )}

            </div>
             {/* ================= Right Sidebar ================= */}
            <aside className="hidden lg:block relative justify-self-end">
              <div className="sticky top-[110px] mt-[150px]">

                <div className="bg-white rounded-xl p-6 shadow-sm w-[350px]">
                  <h3 className="text-lg font-semibold mb-4">
                    Table of Contents
                  </h3>

                  <ul className="space-y-1">
                    {tocItems.map((item) => (
                      <li key={item.id}>
                        <button
                          onClick={() => scrollToSection(item.id)}
                          className={`w-full text-left pl-4 py-1 border-l-2 text-[14px] ${activeId === item.id
                              ? "border-[#8B2C6F] text-[#D4A017] font-medium"
                              : "border-transparent text-gray-500 hover:text-gray-800"
                            }`}
                        >
                          {item.label}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>

                <section className="bg-white rounded-lg px-[15px] py-[12px] mt-6">
                  <h3 className="font-semibold mb-2">Latest Blogs</h3>
                  <p className="text-xs text-gray-400 mb-4">
                    Updates from around the world
                  </p>

                  <ul className="space-y-4">
                    {recentBlogs.map((item, index) => (
                      <li key={index} className="flex gap-3">
                        <Image
                          src={item.logo}
                          alt=""
                          width={44}
                          height={44}
                          className="rounded-full object-cover"
                        />
                        <div>
                          <p className="text-sm font-medium">
                            {item.title}
                          </p>
                          <button className="text-xs text-[#993F7F] font-semibold">
                            Read More
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>

                  <div className="flex justify-center mt-4">
                    <button className="bg-[#DBA40D] text-white px-4 py-2 rounded-lg text-sm font-semibold">
                      View more
                    </button>
                  </div>
                </section>

              </div>
            </aside>

          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
