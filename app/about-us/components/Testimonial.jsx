"use client";

import { useRef } from "react";
import Image from "next/image";

const testimonials = [
  {
    name: "Subham Rao",
    role: "First-time Homebuyer",
    quote:
      "The buying process was smooth and well-organized. From property selection to final paperwork, everything was handled professionally and transparently.",
    avatar: "/images/aboutimg/testimonial.png",
  },
  {
    name: "Krishankaa",
    role: "Real Estate Investor",
    quote:
      "They guided us honestly at every step and helped us choose the right property based on our needs and budget. Truly reliable real estate consultants.",
    avatar: "/images/aboutimg/testimonial.png",
  },
  {
    name: "Atu Daga",
    role: "Family Relocating",
    quote:
      "Excellent support during site visits and documentation. Their deep market knowledge made us feel confident in our investment decision.",
    avatar: "/images/aboutimg/testimonial.png",
  },
  {
    name: "Rahul Mehta",
    role: "NRI Buyer",
    quote:
      "A very professional team that values customer satisfaction. Clear communication, timely updates, and great after-sales assistance throughout.",
    avatar: "/images/aboutimg/testimonial.png",
  },
  {
    name: "Ashish Dubey",
    role: "NRI Buyer",
    quote:
      "They made the property buying experience stress-free with their transparent approach and expert guidance. Highly recommended for serious buyers.",
    avatar: "/images/aboutimg/testimonial.png",
  },
  {
    name: "Preeti Singh",
    role: "NRI Buyer",
    quote:
      "From the first call to final possession, the service quality was outstanding. They focus on long-term relationships, not just sales.",
    avatar: "/images/aboutimg/testimonial.png",
  },
];

export default function TestimonialsSection() {
  const scrollRef = useRef(null);

  return (
    <section className="bg-[#F7F9FC] sm:py-10 -mt-8 sm:-mt-10 lg:-mt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Heading */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-gray-900">
            What Our Clients Say{" "}
            <span className="text-[#DBA40D]">About Us</span>
          </h2>
          <p className="mt-4 text-gray-500 max-w-2xl mx-auto text-sm sm:text-base">
            Real stories from families and investors who trusted Livora.
          </p>
        </div>

        {/* Slider */}
        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth pb-1 px-2"
        >
          {testimonials.map((item, i) => (
            <article
              key={i}
              className="w-[85%] sm:w-[70%] lg:w-[32%] flex-shrink-0 bg-white rounded-2xl border border-gray-200 shadow-sm p-6 flex flex-col"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="relative w-12 h-12 rounded-full overflow-hidden">
                  <Image
                    src={item.avatar}
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900">
                    {item.name}
                  </h3>
                  <p className="text-sm text-gray-500">{item.role}</p>
                </div>
              </div>

              <p className="text-sm text-gray-600 leading-relaxed flex-1">
                {item.quote}
              </p>

              <div className="flex gap-1 mt-6 text-[#DBA40D]">
                {Array.from({ length: 5 }).map((_, idx) => (
                  <span key={idx} className="text-lg">★</span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
