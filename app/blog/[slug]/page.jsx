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
    const fetchData = async () => {
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
    };

    if (slug) fetchData();
  }, [slug]);

  /* ================= HANDLE HEADINGS ================= */
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

    /* ===== SCROLL SPY ===== */
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort(
            (a, b) =>
              a.boundingClientRect.top -
              b.boundingClientRect.top
          );

        if (visible.length > 0) {
          setActiveId(visible[0].target.id);
        }
      },
      {
        rootMargin: "-180px 0px -50% 0px",
        threshold: 0.2,
      }
    );

    headings.forEach((heading) => observer.observe(heading));
  };

  /* ================= SCROLL FUNCTION ================= */
  const scrollToHeading = (id) => {
    const element = document.getElementById(id);
    if (!element) return;

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
    <main className="bg-[#f8f8f8] w-full">
      <div className="max-w-[1400px] mx-auto px-6 py-12">

        <div className="flex gap-16">

          {/* MAIN CONTENT */}
          <div className="flex-1 min-w-0 space-y-16">
            <BlogContent
              blog={blog}
              onHeadingsReady={handleHeadingsReady}
            />
            <BlogFAQ faqs={blog.faqs} />
          </div>

          {/* SIDEBAR */}
          <div className="hidden lg:block w-[320px] flex-shrink-0">
            <div className="sticky top-[120px] space-y-8">
              <BlogTOC
                tocItems={tocItems}
                activeId={activeId}
                scrollToHeading={scrollToHeading}
                recentBlogs={recentBlogs}
              />
            </div>
          </div>

        </div>

      </div>
    </main>
  );
}
