import Navbar from "@/app/components/Header";
import Footer from "@/app/components/Footer";

export default function BlogLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
}
