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

  /* ✅ FIXED IMAGE FIELD (gallery instead of images) */
  const images =
    property.gallery?.length > 0
      ? property.gallery.map((g) => g.url || g)
      : ["/images/s1.png", "/images/s2.png", "/images/s3.png"];

  /* ================= VIDEO ================= */
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

  /* ================= AUTO SCROLL ================= */
  useEffect(() => {
    if (!open || !scrollRef.current) return;

    const container = scrollRef.current;

    const interval = setInterval(() => {
      const maxScroll = container.scrollWidth - container.clientWidth;

      if (container.scrollLeft >= maxScroll) {
        container.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        container.scrollBy({
          left: container.clientWidth,
          behavior: "smooth",
        });
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [open]);

  return (
    <>
      {/* ================= MOBILE ================= */}
      <div className="block lg:hidden mt-12 space-y-4">
        <BrandCTA propertyTitle={property.title} />
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

        {/* ================= QUICK FACTS ================= */}
        <div className="bg-white rounded-xl p-5 shadow-sm">
          <h3 className="font-semibold mb-3 border-b pb-2">
            Quick Facts
          </h3>

          <div className="text-sm space-y-2 text-gray-600">
            <p>Project Area : {property.projectArea || "-"}</p>
            <p>Project Type : {property.projectType || "-"}</p>
            <p>Project Status : {property.projectStatus || "-"}</p>
            <p>Project Elevation / Tower : {property.projectElevation || "-"}</p>
            <p>RERA No : {property.rera}</p>
            <p>Possession : {property.possession || "-"}</p>
          </div>
        </div>

        {/* STICKY CTA */}
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
    </>
  );
}
