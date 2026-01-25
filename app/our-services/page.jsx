import Navbar from "../components/Header";
import Footer from "../components/Footer";

import Hero from "./components/Hero";
import OurServices from "./components/OurServices";
import BigServices from "./components/BigServices";

export const metadata = {
  title: "Services — Neev Realty",
};

export default function OurServicesPage() {
  return (
    <main className="bg-white text-gray-900 overflow-x-hidden">

      {/* NAVBAR */}
      <Navbar />

      {/* PAGE CONTENT */}
      <section className="w-full">
        <div className="max-w-[1480px] mx-auto px-4 sm:px-6 lg:px-8">

          {/* 1️⃣ HERO */}
          <Hero />

          {/* 2️⃣ OUR SERVICES */}
          <OurServices />

          {/* 3️⃣ BIG SERVICES */}
          <BigServices />

        </div>
      </section>

      {/* FOOTER */}
      <Footer />

    </main>
  );
}
