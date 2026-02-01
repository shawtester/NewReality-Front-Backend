"use client";

import Image from "next/image";
import Link from "next/link";
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

  // ✅ Social media links configuration (same for mobile & desktop)
  const socialLinks = [
    { Icon: FaInstagram, href: "https://www.instagram.com/neevrealty" },
    { Icon: FaLinkedinIn, href: "https://www.linkedin.com/company/neev-realty-services" },
    { Icon: FaPinterestP, href: "https://pinterest.com/neevreality" },
    { Icon: FaFacebookF, href: "https://www.facebook.com/p/NeevRealty-61558971842531" },
    { Icon: FaTwitter, href: "https://x.com/NeevRealty" },
  ];

  return (
    <>
      {/* ================= RIGHT SIDEBAR (MOBILE VIEW) ================= */}
      <div className="block lg:hidden mt-12 space-y-4">
        <BrandCTA propertyTitle={property.title} />

        {/* SHARE */}
        <div className="bg-white rounded-xl p-5 shadow-sm text-center">
          <p className="font-medium mb-4">Share</p>

          <div className="flex justify-center gap-3">
            {socialLinks.map(({ Icon, href }, i) => (
              <Link
                key={i}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 p-2 bg-[#DBA40D] text-white rounded hover:bg-[#c8950b] transition-all duration-200 flex items-center justify-center"
              >
                <Icon className="w-5 h-5" />
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* ================= RIGHT SIDEBAR (DESKTOP) ================= */}
      <div className="w-[340px] hidden lg:block space-y-4">
        {/* IMAGE + VIDEO PREVIEW */}
        <div className="bg-white rounded-xl overflow-hidden">
          <div className="grid grid-cols-2 gap-1 mb-1">
            <div className="relative">
              <Image
                src={property.images?.[0] || "/images/s1.png"}
                alt="Gallery"
                width={200}
                height={120}
                className="object-cover rounded"
              />
            </div>

            <div className="relative">
              <Image
                src={property.images?.[1] || "/images/s2.png"}
                alt="Gallery"
                width={200}
                height={120}
                className="object-cover rounded"
              />
              <span className="absolute bottom-2 left-2 bg-white/90 text-xs px-2 py-1 rounded">
                {property.images?.length || 0}+ Photos
              </span>
            </div>
          </div>

          {/* VIDEO PREVIEW */}
          <div className="relative">
            <Image
              src="/images/s3.png"
              alt="Video Preview"
              width={400}
              height={200}
              className="w-full h-[185px] object-cover"
            />

            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-14 h-14 bg-white/90 rounded-full flex items-center justify-center shadow cursor-pointer text-xl">
                ▶
              </div>
            </div>
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

          {/* SHARE */}
          <div className="bg-white rounded-xl p-5 py-5 shadow-sm text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <p className="font-medium">Share</p>
              <FaLink className="text-gray-400 text-sm cursor-pointer" />
            </div>

            <div className="flex justify-center gap-3">
              {socialLinks.map(({ Icon, href }, i) => (
                <Link
                  key={i}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 p-2 bg-[#DBA40D] text-white rounded hover:bg-[#c8950b] transition-all duration-200 flex items-center justify-center cursor-pointer"
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
