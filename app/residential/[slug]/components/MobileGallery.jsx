"use client";

import { useState } from "react";
import Image from "next/image";

export default function MobileGallery({ images = [], title = "" }) {
  const [activeImage, setActiveImage] = useState(images[0]);

  // 🔴 Agar images hi nahi hai → gallery mat dikhao
  if (!images || images.length === 0) return null;

  return (
    <div>
      {/* HERO IMAGE */}
      <div className="relative w-full max-w-[380px] h-[260px] sm:h-[312px] md:max-w-[750px] lg:max-w-[820px] lg:h-[300px] mx-auto rounded-xl overflow-hidden">
        <Image
          src={activeImage}
          alt={title}
          fill
          priority
          className="object-cover"
        />
      </div>

      {/* THUMBNAILS */}
      <div className="lg:hidden mt-2 overflow-x-auto scrollbar-hide">
        <div className="flex gap-2 items-center">
          {images.map((img, i) => (
            <div
              key={i}
              onClick={() => setActiveImage(img)}
              className={`
                w-[36px] h-[36px]
                sm:w-[40px] sm:h-[20px]
                border rounded-md
                overflow-hidden
                cursor-pointer
                flex-shrink-0
                ${activeImage === img
                  ? "border-[#F5A300]"
                  : "border-gray-300"}
              `}
            >
              <Image
                src={img}
                alt=""
                width={40}
                height={20}
                className="w-full h-full object-contain"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
