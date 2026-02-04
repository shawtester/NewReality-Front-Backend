"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  FaInstagram,
  FaLinkedinIn,
  FaPinterestP,
  FaFacebookF,
  FaTwitter,
  FaLink,
} from "react-icons/fa";
import BrandCTA from "./BrandCTA";

export default function RightSidebar({ property }) {
  if (!property) return null;

  /* ================= AUTO SLIDER ================= */
  const [slideIndex, setSlideIndex] = useState(0);

  useEffect(() => {
    if (!property.images || property.images.length <= 2) return;

    const interval = setInterval(() => {
      setSlideIndex((prev) =>
        prev + 1 >= property.images.length ? 0 : prev + 1
      );
    }, 2500);

    return () => clearInterval(interval);
  }, [property.images]);

  /* ================= HELPERS ================= */

  const getVideoUrl = (video) => {
    if (!video) return "";
    if (typeof video === "object" && video.url) return video.url;
    if (typeof video === "string") return video;
    return "";
  };

  const getYouTubeId = (url = "") => {
    if (!url) return "";
    if (url.includes("youtu.be/")) return url.split("youtu.be/")[1].split("?")[0];
    if (url.includes("v=")) return url.split("v=")[1].split("&")[0];
    if (url.includes("/embed/")) return url.split("/embed/")[1].split("?")[0];
    if (url.includes("/shorts/")) return url.split("/shorts/")[1].split("?")[0];
    return "";
  };

  const videoUrl = getVideoUrl(property.video);

  /* ================= SOCIAL LINKS ================= */

  const socialLinks = [
    { Icon: FaInstagram, href: "https://www.instagram.com/neevrealty" },
    {
      Icon: FaLinkedinIn,
      href: "https://www.linkedin.com/company/neev-realty-services",
    },
    { Icon: FaPinterestP, href: "https://pinterest.com/neevreality" },
    {
      Icon: FaFacebookF,
      href: "https://www.facebook.com/p/NeevRealty-61558971842531",
    },
    { Icon: FaTwitter, href: "https://x.com/NeevRealty" },
  ];

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
                rel="noopener noreferrer"
                className="w-9 h-9 p-2 bg-[#DBA40D] text-white rounded hover:bg-[#c8950b] flex items-center justify-center"
              >
                <Icon className="w-5 h-5" />
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* ================= DESKTOP ================= */}
      <div className="w-[340px] hidden lg:block space-y-4">
        {/* IMAGE + VIDEO */}
        <div className="bg-white rounded-xl overflow-hidden">
          {/* 🔥 AUTO LOOP IMAGE GRID */}
          <div className="grid grid-cols-2 gap-1 mb-1">
            {/* IMAGE 1 */}
            <div className="relative w-full h-[120px] bg-[#f6f6f6] rounded overflow-hidden">
              <Image
                src={
                  property.images?.length > 2
                    ? property.images[slideIndex]
                    : property.images?.[0] || "/images/s1.png"
                }
                alt="Gallery"
                fill
                sizes="200px"
                className="object-contain p-1 transition-all duration-500"
              />
            </div>

            {/* IMAGE 2 */}
            <div className="relative w-full h-[120px] bg-[#f6f6f6] rounded overflow-hidden">
              <Image
                src={
                  property.images?.length > 2
                    ? property.images[
                        (slideIndex + 1) % property.images.length
                      ]
                    : property.images?.[1] || "/images/s2.png"
                }
                alt="Gallery"
                fill
                sizes="200px"
                className="object-contain p-1 transition-all duration-500"
              />

              <span className="absolute bottom-2 left-2 bg-white/90 text-xs px-2 py-1 rounded">
                {property.images?.length || 0}+ Photos
              </span>
            </div>
          </div>

          {/* 🎥 VIDEO */}
          <div className="relative bg-black rounded-lg overflow-hidden">
            {videoUrl ? (
              videoUrl.includes("youtube") || videoUrl.includes("youtu.be") ? (
                <iframe
                  src={`https://www.youtube.com/embed/${getYouTubeId(videoUrl)}`}
                  className="w-full h-[185px]"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <video
                  src={videoUrl}
                  controls
                  playsInline
                  preload="metadata"
                  className="w-full h-[185px] object-cover"
                />
              )
            ) : null}
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
                  rel="noopener noreferrer"
                  className="w-9 h-9 p-2 bg-[#DBA40D] text-white rounded hover:bg-[#c8950b] flex items-center justify-center"
                >
                  <Icon className="w-5 h-5" />
                </Link>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </>
  );
}
