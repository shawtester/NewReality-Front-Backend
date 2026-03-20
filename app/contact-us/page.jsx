import Navbar from "@/app/components/Header";
import ContactSection from "./components/contact";
import Faq from "./components/faq";
import TestimonialsSection from "@/app/about-us/components/Testimonial";
import { getTestimonials } from "@/lib/firestore/testimonials/read";
import Footer from "@/app/components/Footer";
import { getSEO } from "@/lib/firestore/seo/read";

/* ✅ PROFESSIONAL DYNAMIC SEO */
export async function generateMetadata() {
  const slug = "contact-us"; // 🔥 Must match Firestore document ID

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

  const baseUrl = "https://www.neevrealty.com";
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "name": "Neev Realty",
        "url": baseUrl,
        "logo": `${baseUrl}/logo.png`,
        "image": `${baseUrl}/logo.png`,
        "telephone": "+91-9999999999",
        "priceRange": "₹₹ - ₹₹₹",
        "contactPoint": {
          "@type": "ContactPoint",
          "telephone": "+91-9999999999",
          "contactType": "customer service",
          "areaServed": "IN",
          "availableLanguage": ["en", "hi"]
        }
      },
      {
        "@type": "LocalBusiness",
        "name": "Neev Realty",
        "image": `${baseUrl}/logo.png`,
        "telephone": "+91-9999999999",
        "email": "info@neevrealty.com",
        "priceRange": "₹₹ - ₹₹₹",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "Gurgaon",
          "addressLocality": "Gurgaon",
          "addressRegion": "Haryana",
          "postalCode": "122001",
          "addressCountry": "IN"
        },
        "url": `${baseUrl}/contact`
      }
    ]
  };

  return (
    <div>
      <Navbar />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <ContactSection />
      <Faq />
      <TestimonialsSection testimonials={testimonials} />
      <Footer />
    </div>
  );
}