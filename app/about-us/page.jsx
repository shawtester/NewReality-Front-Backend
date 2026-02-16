import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";

import Section1 from "./components/section1";

import TestimonialsSection from "./components/Testimonial";
import { getTestimonials } from "@/lib/firestore/testimonials/read";
import { MapPin } from "lucide-react";

export default async function AboutPage() {

   const testimonials = await getTestimonials();
  return (
    <div className="w-full overflow-x-hidden">
      
      {/* HEADER / NAVBAR */}
      <Header />

      {/* ABOUT SECTIONS */}
      <Section1 />
      <TestimonialsSection testimonials={testimonials}/>

      {/* ================= GET IN TOUCH SECTION ================= */}
      <section className="bg-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Heading */}
          <h2 className="text-3xl sm:text-4xl font-semibold text-gray-900 mb-10">
            Let’s Get in Touch
          </h2>

          {/* Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">

            {/* Left Content */}
            <div className="bg-[#F7F9FC] rounded-2xl p-8">
              <div className="flex items-start gap-4">
                
                <div className="w-12 h-12 rounded-full bg-[#DBA40D]/10 flex items-center justify-center text-[#DBA40D]">
                  <MapPin />
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    Location
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    SF-09, Ninex City Mart, Sector <br />
                    49, Shona Road, Gurgaon<br />
                    
                  </p>
                </div>

              </div>
            </div>

            {/* Right Content - Map */}
            <div className="w-full h-[162px] rounded-2xl overflow-hidden border">
              <iframe
                src="https://www.google.com/maps?q=Gurugram,Haryana&output=embed"
                width="100%"
                height="100%"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="border-0"
              />
            </div>

          </div>
        </div>
      </section>

      {/* FOOTER */}
      <Footer />
    </div>
  );
}
