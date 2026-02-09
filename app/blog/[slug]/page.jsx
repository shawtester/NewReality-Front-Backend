"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  doc,
  getDoc,
  collection,
  getDocs,
  query,
  orderBy,
  limit,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";

export default function BlogDetailPage({ params }) {
  const blogId = params.slug;

  const [blog, setBlog] = useState(null);
  const [latestBlogs, setLatestBlogs] = useState([]);
  const [tocItems, setTocItems] = useState([]);
  const [activeId, setActiveId] = useState("");
  const [openFaq, setOpenFaq] = useState(null);

  // ✅ ONLY for mobile TOC
  const [isTocOpen, setIsTocOpen] = useState(false);

  /* ================= FETCH CURRENT BLOG ================= */
  useEffect(() => {
    const fetchBlog = async () => {
      const ref = doc(db, "blogs", blogId);
      const snap = await getDoc(ref);
      if (snap.exists()) setBlog(snap.data());
    };
    fetchBlog();
  }, [blogId]);

  /* ================= FETCH LATEST BLOGS ================= */
  useEffect(() => {
    const fetchLatestBlogs = async () => {
      const q = query(
        collection(db, "blogs"),
        orderBy("timestampCreate", "desc"),
        limit(6)
      );

      const snap = await getDocs(q);
      const list = snap.docs
        .map((d) => ({ id: d.id, ...d.data() }))
        .filter((b) => b.id !== blogId)
        .slice(0, 5);

      setLatestBlogs(list);
    };

    fetchLatestBlogs();
  }, [blogId]);

  /* ================= BUILD TOC ================= */
  useEffect(() => {
    if (!blog) return;

    const timer = setTimeout(() => {
      const bolds = document.querySelectorAll(
        ".blog-content strong, .blog-content b"
      );

      const items = [];

      bolds.forEach((el, index) => {
        const text = el.innerText.trim();
        if (text.length < 2) return;

        const id = `toc-${index}`;
        el.id = id;

        items.push({
          id,
          label: text,
          top: el.offsetTop,
        });
      });

      setTocItems(items);
      if (items.length) setActiveId(items[0].id);
    }, 500);

    return () => clearTimeout(timer);
  }, [blog]);

  /* ================= SCROLL TRACK ================= */
  useEffect(() => {
    if (!tocItems.length) return;

    const onScroll = () => {
      const scrollPos = window.scrollY + 150;
      let current = tocItems[0]?.id;

      for (let i = 0; i < tocItems.length; i++) {
        if (scrollPos >= tocItems[i].top) {
          current = tocItems[i].id;
        }
      }

      setActiveId(current);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => window.removeEventListener("scroll", onScroll);
  }, [tocItems]);

  const scrollToHeading = (id) => {
    const el = document.getElementById(id);
    if (!el) return;

    const offset = 110;
    const pos = el.getBoundingClientRect().top + window.scrollY;

    window.scrollTo({
      top: pos - offset,
      behavior: "smooth",
    });
  };

  if (!blog) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  const imageSrc = blog.image?.url || blog.image || null;

  return (
    <>
      <Header />

      <main className="bg-[#f6f6f6] w-full">
        <div className="max-w-[1400px] mx-auto px-4 md:px-6 lg:px-10 xl:px-12">

          {/* BREADCRUMB */}
          <div className="py-4 text-sm text-gray-500">
            Home / Blog /{" "}
            <span className="text-gray-900 font-medium">
              {blog.mainTitle}
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[4fr_1fr] gap-8 lg:gap-10">

            {/* LEFT CONTENT */}
            <div className="space-y-6 max-w-full lg:max-w-[900px] xl:max-w-[1080px]">
              <h1 className="text-xl md:text-2xl lg:text-[26px] xl:text-3xl font-semibold">
                {blog.detailHeading || blog.mainTitle}
              </h1>

              <p className="text-sm text-gray-500 relative bottom-2">
                {blog.excerpt || "No excerpt available"}
              </p>

              {imageSrc && (
                <div className="relative w-full aspect-[16/7] rounded-xl overflow-hidden">
                  <Image
                    src={imageSrc}
                    alt={blog.mainTitle}
                    fill
                    priority
                    className="object-cover"
                  />
                </div>
              )}

              {/* ================= MOBILE / TAB TOC (NEW) ================= */}
              {tocItems.length > 0 && (
                <div className="lg:hidden bg-white rounded-xl p-4 shadow-sm">
                  <button
                    onClick={() => setIsTocOpen(!isTocOpen)}
                    className="w-full flex justify-between items-center font-semibold text-sm"
                  >
                    Table of Contents
                    <span className="text-lg">
                      {isTocOpen ? "−" : "+"}
                    </span>
                  </button>

                  {isTocOpen && (
                    <ul className="mt-4 space-y-2">
                      {tocItems.map((item) => (
                        <li key={item.id}>
                          <button
                            onClick={() => {
                              scrollToHeading(item.id);
                              setIsTocOpen(false);
                            }}
                            className={`w-full text-left pl-3 py-1 border-l-2 text-sm ${
                              activeId === item.id
                                ? "border-[#8B2C6F] text-[#D4A017] font-semibold"
                                : "border-transparent text-gray-500"
                            }`}
                          >
                            {item.label}
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}

              {/* BLOG SECTIONS */}
              {blog.sections?.map((html, i) => (
                <section
                  key={i}
                  className="bg-white rounded-xl p-6 lg:p-7 xl:p-8 shadow-sm"
                >
                  <div
                    className="blog-content text-gray-700 leading-[1.9] text-[15px]"
                    dangerouslySetInnerHTML={{ __html: html }}
                  />
                </section>
              ))}

              {/* FAQ */}
              {blog.faqs?.length > 0 && (
                <section className="bg-white rounded-xl p-6 lg:p-7 xl:p-8 shadow-sm relative bottom-4">
                  <h2 className="text-xl font-semibold mb-6">
                    Frequently Asked Questions
                  </h2>

                  <div className="space-y-4">
                    {blog.faqs.map((faq, i) => (
                      <div key={i} className="border rounded-lg">
                        <button
                          onClick={() =>
                            setOpenFaq(openFaq === i ? null : i)
                          }
                          className="w-full flex justify-between items-center p-4 text-left font-medium"
                        >
                          <span>{faq.question}</span>
                          <span className="text-xl">
                            {openFaq === i ? "−" : "+"}
                          </span>
                        </button>

                        {openFaq === i && (
                          <div className="px-4 pb-4 text-gray-600 text-sm">
                            {faq.answer}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* ================= MOBILE / TAB LATEST BLOGS (NEW) ================= */}
              {latestBlogs.length > 0 && (
                <section className="lg:hidden bg-white rounded-xl p-5 shadow-sm">
                  <h3 className="font-semibold mb-4">Latest Blogs</h3>

                  <ul className="space-y-4">
                    {latestBlogs.map((item) => (
                      <li key={item.id} className="flex gap-3">
                        <Image
                          src={
                            item.image?.url ||
                            item.image ||
                            "/images/placeholder.jpg"
                          }
                          alt={item.mainTitle}
                          width={44}
                          height={44}
                          className="rounded-full object-cover"
                        />
                        <div>
                          <p className="text-sm font-medium line-clamp-2">
                            {item.mainTitle}
                          </p>
                          <Link
                            href={`/blog/${item.id}`}
                            className="text-xs text-[#993F7F] font-semibold"
                          >
                            Read More
                          </Link>
                        </div>
                      </li>
                    ))}
                  </ul>

                  <div className="flex justify-center mt-4">
                    <Link
                      href="/blog"
                      className="bg-[#DBA40D] text-white px-4 py-2 rounded-lg text-sm font-semibold"
                    >
                      View more
                    </Link>
                  </div>
                </section>
              )}
            </div>

            {/* ================= DESKTOP SIDEBAR (UNCHANGED) ================= */}
           <aside className="hidden lg:block justify-self-end">
  <div
    className="
      sticky
      lg:top-[110px]
      xl:top-[120px]
      mt-[130px]
      xl:mt-[150px]
      space-y-8
    "
  >

    {/* ===== TOC ===== */}
    {tocItems.length > 0 && (
      <div
        className="
          bg-white rounded-xl p-6 shadow-sm
          w-[300px] lg:w-[320px] xl:w-[340px] xl:relative xl:bottom-10

          
          lg:max-h-[280px]
          xl:max-h-[360px]
          2xl:max-h-[420px]
        "
      >
        <h3 className="text-lg font-semibold mb-4">
          Table of Contents
        </h3>

        <ul className="space-y-2">
          {tocItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => scrollToHeading(item.id)}
                className={`w-full text-left pl-4 py-1 border-l-2 text-sm transition ${
                  activeId === item.id
                    ? "border-[#8B2C6F] text-[#D4A017] font-semibold"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      </div>
    )}

    {/* ===== LATEST BLOGS ===== */}
    <section
      className="
        bg-white rounded-lg px-4 relative bottom-4 py-4 shadow-sm
        w-[300px] lg:w-[320px] xl:w-[340px]
      "
    >
      <h3 className="font-semibold mb-3">Latest Blogs</h3>

      <ul className="space-y-4">
        {latestBlogs.map((item) => (
          <li key={item.id} className="flex gap-3">
            <Image
              src={
                item.image?.url ||
                item.image ||
                "/images/placeholder.jpg"
              }
              alt={item.mainTitle}
              width={44}
              height={44}
              className="rounded-full object-cover"
            />
            <div>
              <p className="text-sm font-medium line-clamp-2">
                {item.mainTitle}
              </p>
              <Link
                href={`/blog/${item.id}`}
                className="text-xs text-[#993F7F] font-semibold"
              >
                Read More
              </Link>
            </div>
          </li>
        ))}
      </ul>

      <div className="flex justify-center mt-4">
        <Link
          href="/blog"
          className="bg-[#DBA40D] text-white px-4 py-2 rounded-lg text-sm font-semibold"
        >
          View more
        </Link>
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
