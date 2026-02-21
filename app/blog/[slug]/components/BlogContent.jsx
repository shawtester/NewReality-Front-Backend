"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import {
  Share2,
  Facebook,
  Linkedin,
  Twitter,
  MessageCircle,
  Link
} from "lucide-react";


export default function BlogContent({ blog, onHeadingsReady }) {
  const wrapperRef = useRef(null);
  const shareRef = useRef(null);

  const [mobileToc, setMobileToc] = useState([]);
  const [showShare, setShowShare] = useState(false);

  if (!blog) return null;

  const imageSrc = blog.image?.url || null;

  const shareUrl =
    typeof window !== "undefined" ? window.location.href : "";
  const shareTitle = blog.title;

  const formattedDate = blog?.timestampCreate
    ? typeof blog.timestampCreate?.toDate === "function"
      ? blog.timestampCreate.toDate().toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
      : new Date(
        blog.timestampCreate.seconds
          ? blog.timestampCreate.seconds * 1000
          : blog.timestampCreate
      ).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : null;

  /* ================= SHARE FUNCTION ================= */
  const handleShare = (platform) => {
    const encodedUrl = encodeURIComponent(shareUrl);
    const encodedTitle = encodeURIComponent(shareTitle);

    let url = "";

    switch (platform) {
      case "facebook":
        url = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
        break;
      case "linkedin":
        url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
        break;
      case "whatsapp":
        url = `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`;
        break;
      case "twitter":
        url = `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`;
        break;
      case "copy":
        navigator.clipboard.writeText(shareUrl);
        alert("Link copied!");
        setShowShare(false);
        return;
      default:
        return;
    }

    window.open(url, "_blank", "noopener,noreferrer");
    setShowShare(false);
  };

  /* ================= CLOSE SHARE ON OUTSIDE CLICK ================= */
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (shareRef.current && !shareRef.current.contains(e.target)) {
        setShowShare(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /* ================= BUILD HEADINGS ================= */
  useEffect(() => {
    if (!wrapperRef.current) return;

    const headings = wrapperRef.current.querySelectorAll("h2, h3");
    onHeadingsReady?.(headings);

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

    setMobileToc(items);
  }, [blog]);

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

  return (
    <div className="w-full">

      {/* ================= BREADCRUMB ================= */}
      <div className="max-w-[1240px] mx-auto px-4 pb-4 text-sm text-gray-500">
        Home /{" "}
        {blog.category ? (
          <>
            <span className="text-gray-700 capitalize">
              {blog.category.replace(/-/g, " ")}
            </span>{" "}
            /{" "}
          </>
        ) : (
          <>Blog / </>
        )}
        <span className="text-gray-900 font-medium">
          {blog.title}
        </span>
      </div>

      {/* ================= TITLE + META ================= */}
      <div className="max-w-[1240px] mx-auto px-4 space-y-4">

        <h1 className="text-2xl md:text-3xl lg:text-4xl font-semibold text-gray-900">
          {blog.detailHeading || blog.title}
        </h1>

        <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500">

          <span>
            By{" "}
            <span className="text-blue-700 font-medium">
              {blog.author || "Admin"}
            </span>
          </span>

          {formattedDate && (
            <>
              <span>•</span>
              <span>{formattedDate}</span>
            </>
          )}

          {/* ================= SHARE DROPDOWN ================= */}
          <div className="relative ml-auto" ref={shareRef}>
            <div
              onClick={() => setShowShare(!showShare)}
              className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer hover:text-[#DBA40D] transition"
            >
              <span>Share this story</span>
              <Share2 size={16} strokeWidth={1.8} />
            </div>

            {showShare && (
              <div className="absolute right-0 mt-3 bg-white shadow-xl rounded-full px-5 py-3 flex gap-4 items-center z-50 animate-fadeIn">

                <button
                  onClick={() => handleShare("facebook")}
                  className="hover:scale-110 transition text-blue-600"
                >
                  <Facebook size={18} />
                </button>

                <button
                  onClick={() => handleShare("linkedin")}
                  className="hover:scale-110 transition text-blue-700"
                >
                  <Linkedin size={18} />
                </button>

                <button
                  onClick={() => handleShare("whatsapp")}
                  className="hover:scale-110 transition text-green-600"
                >
                  <MessageCircle size={18} />
                </button>

                <button
                  onClick={() => handleShare("twitter")}
                  className="hover:scale-110 transition text-sky-500"
                >
                  <Twitter size={18} />
                </button>

                <button
                  onClick={() => handleShare("copy")}
                  className="hover:scale-110 transition text-gray-700"
                >
                  <Link size={18} />
                </button>

              </div>
            )}

          </div>

        </div>

        {/* ================= FEATURE IMAGE ================= */}
        {imageSrc && (
          <div className="relative mt-4 w-full aspect-[16/7] rounded-xl overflow-hidden">
            <Image
              src={imageSrc}
              alt={blog.title}
              fill
              priority
              className="object-cover"
            />
          </div>
        )}

        {/* ================= MOBILE TOC ================= */}
        <div className="mt-6 lg:hidden">
          <details className="group bg-[#FDECEC] rounded-lg p-2">
            <summary className="flex items-center justify-between cursor-pointer list-none">
              <h2 className="text-lg font-semibold text-gray-900">
                Table of Contents
              </h2>
              <span className="transition-transform duration-300 group-open:rotate-180">
                ▼
              </span>
            </summary>

            <div className="mt-1 space-y-1 text-sm">

              {mobileToc.map((item, index) => {
                const h2Number = index + 1;

                return (
                  <div key={item.id}>

                    {/* ================= H2 ================= */}
                    <button
                      onClick={() => scrollToHeading(item.id)}
                      className="w-full text-left hover:text-[#DBA40D] transition"
                    >
                      <span className="flex items-start gap-2">
                        <span className="min-w-[28px] text-gray-500 font-medium">
                          {h2Number}.
                        </span>
                        <span className="flex-1 break-words font-medium text-gray-900">
                          {item.label}
                        </span>
                      </span>
                    </button>

                    {/* ================= H3 CHILDREN ================= */}
                    {item.children?.length > 0 && (
                      <div className="ml-4 mt-1 space-y-1">
                        {item.children.map((child, childIndex) => {
                          const h3Number = `${h2Number}.${childIndex + 1}`;

                          return (
                            <button
                              key={child.id}
                              onClick={() => scrollToHeading(child.id)}
                              className="w-full text-left hover:text-[#DBA40D] transition"
                            >
                              <span className="flex items-start gap-2">
                                <span className="min-w-[38px] text-gray-500">
                                  {h3Number}
                                </span>
                                <span className="flex-1 break-words text-gray-700">
                                  {child.label}
                                </span>
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    )}

                  </div>
                );
              })}

            </div>
          </details>
        </div>


      </div>

      {/* ================= BLOG BODY ================= */}
      <div className="max-w-[1240px] mx-auto px-4 mt-8">
        <article
          ref={wrapperRef}
          id="blog-wrapper"
          className="bg-white rounded-lg p-6 md:p-8 shadow-sm prose prose-lg max-w-none prose-headings:scroll-mt-32 prose-img:rounded-xl prose-a:text-black hover:prose-a:underline"
          dangerouslySetInnerHTML={{ __html: blog.content }}
        />


        {/* ================= SOURCE ================= */}
        {blog.source && blog.source.trim() !== "" && (
          <div className="max-w-[1240px] mx-auto px-4 pb-6 mt-0 border-t pt-4 text-sm text-gray-600">
            <span className="font-medium text-gray-800">Source: </span>
            <span className="break-all text-gray-700">
              {blog.source}
            </span>
          </div>
        )}
      </div>



    </div>
  );
}
