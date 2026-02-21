"use client";

import { useEffect, useState } from "react";
import { getBlogBySlug, getBlogsForHome } from "@/lib/firestore/blogs/read";

import BlogContent from "./components/BlogContent";
import BlogTOC from "./components/BlogTOC";
import RecentBlogs from "./components/RecentBlogs";
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
      if (!el.id) el.id = `section-${index + 1}`;

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

      let currentId = "";

      headings.forEach((heading) => {
        const rect = heading.getBoundingClientRect();
        if (rect.top <= 150) {
          currentId = heading.id;
        }
      });

      if (currentId) setActiveId(currentId);
    };

    window.addEventListener("scroll", handleScroll);
    setTimeout(handleScroll, 300);

    return () => window.removeEventListener("scroll", handleScroll);
  }, [blog]);

  /* ================= AUTO SCROLL TOC ================= */
  useEffect(() => {
    if (!activeId) return;

    const activeElement = document.getElementById(`toc-${activeId}`);
    const container = document.getElementById("toc-container");

    if (!activeElement || !container) return;

    const containerRect = container.getBoundingClientRect();
    const activeRect = activeElement.getBoundingClientRect();

    if (
      activeRect.bottom > containerRect.bottom ||
      activeRect.top < containerRect.top
    ) {
      container.scrollTo({
        top:
          activeElement.offsetTop -
          container.offsetHeight / 2 +
          activeElement.offsetHeight / 2,
        behavior: "smooth",
      });
    }
  }, [activeId]);

  const scrollToHeading = (id) => {
    const element = document.getElementById(id);
    if (!element) return;

    setActiveId(id);

    const yOffset = -120;
    const y =
      element.getBoundingClientRect().top +
      window.pageYOffset +
      yOffset;

    window.scrollTo({ top: y, behavior: "smooth" });
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
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 md:py-1">
        <div className="grid grid-cols-1 lg:grid-cols-[3fr_1fr] gap-8 lg:gap-1">

          {/* LEFT COLUMN */}
          <div className="space-y-0">
            <BlogContent
              blog={blog}
              onHeadingsReady={handleHeadingsReady}
            />

            <BlogFAQ faqs={blog.faqs} />

            <div className="lg:hidden flex justify-center">
              <div className="w-full max-w-4xl">
                <RecentBlogs recentBlogs={recentBlogs} />
              </div>
            </div>
          </div>

          {/* RIGHT SIDEBAR */}
          <aside className="hidden lg:block">
            <div className="sticky top-[110px] mt-[125px] space-y-8">

              <div
                id="toc-container"
                className="bg-white rounded-xl p-6 shadow-sm max-h-[580px] overflow-y-auto"
              >
                <BlogTOC
                  tocItems={tocItems}
                  activeId={activeId}
                  scrollToHeading={scrollToHeading}
                />
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm">
                <RecentBlogs recentBlogs={recentBlogs} />
              </div>

            </div>
          </aside>

        </div>
      </div>
    </main>
  );
}