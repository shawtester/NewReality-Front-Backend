import Navbar from "@/app/components/Header";
import ContactSection from "./components/contact";
import Faq from "./components/faq";
import TestimonialsSection from "@/app/about-us/components/Testimonial";
import { getTestimonials } from "@/lib/firestore/testimonials/read";
import Footer from "@/app/components/Footer";
import { getSEO } from "@/lib/firestore/seo/read";

/* ✅ PROFESSIONAL DYNAMIC SEO */
export async function generateMetadata() {
  const slug = "contact"; // 🔥 Must match Firestore document ID

  try {
    const seo = await getSEO(slug);

    const title =
      seo?.title || "Contact Us — Neev Realty";

    const description =
      seo?.description ||
      "Get in touch with Neev Realty for property consultations, site visits, and expert real estate assistance in Gurgaon.";

    const canonicalURL =
      seo?.canonical ||
      "https://www.neevrealty.com/contact";

    const keywords = Array.isArray(seo?.keywords)
      ? seo.keywords
      : seo?.keywords?.split(",").map((k) => k.trim()) || [
          "contact neev realty",
          "real estate contact gurgaon",
          "property consultant gurgaon",
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
      title: "Contact Us — Neev Realty",
      description:
        "Contact Neev Realty for property consultations and real estate services in Gurgaon.",
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