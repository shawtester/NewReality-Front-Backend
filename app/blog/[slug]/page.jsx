"use client";

import { useEffect, useState } from "react";
import { getBlogBySlug, getBlogsForHome } from "@/lib/firestore/blogs/read";

import BlogContent from "./components/BlogContent";
import BlogTOC from "./components/BlogTOC";
import BlogFAQ from "./components/BlogFAQ";

export default function BlogDetailPage({ params }) {
  const slug = params.slug;

  const [blog, setBlog] = useState(null);
  const [recentBlogs, setRecentBlogs] = useState([]);
  const [tocItems, setTocItems] = useState([]);
  const [activeId, setActiveId] = useState("");
  const [loading, setLoading] = useState(true);

  /* ================= FETCH BLOG ================= */
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);

        const blogData = await getBlogBySlug({ slug });

        if (!blogData) {
          setBlog(null);
          return;
        }

        setBlog(blogData);

        const allBlogs = await getBlogsForHome();
        const filtered = allBlogs
          .filter((b) => b.slug !== slug)
          .slice(0, 5);

        setRecentBlogs(filtered);
      } catch (error) {
        console.error("Blog fetch error:", error);
        setBlog(null);
      } finally {
        setLoading(false);
      }
    }

    if (slug) fetchData();
  }, [slug]);

  /* ================= BUILD TOC ================= */
  const handleHeadingsReady = (headings) => {
    if (!headings.length) return;

    const items = [];
    let currentH2 = null;

    headings.forEach((el, index) => {
      if (!el.id) {
        el.id = `section-${index + 1}`;
      }

      if (el.tagName === "H2") {
        currentH2 = {
          id: el.id,
          label: el.innerText,
          children: [],
        };
        items.push(currentH2);
      }

      if (el.tagName === "H3" && currentH2) {
        currentH2.children.push({
          id: el.id,
          label: el.innerText,
        });
      }
    });

    setTocItems(items);
  };

  /* ================= SCROLL SPY ================= */
  useEffect(() => {
    if (!blog) return;

    const handleScroll = () => {
      const headings = document.querySelectorAll(
        "#blog-wrapper h2, #blog-wrapper h3"
      );

      if (!headings.length) return;

      let currentId = "";

      headings.forEach((heading) => {
        const rect = heading.getBoundingClientRect();
        if (rect.top <= 150) {
          currentId = heading.id;
        }
      });

      if (currentId) {
        setActiveId(currentId);
      }
    };

    window.addEventListener("scroll", handleScroll);
    setTimeout(handleScroll, 300);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [blog]);

  /* ================= SCROLL TO SECTION ================= */
  const scrollToHeading = (id) => {
    const element = document.getElementById(id);
    if (!element) return;

    setActiveId(id);

    const yOffset = -120;
    const y =
      element.getBoundingClientRect().top +
      window.pageYOffset +
      yOffset;

    window.scrollTo({
      top: y,
      behavior: "smooth",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Loading blog...
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Blog not found.
      </div>
    );
  }

  return (
    <main className="bg-[#f5f5f5] w-full">
      <div className="mx-auto max-w-7xl px-4 py-10">

        {/* GRID LAYOUT */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[3fr_1fr]">

          {/* LEFT COLUMN */}
          <div className="space-y-10">
            <BlogContent
              blog={blog}
              onHeadingsReady={handleHeadingsReady}
            />

            <BlogFAQ faqs={blog.faqs} />
          </div>

          {/* RIGHT SIDEBAR */}
          <aside className="hidden lg:block space-y-300 mb-8">
            <div className="sticky top-[120px]">

              <div className="bg-white rounded-lg p-5 shadow-sm">
                <BlogTOC
                  tocItems={tocItems}
                  activeId={activeId}
                  scrollToHeading={scrollToHeading}
                  recentBlogs={recentBlogs}
                />
              </div>

            </div>
          </aside>

        </div>

      </div>
    </main>
  );
}
