"use client";

import { useState } from "react";
import Image from "next/image";

export default function MobileGallery({ images = [], title = "" }) {
  const [activeImage, setActiveImage] = useState(images[0]);

  /* ✅ NEW — FULLSCREEN STATE */
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);

  if (!images || images.length === 0) return null;

  return (
    <div>
      {/* HERO IMAGE */}
      <div
        onClick={() => {
          setIndex(images.indexOf(activeImage));
          setOpen(true);
        }}
        className="
          relative w-full
          max-w-[380px] md:max-w-[750px] lg:max-w-[820px]
          aspect-[17/8]
          mx-auto rounded-xl overflow-hidden
          cursor-pointer
        "
      >
        <Image
          src={activeImage}
          alt={title}
          fill
          priority
          className="object-cover"
        />
      </div>

      {/* THUMBNAILS (MOBILE ONLY) */}
      <div className="lg:hidden mt-3 overflow-x-auto scrollbar-hide">
        <div className="flex gap-2 items-center px-1">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setActiveImage(img)}
              className={`
                w-[56px] h-[42px]
                border rounded-lg overflow-hidden
                flex-shrink-0
                transition
                ${
                  activeImage === img
                    ? "border-[#F5A300] ring-2 ring-[#F5A300]/30"
                    : "border-gray-300"
                }
              `}
            >
              <Image
                src={img}
                alt=""
                width={56}
                height={42}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
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
                prev === 0 ? images.length - 1 : prev - 1
              )
            }
            className="absolute left-6 text-white text-4xl"
          >
            ❮
          </button>

          {/* IMAGE */}
          <div className="relative w-[90vw] h-[80vh]">
            <Image
              src={images[index]}
              alt=""
              fill
              className="object-contain"
            />
          </div>

          {/* RIGHT */}
          <button
            onClick={() =>
              setIndex((prev) => (prev + 1) % images.length)
            }
            className="absolute right-6 text-white text-4xl"
          >
            ❯
          </button>
        </div>
      )}
    </div>
  );
}
