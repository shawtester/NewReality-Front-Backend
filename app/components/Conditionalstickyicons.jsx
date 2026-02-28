"use client";

import { usePathname } from "next/navigation";
import StickyIcons from "@/app/components/StickyIcons";

export default function ConditionalStickyIcons() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  const staticPages = [
    "about-us",
    "our-services",
    "blog",
    "faqs",
    "contact-us",
    "privacy",
    "terms-condition",
    "residential-property-in-gurgaon",
    "commercial-property-in-gurgaon",
  ];

  const isPropertyDetail =
    segments.length === 1 && !staticPages.includes(segments[0]);

  if (isPropertyDetail) {
    return null;
  }

  return <StickyIcons />;
}