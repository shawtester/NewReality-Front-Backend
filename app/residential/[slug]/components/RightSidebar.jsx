"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import {
  FaInstagram,
  FaLinkedinIn,
  FaPinterestP,
  FaFacebookF,
  FaTwitter,
  FaLink,
  FaTimes,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import BrandCTA from "./BrandCTA";

export default function RightSidebar({ property }) {
  if (!property) return null;

  const [open, setOpen] = useState(false);
  const scrollRef = useRef(null);

  const images =
    property.images?.length > 0
      ? property.images
      : ["/images/s1.png", "/images/s2.png", "/images/s3.png"];

  const getVideoUrl = (video) => {
    if (!video) return "";
    if (typeof video === "object" && video.url) return video.url;
    if (typeof video === "string") return video;
    return "";
  };

  const getYouTubeId = (url = "") => {
    if (url.includes("youtu.be/")) return url.split("youtu.be/")[1].split("?")[0];
    if (url.includes("v=")) return url.split("v=")[1].split("&")[0];
    if (url.includes("/embed/")) return url.split("/embed/")[1].split("?")[0];
    if (url.includes("/shorts/")) return url.split("/shorts/")[1].split("?")[0];
    return "";
  };

  const scroll = (dir) => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({
      left:
        dir === "left"
          ? -scrollRef.current.clientWidth
          : scrollRef.current.clientWidth,
      behavior: "smooth",
    });
  };

  const videoUrl = getVideoUrl(property.video);

  const socialLinks = [
    { Icon: FaInstagram, href: "https://www.instagram.com/neevrealty" },
    { Icon: FaLinkedinIn, href: "https://www.linkedin.com/company/neev-realty-services" },
    { Icon: FaPinterestP, href: "https://pinterest.com/neevreality" },
    { Icon: FaFacebookF, href: "https://www.facebook.com/p/NeevRealty-61558971842531" },
    { Icon: FaTwitter, href: "https://x.com/NeevRealty" },
  ];

  // ================= AUTO SCROLL FOR FLOATING GALLERY =================
  useEffect(() => {
    if (!open || !scrollRef.current) return;

    const container = scrollRef.current;

    const interval = setInterval(() => {
      // Stop auto-scroll if video is in view
      const videoElement = container.querySelector("video, iframe");
      if (videoElement) {
        const rect = videoElement.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();
        // If video fully visible inside container, stop scrolling
        if (
          rect.left >= containerRect.left &&
          rect.right <= containerRect.right
        ) {
          return; // skip this scroll step
        }
      }

      const maxScroll = container.scrollWidth - container.clientWidth;

      if (container.scrollLeft >= maxScroll) {
        container.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        container.scrollBy({ left: container.clientWidth, behavior: "smooth" });
      }
    }, 3000); // every 3 seconds

    return () => clearInterval(interval);
  }, [open]);

  return (
    <>
      {/* ================= MOBILE ================= */}
      <div className="block lg:hidden mt-12 space-y-4">
        <BrandCTA propertyTitle={property.title} />
        <div className="bg-white rounded-xl p-5 shadow-sm text-center">
          <p className="font-medium mb-4">Share</p>
          <div className="flex justify-center gap-3">
            {socialLinks.map(({ Icon, href }, i) => (
              <Link
                key={i}
                href={href}
                target="_blank"
                className="w-9 h-9 p-2 bg-[#DBA40D] text-white rounded flex items-center justify-center"
              >
                <Icon />
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* ================= DESKTOP ================= */}
      <div className="w-[340px] hidden lg:block space-y-4">
        {/* IMAGE GRID */}
        <div className="bg-white rounded-xl overflow-hidden">
          <div className="grid grid-cols-2 gap-1 mb-1">
            <Image
              src={images[0]}
              alt=""
              width={200}
              height={120}
              className="object-cover rounded"
            />
            <div
              onClick={() => setOpen(true)}
              className="relative cursor-pointer group"
            >
              <Image
                src={images[1]}
                alt=""
                width={200}
                height={120}
                className="object-cover rounded"
              />
              <span className="absolute bottom-2 left-2 bg-white/90 text-xs px-2 py-1 rounded">
                {images.length}+ Photos
              </span>
              <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition" />
            </div>
          </div>

          {/* VIDEO PREVIEW */}
          <div className="relative bg-black rounded-lg overflow-hidden">
            {videoUrl ? (
              videoUrl.includes("youtu") ? (
                <iframe
                  src={`https://www.youtube.com/embed/${getYouTubeId(videoUrl)}`}
                  className="w-full h-[185px]"
                  allowFullScreen
                />
              ) : (
                <video
                  src={videoUrl}
                  controls
                  className="w-full h-[185px] object-cover"
                />
              )
            ) : (
              <Image
                src={images[0]}
                alt=""
                width={400}
                height={200}
                className="w-full h-[185px] object-cover"
              />
            )}
          </div>
        </div>

        {/* QUICK FACTS */}
        <div className="bg-white rounded-xl p-5 shadow-sm">
          <h3 className="font-semibold mb-3 border-b pb-2">Quick Facts</h3>
          <div className="text-sm space-y-2 text-gray-600">
            <p>Developer : {property.builderName}</p>
            <p>Area : {property.size}</p>
            <p>Price : {property.price}</p>
            <p>RERA No : {property.rera}</p>
            <p>Last Updated : {property.updatedAt}</p>
          </div>
        </div>

        {/* STICKY CTA + SHARE */}
        <aside className="sticky top-[135px] space-y-4 z-20">
          <BrandCTA propertyTitle={property.title} />
          <div className="bg-white rounded-xl p-5 text-center shadow-sm">
            <div className="flex items-center justify-center gap-2 mb-4">
              <p className="font-medium">Share</p>
              <FaLink className="text-gray-400 text-sm" />
            </div>
            <div className="flex justify-center gap-3">
              {socialLinks.map(({ Icon, href }, i) => (
                <Link
                  key={i}
                  href={href}
                  target="_blank"
                  className="w-9 h-9 p-2 bg-[#DBA40D] text-white rounded flex items-center justify-center"
                >
                  <Icon />
                </Link>
              ))}
            </div>
          </div>
        </aside>
      </div>

      {/* ================= FLOATING GALLERY ================= */}
      {open && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/80">
          {/* Close Button */}
          <button
            onClick={() => setOpen(false)}
            className="absolute top-5 right-5 text-white text-2xl z-20"
          >
            <FaTimes />
          </button>

          {/* Image Carousel */}
          <div className="relative w-[90%] max-w-6xl h-[70vh] flex items-center">
            {/* Left Scroll Button */}
            <button
              onClick={() => scroll("left")}
              className="absolute left-14 z-20 text-white text-3xl bg-black/30 p-2 rounded-full hover:bg-black/50 transition"
            >
              <FaChevronLeft />
            </button>

            {/* Scrollable Images/Videos */}
            <div
              ref={scrollRef}
              className="flex w-full h-full overflow-x-auto scroll-smooth snap-x snap-mandatory"
            >
              {videoUrl && (
                <div className="min-w-full h-full flex items-center justify-center snap-start">
                  {videoUrl.includes("youtu") ? (
                    <iframe
                      src={`https://www.youtube.com/embed/${getYouTubeId(videoUrl)}`}
                      className="w-full h-full rounded-lg"
                      allowFullScreen
                    />
                  ) : (
                    <video
                      src={videoUrl}
                      controls
                      className="w-full h-full object-contain rounded-lg"
                    />
                  )}
                </div>
              )}

              {images.map((img, i) => (
                <div
                  key={i}
                  className="min-w-full h-full flex items-center justify-center snap-start"
                >
                  <Image
                    src={img}
                    alt=""
                    width={1400}
                    height={900}
                    className="object-contain max-h-full rounded-lg"
                  />
                </div>
              ))}
            </div>

            {/* Right Scroll Button */}
            <button
              onClick={() => scroll("right")}
              className="absolute right-14 z-20 text-white text-3xl bg-black/30 p-2 rounded-full hover:bg-black/50 transition"
            >
              <FaChevronRight />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
