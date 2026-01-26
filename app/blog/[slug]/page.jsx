"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

/* ================= STATIC BLOG DATA ================= */

const blogPost = {
  title: "20 Simple False Ceiling Design for Hall",
  author: "Silky Malhotra",
  date: "Nov 12, 2025",
  story: "Share this story",
  share: "/images/blogsection/blogimg2.png",
  heroImage: "/images/blogsection/blogimg1.png",
  heroAlt: "False ceiling design for hall",
  faqs: [
    {
      question: "Which is the most popular false ceiling design for hall?",
      answer:
        "Simple gypsum board ceilings with recessed lights or cove lighting are the most commonly used because they are cost-effective, easy to install, and suit both small and large halls.",
    },
    {
      question: "Is false ceiling good for a small hall?",
      answer:
        "Yes, as long as the design is not too heavy or layered. A single-level false ceiling with clean lines and minimal drop can make a small hall look more structured and well-lit.",
    },
    {
      question:
        "Which lighting works best with modern main hall fall ceiling design?",
      answer:
        "Recessed LED lights and cove lighting work best as they enhance depth without cluttering the ceiling.",
    },
  ],
};

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

const tocItems = [
  { id: "intro", label: "Introduction" },
  { id: "fall-ceiling-intro", label: "Minimalist Ceiling" },
  { id: "recessed", label: "Recessed Lights" },
  { id: "gypsum", label: "Gypsum Ceiling" },
  { id: "wooden", label: "Wooden Coffered Ceiling" },
  { id: "layered", label: "Layered Ceiling" },
  { id: "chandelier", label: "Ceiling with Chandelier" },
  { id: "pop", label: "POP Linear Ceiling" },
  { id: "glossy", label: "Glossy Ceiling" },
  { id: "light-shapes", label: "Creative Light Shapes" },
  { id: "wooden-pannel", label: "Wooden Panel Ceiling" },
  { id: "two-tone", label: "Two-Tone Ceiling" },
  { id: "pendant", label: "Pendant Lighting" },
  { id: "pop-border", label: "POP Border Ceiling" },
  { id: "cove-lightining", label: "Cove Lighting" },
  { id: "grey-white", label: "Grey & White Ceiling" },
  { id: "led-color", label: "LED Color Play" },
  { id: "zigzag", label: "Zig-Zag Ceiling" },
  { id: "conclusion", label: "Conclusion" },
];

/* ================= PAGE ================= */

export default function BlogDetailPage() {
  const blog = blogPost;
  const [activeId, setActiveId] = useState("intro");

  /* ================= INTERSECTION OBSERVER ================= */
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        rootMargin: "-140px 0px -60% 0px",
        threshold: 0,
      }
    );

    tocItems.forEach((item) => {
      const section = document.getElementById(item.id);
      if (section) observer.observe(section);
    });

    return () => observer.disconnect();
  }, []);

  /* ================= SCROLL ================= */
  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (!el) return;

    const y = el.getBoundingClientRect().top + window.scrollY - 140;

    window.scrollTo({
      top: y,
      behavior: "smooth",
    });
  };

  return (
    <main className="bg-[#f5f5f5] w-full">
      <div className="mx-auto max-w-7xl px-4">
        {/* ================= BREADCRUMB ================= */}
        <div className="max-w-[1240px] mx-auto px-4 py-2 text-sm text-gray-500">
          Home / Blog /{" "}
          <span className="text-gray-900 font-medium">{blog.title}</span>
        </div>

        {/* ================= CONTENT ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-[3fr_1fr] gap-4 px-4">

          {/* LEFT */}
          <div className="space-y-8">
            <h1 className="text-2xl md:text-3xl font-semibold">
              {blog.title}
            </h1>

            <div className="text-sm text-gray-500 flex gap-2">
              <span>
                By <span className="text-blue-700">{blog.author}</span>
              </span>
              <span>• {blog.date}</span>
            </div>

            <div className="relative w-full aspect-[16/7] rounded-lg overflow-hidden">
              <Image
                src={blog.heroImage}
                alt={blog.heroAlt}
                fill
                className="object-cover"
              />
            </div>

            {/* FAQ */}
            <section className="bg-white rounded-lg p-4 shadow-sm">
              <h3 className="font-semibold mb-3">FAQs</h3>
              {blog.faqs.map((faq, i) => (
                <details key={i} className="group py-2">
                  <summary className="flex cursor-pointer justify-between bg-gray-50 p-2 text-sm font-medium">
                    {faq.question}
                    <span className="group-open:rotate-180 transition-transform">
                      ▾
                    </span>
                  </summary>
                  <p className="mt-2 text-sm text-gray-600">
                    {faq.answer}
                  </p>
                </details>
              ))}
            </section>
          </div>

          {/* RIGHT */}
          <aside className="hidden lg:block">
            <div className="sticky top-[110px] bg-white rounded-lg p-5 shadow-sm">
              <h3 className="text-lg font-semibold mb-4">
                Table of Contents
              </h3>

              <ul className="space-y-2 text-sm">
                {tocItems.map((item) => (
                  <li key={item.id}>
                    <button
                      onClick={() => scrollToSection(item.id)}
                      className={`w-full text-left pl-3 border-l-2 ${
                        activeId === item.id
                          ? "border-[#993F7F] text-[#DBA40D] font-semibold"
                          : "border-transparent text-gray-600"
                      }`}
                    >
                      {item.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </aside>

        </div>
      </div>
    </main>
  );
}
