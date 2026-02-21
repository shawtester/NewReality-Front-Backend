import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";

import Section1 from "./components/section1";
import TestimonialsSection from "./components/Testimonial";
import { getTestimonials } from "@/lib/firestore/testimonials/read";
import { getSEO } from "@/lib/firestore/seo/read";
import { MapPin } from "lucide-react";

/* ✅ PROFESSIONAL DYNAMIC SEO */
export async function generateMetadata() {
  const slug = "about"; // 🔥 Must match Firestore document ID

  try {
    const seo = await getSEO(slug);

    const title = seo?.title || "About Us — Neev Realty";

    const description =
      seo?.description ||
      "Learn more about Neev Realty, a trusted real estate advisory in Gurgaon delivering expert property solutions.";

    const canonicalURL =
      seo?.canonical ||
      "https://www.neevrealty.com/about";

    const keywords = Array.isArray(seo?.keywords)
      ? seo.keywords
      : seo?.keywords?.split(",").map((k) => k.trim()) || [
          "about neev realty",
          "real estate gurgaon",
          "property consultants haryana",
        ];

    return {
      title,
      description,
      keywords,
      alternates: {
        canonical: canonicalURL,
      },
      openGraph: {
        title,
        description,
        url: canonicalURL,
        siteName: "Neev Realty",
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
      },
    };
  } catch (error) {
    return {
      title: "About Us — Neev Realty",
      description:
        "About Neev Realty — Trusted real estate advisory in Gurgaon.",
    };
  }
}

export default async function AboutPage() {
  const testimonials = await getTestimonials();

  return (
    <div className="w-full overflow-x-hidden">
      
      {/* HEADER / NAVBAR */}
      <Header />

      {/* ABOUT SECTIONS */}
      <Section1 />
      <TestimonialsSection testimonials={testimonials} />

      {/* GET IN TOUCH SECTION */}
      <section className="bg-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <h2 className="text-3xl sm:text-4xl font-semibold text-gray-900 mb-10">
            Let’s Get in Touch
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">

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
                    49, Shona Road, Gurgaon
                  </p>
                </div>

              </div>
            </div>

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