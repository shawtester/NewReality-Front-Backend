"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
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

  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0); // ✅ NEW

  /* ================= IMAGE RESOLUTION ================= */

  const mainImage =
    property.mainImage?.url ||
    property.featureImageURL ||
    property.featuredImage ||
    null;

  const galleryImages = useMemo(() => {
    if (property.gallery?.length > 0) {
      return property.gallery.map((img) =>
        typeof img === "string" ? img : img.url
      );
    }

    if (property.imageList?.length > 0) {
      return property.imageList;
    }

    return [];
  }, [property]);

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

  const videoUrl = getVideoUrl(property.video);

  const socialLinks = [
    { Icon: FaInstagram, href: "https://www.instagram.com/neevrealty" },
    { Icon: FaLinkedinIn, href: "https://www.linkedin.com/company/neev-realty-services" },
    { Icon: FaPinterestP, href: "https://pinterest.com/neevreality" },
    { Icon: FaFacebookF, href: "https://www.facebook.com/p/NeevRealty-61558971842531" },
    { Icon: FaTwitter, href: "https://x.com/NeevRealty" },
  ];

  const copyPropertyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      alert("Property link copied ✅");
    } catch (err) {
      console.error(err);
    }
  };


  return (
    <>
      {/* ================= MOBILE ================= */}
      <div className="block lg:hidden mt-12 space-y-4">
        <BrandCTA propertyTitle={property.title} />

        {/* 🔥 MOBILE SHARE BOX */}
        <div className="bg-white rounded-xl p-5 text-center shadow-sm">
          <div className="flex items-center justify-center gap-2 mb-4">
            <p className="font-medium">Copy</p>

            <button
              onClick={copyPropertyLink}
              className="text-gray-400 text-sm hover:text-[#DBA40D] transition"
              title="Copy Property Link"
            >
              <FaLink />
            </button>
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
      </div>


      {/* ================= DESKTOP ================= */}
      <div className="w-[390px] hidden lg:flex flex-col gap-4">
        {(mainImage || galleryImages.length > 0 || videoUrl) && (
          <div className="bg-white rounded-xl overflow-hidden flex flex-col h-[420px]">

            {/* TOP IMAGES */}
            <div className="grid grid-cols-2 gap-2 px-2">
              {mainImage && (
                <div
                  onClick={() => {
                    setIndex(0);
                    setOpen(true);
                  }}
                  className="relative h-[120px] rounded-lg overflow-hidden cursor-pointer"
                >
                  <Image
                    src={galleryImages[0]}
                    alt=""
                    fill
                    className="object-cover"
                  />
                </div>
              )}

              {galleryImages.length > 0 && (
                <div
                  onClick={() => {
                    setIndex(1);
                    setOpen(true);
                  }}
                  className="relative h-[120px] rounded-lg overflow-hidden cursor-pointer group"
                >
                  <Image
                    src={galleryImages[1]}
                    alt=""
                    fill
                    className="object-cover"
                  />

                  <span className="absolute bottom-2 left-2 bg-white/90 text-xs px-2 py-1 rounded">
                    {galleryImages.length}+ Photos
                  </span>

                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition" />
                </div>
              )}
            </div>

            {/* VIDEO / IMAGE */}
            <div className="relative bg-black m-2 rounded-lg overflow-hidden h-[235px]">
              {videoUrl ? (
                videoUrl.includes("youtu") ? (
                  <iframe
                    src={`https://www.youtube.com/embed/${getYouTubeId(videoUrl)}`}
                    className="w-full h-full"
                    allowFullScreen
                  />
                ) : (
                  <video
                    src={videoUrl}
                    controls
                    className="w-full h-full object-cover"
                  />
                )
              ) : (
                mainImage && (
                  <Image
                    src={galleryImages[3] || mainImage}
                    alt=""
                    fill
                    className="object-cover"
                  />
                )
              )}
            </div>

          </div>
        )}

        {/* ================= QUICK FACTS ================= */}
        <div className="bg-white rounded-xl p-5 shadow-sm">
          <h3 className="font-semibold mb-3 border-b pb-2">Quick Facts</h3>

          <div className="text-sm space-y-2 text-gray-600">
            <p>Project Area : {property.projectArea || "-"}</p>
            <p>Project Type : {property.projectType || "-"}</p>
            <p>Project Status : {property.projectStatus || "-"}</p>
            <p>Project Elevation / Tower : {property.projectElevation || "-"}</p>
            <p>RERA No : {property.rera || "-"}</p>
            <p>Possession : {property.possession || "-"}</p>
          </div>
        </div>

        {/* ================= STICKY CTA ================= */}
        <aside className="sticky top-[135px] space-y-4 z-20">
          <BrandCTA propertyTitle={property.title} />

          <div className="bg-white rounded-xl p-5 text-center shadow-sm">
            <div className="flex items-center justify-center gap-2 mb-4">
              <p className="font-medium">Copy</p>

              <button
                onClick={copyPropertyLink}
                className="text-gray-400 text-sm hover:text-[#DBA40D] transition"
                title="Copy Property Link"
              >
                <FaLink />
              </button>
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

      {/* ================= FULLSCREEN GALLERY ================= */}
      {open && (
        <div className="fixed inset-0 z-[999] bg-black/90 flex items-center justify-center">

          {/* CLOSE */}
          <button
            onClick={() => setOpen(false)}
            className="absolute top-6 right-6 text-white text-3xl"
          >
            ✕
          </button>

          {/* LEFT */}
          <button
            onClick={() =>
              setIndex((prev) =>
                prev === 0 ? galleryImages.length - 1 : prev - 1
              )
            }
            className="absolute left-6 text-white text-4xl"
          >
            ❮
          </button>

          {/* IMAGE */}
          <div className="relative w-[90vw] h-[80vh]">
            <Image
              src={galleryImages[index]}
              alt=""
              fill
              className="object-contain"
            />
          </div>

          {/* RIGHT */}
          <button
            onClick={() =>
              setIndex((prev) => (prev + 1) % galleryImages.length)
            }
            className="absolute right-6 text-white text-4xl"
          >
            ❯
          </button>
        </div>
      )}
    </>
  );
}
