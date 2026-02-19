import localFont from "next/font/local";
import "./globals.css";
import { NextUIProvider } from "@nextui-org/react";
import { Toaster } from "react-hot-toast";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import StickyIcons from "@/app/components/StickyIcons";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata = {
  title: "Neev Realty | Best Real Estate Company in Gurgaon",
  description: " Neev Realty, the best real estate company in Gurugram, offers premium flats, apartments and commercial spaces. Visit our website to find your ideal property.",
    keywords: ['Neev Realty, best real estate company, real estate company in gurgaon, real estate in gurugram, Property in gurgaon'],
     canonical: 'https://www.neevrealty.com/ ',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Toaster />
        <NextUIProvider>
          {/* global offset for fixed navbar */}
          <main className="pt-[70px] min-[800px]:pt-[102px] min-h-screen">
            {children}
          </main>
</NextUIProvider>
        <StickyIcons />
      </body>
    </html>
  );
}
