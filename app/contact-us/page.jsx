import Navbar from "@/app/components/Header";
import ContactSection from "./components/contact";
import Faq from "./components/faq";
import TestimonialsSection from "@/app/about-us/components/Testimonial";
import { getTestimonials } from "@/lib/firestore/testimonials/read";
import Footer from "@/app/components/Footer";

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
