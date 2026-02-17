"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, useRef } from "react";
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
    if (!blog) return;

    const timeout = setTimeout(() => {
      const wrapper = document.getElementById("blog-wrapper");
      if (!wrapper) return;

      const headings = wrapper.querySelectorAll("h2, h3");

      const items = [];

      headings.forEach((el, index) => {
        const id = `section-${index + 1}`;
        el.id = id;

        items.push({
          id,
          label: el.innerText.trim(),
          level: el.tagName.toLowerCase(),
        });
      });

      setTocItems(items);

      if (items.length) {
        setActiveId(items[0].id);
      }
    }, 100); // 👈 small delay ensures DOM ready

    return () => clearTimeout(timeout);

  }, [blog]);


  // SCROLL SPY

  useEffect(() => {
    if (!tocItems.length) return;

    const handleScroll = () => {
      const headerHeight =
        document.querySelector("header")?.offsetHeight || 0;

      const scrollPosition = window.scrollY + headerHeight + 50;

      let current = tocItems[0]?.id;

      tocItems.forEach((item) => {
        const el = document.getElementById(item.id);
        if (!el) return;

        if (scrollPosition >= el.offsetTop) {
          current = item.id;
        }
      });

      setActiveId(current);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [tocItems]);


  const scrollToHeading = (id) => {
    const el = document.getElementById(id);
    if (!el) return;

    const headerHeight =
      document.querySelector("header")?.offsetHeight || 0;

    window.scrollTo({
      top: el.offsetTop - headerHeight - 30,
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


    <main className="bg-[#f6f6f6] w-full">
      <div className="max-w-[1400px] mx-auto px-4 md:px-6 lg:px-10 xl:px-12">

        {/* BREADCRUMB */}
        <div className="py-4 text-sm text-gray-500 flex flex-wrap items-center gap-1">
          <Link href="/" className="hover:text-gray-700">
            Home
          </Link>

          <span>/</span>

          {blog.category && (
            <>
              <Link
                href={`/blog?category=${blog.category}`}
                className="hover:text-gray-700 capitalize"
              >
                {blog.category}
              </Link>
              <span>/</span>
            </>
          )}

          <span className="text-gray-900 font-medium capitalize">
            {blog.mainTitle}
          </span>
        </div>


        <div className="grid grid-cols-1 lg:grid-cols-[4fr_1fr] gap-8 lg:gap-10">

          {/* LEFT CONTENT */}
          <div className="space-y-6 max-w-full lg:max-w-[900px] xl:max-w-[1080px]">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold leading-snug">
              {blog.detailHeading || blog.mainTitle}
            </h1>

            <div className="flex flex-wrap items-center justify-between text-sm text-gray-500 mt-2">
              <div>
                By <span className="text-[#993F7F] font-medium">
                  {blog.author || "Admin"}
                </span>
                <span className="mx-2">•</span>
                {blog.date || "Nov 12, 2025"}
              </div>

              <button className="flex items-center gap-2 hover:text-gray-700">
                Share this story
              </button>
            </div>


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
                          className={`w-full text-left ${item.level === "h3" ? "pl-6" : "pl-3"
                            } py-1 border-l-2 text-sm ${activeId === item.id
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
            <div id="blog-wrapper">
              {blog.sections?.map((html, i) => (
                <section
                  key={i}
                  className="bg-white rounded-xl p-6 lg:p-7 xl:p-8 shadow-sm"
                >
                  <div
                    dangerouslySetInnerHTML={{ __html: html }}
                  />
                </section>
              ))}
            </div>



            {/* SOURCE (Only if exists) */}
            {blog.source && blog.source.trim() !== "" && (
              <div className="bg-white rounded-xl p-6 lg:p-7 xl:p-8 shadow-sm text-sm text-gray-600">
                <span className="font-semibold text-gray-800">Source:</span>{" "}
                {blog.source}
              </div>
            )}


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
                  className="bg-white rounded-xl p-6 shadow-sm w-[300px] lg:w-[320px] xl:w-[340px] h-fit"  >

                  <h3 className="text-lg font-semibold mb-4">
                    Table of Contents
                  </h3>

                  <ul className="space-y-2">
                    {tocItems.map((item) => (
                      <li key={item.id}>
                        <button
                          onClick={() => scrollToHeading(item.id)}
                          className={`w-full text-left ${item.level === "h3" ? "pl-8" : "pl-4"
                            } py-1 border-l-2 text-sm transition ${activeId === item.id
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


  );
}
