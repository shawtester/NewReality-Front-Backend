import Navbar from "@/app/components/Header";
import ContactSection from "./components/contact";
import Faq from "./components/faq";
import TestimonialsSection from "@/app/about-us/components/testimonial";
import Footer from "@/app/components/Footer";

export default function ContactPage() {
  return (
    <div>
      <Navbar />
      <ContactSection />
      <Faq />
      <TestimonialsSection />
      <Footer />
    </div>
  );
}
