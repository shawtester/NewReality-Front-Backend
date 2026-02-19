import Navbar from "@/app/components/Header";
import ContactSection from "./components/contact";
import Faq from "./components/faq";
import TestimonialsSection from "@/app/about-us/components/Testimonial";
import { getTestimonials } from "@/lib/firestore/testimonials/read";
import Footer from "@/app/components/Footer";
import { getSEO } from "@/lib/firestore/seo/read";

// ✅ Dynamic SEO
export async function generateMetadata() {
  const slug = "contact"; // Firestore document ID

  try {
    const seo = await getSEO(slug);

    return {
      title: seo?.title || "Contact Us — Neev Realty",
      description:
        seo?.description ||
        "Get in touch with Neev Realty for property consultations, site visits, and real estate assistance in Gurgaon.",
      keywords:
        seo?.keywords ||
        "contact Neev Realty, real estate contact Gurgaon, property consultant Gurgaon",
      alternates: {
        canonical:
          seo?.canonical ||
          "https://yourdomain.com/contact",
      },
    };
  } catch (error) {
    return {
      title: "Contact Us — Neev Realty",
      description: "Contact Neev Realty for real estate services.",
    };
  }
}

export default async function ContactPage() {
  const testimonials = await getTestimonials();

  return (
    <div>
      <Navbar />
      <ContactSection />
      <Faq />
      <TestimonialsSection testimonials={testimonials} />
      <Footer />
    </div>
  );
}
