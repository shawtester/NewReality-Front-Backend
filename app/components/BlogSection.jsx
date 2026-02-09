"use client";

import Link from "next/link";
import Image from "next/image";
import { useRef, useCallback, useEffect } from "react";

export default function BlogSection({ blogs = [] }) {
  const scrollRef = useRef(null);
  const touchStartX = useRef(null);
  const autoScrollIntervalRef = useRef(null);
  const isAutoScrolling = useRef(true);
  const cardWidth = 320; // 300px card + 20px gap

  if (!blogs.length) return null;

  /* ================= SCROLL FUNCTIONS ================= */
  const scrollLeft = useCallback(() => {
    scrollRef.current?.scrollBy({ left: -cardWidth, behavior: "smooth" });
  }, []);

  const scrollRight = useCallback(() => {
    scrollRef.current?.scrollBy({ left: cardWidth, behavior: "smooth" });
  }, []);

  const startAutoScroll = useCallback(() => {
    if (autoScrollIntervalRef.current) {
      clearInterval(autoScrollIntervalRef.current);
    }

    autoScrollIntervalRef.current = setInterval(() => {
      if (isAutoScrolling.current && scrollRef.current) {
        const scrollLeftPos = scrollRef.current.scrollLeft;
        const maxScroll = scrollRef.current.scrollWidth - scrollRef.current.clientWidth;
        
        // ✅ Infinite loop: jump back to start at end
        if (scrollLeftPos >= maxScroll - 10) {
          scrollRef.current.scrollTo({ left: 0, behavior: "smooth" });
        } else {
          scrollRef.current.scrollBy({ left: cardWidth, behavior: "smooth" });
        }
      }
    }, 3500); // 3.5s interval
  }, []);

  /* ================= TOUCH HANDLERS ================= */
  const onTouchStart = useCallback((e) => {
    touchStartX.current = e.touches[0].clientX;
    isAutoScrolling.current = false;
  }, []);

  const onTouchEnd = useCallback((e) => {
    if (!touchStartX.current || !scrollRef.current) return;

    const diff = touchStartX.current - e.changedTouches[0].clientX;

    if (Math.abs(diff) > 50) {
      scrollRef.current.scrollBy({
        left: diff > 0 ? cardWidth : -cardWidth,
        behavior: "smooth",
      });
    }

    touchStartX.current = null;
    setTimeout(() => {
      isAutoScrolling.current = true;
    }, 2000);
  }, []);

  /* ================= EFFECTS ================= */
  useEffect(() => {
    const timer = setTimeout(() => {
      startAutoScroll();
    }, 800);
    return () => clearTimeout(timer);
  }, [startAutoScroll]);

  useEffect(() => {
    return () => {
      if (autoScrollIntervalRef.current) {
        clearInterval(autoScrollIntervalRef.current);
      }
    };
  }, []);

  return (
    <section className="max-w-[1240px] mx-auto px-4 mt-8 relative">
      {/* HEADER */}
      <div className="relative mb-8">
        {/* CENTER TITLE */}
        <div className="text-center">
          <h2 className="text-3xl font-semibold text-gray-900">
            Blog and News <span className="text-[#DBA40D]">Updates</span>
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Your trusted source for expert updates on real estate.
          </p>
        </div>

        {/* EXPLORE MORE */}
        <div className="mt-4 md:mt-0 md:absolute md:right-0 md:top-1/2 md:-translate-y-1/2 text-center">
          <Link
            href="/blog"
            className="inline-flex items-center justify-center
              bg-[#DBA40D] border border-[#DBA40D]
              rounded-sm text-white font-medium
              px-5 py-2 text-sm transition hover:bg-[#c9920b]"
          >
            Explore More
          </Link>
        </div>
      </div>

      {/* BLOG CARDS - AUTO SCROLL CONTAINER */}
      <div
        ref={scrollRef}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth pb-6 snap-x snap-mandatory px-4 lg:px-0 py-4"
      >
        {blogs.map((blog) => (
          <Link
            key={blog.id}
            href={`/blog/${blog.id}`}
            className="min-w-[300px] flex-shrink-0 snap-center hover:scale-[1.02] transition-all"
          >
            <article className="group h-full flex flex-col overflow-hidden rounded-2xl
              bg-white shadow-sm hover:shadow-lg transition-all duration-300
              hover:-translate-y-1"
            >
              {/* IMAGE */}
              <div className="relative w-full h-[200px]">
                <Image
                  src={blog.image || "/images/blog/placeholder.jpg"}
                  alt={blog.title}
                  fill
                  className="object-cover"
                  sizes="300px"
                />
              </div>

              {/* CONTENT */}
              <div className="flex flex-1 flex-col p-4">
                <h3 className="text-base font-semibold text-gray-900 line-clamp-2">
                  {blog.title}
                </h3>

                <p className="mt-2 text-sm text-gray-600 line-clamp-2">
                  {blog.excerpt}
                </p>

                <div className="mt-auto pt-4 flex items-center justify-between">
                  <span className="text-xs text-gray-400">
                    {blog.timestampCreate
                      ? new Date(blog.timestampCreate * 1000).toLocaleDateString(
                          "en-US",
                          { month: "short", day: "2-digit" }
                        )
                      : ""}
                  </span>

                  <span className="text-sm font-medium text-[#DBA40D]">
                    Read More →
                  </span>
                </div>
              </div>
            </article>
          </Link>
        ))}
      </div>
    </section>
  );
}
