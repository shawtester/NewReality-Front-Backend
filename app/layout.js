import localFont from "next/font/local";
import "./globals.css";
import Script from "next/script";
import dynamic from "next/dynamic";
import { NextUIProvider } from "@nextui-org/react";

/* ✅ DYNAMIC IMPORTS */
const Toaster = dynamic(() =>
  import("react-hot-toast").then((mod) => mod.Toaster),
  { ssr: false }
);
const Conditionalstickyicons = dynamic(
  () => import("@/app/components/Conditionalstickyicons"),
  { ssr: false }
);

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

/* ✅ FONTS */
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

/* ✅ METADATA (SAFE + SEO FIX) */
export const metadata = {
  title: "Neev Realty",
  description:
    "Neev Realty - Premium flats, apartments and commercial spaces in Gurgaon.",
  metadataBase: new URL("https://www.neevrealty.com"),

  // ✅ Google verification (no manual meta needed)
  verification: {
    google: "qehkTwAMVJUDTMNaCSLYCQKMVHOcK8QByWq2Ykwv9PY",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* ✅ SCHEMA JSON-LD (SAFE WAY) */}
        <Script
          id="schema-org"
          type="application/ld+json"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "Organization",
                  name: "Neev Realty",
                  url: "https://www.neevrealty.com",
                  logo: "https://www.neevrealty.com/logo.png",
                  image: "https://www.neevrealty.com/logo.png",
                  telephone: "+91-9999999999",
                  priceRange: "₹₹ - ₹₹₹",
                  contactPoint: [
                    {
                      "@type": "ContactPoint",
                      telephone: "+91-9999999999",
                      contactType: "sales",
                      areaServed: "IN",
                      availableLanguage: ["en", "hi"],
                    },
                  ],
                  sameAs: [
                    "https://www.facebook.com/neevrealty",
                    "https://www.instagram.com/neevrealty",
                    "https://twitter.com/neevrealty",
                    "https://www.linkedin.com/company/neevrealty",
                  ],
                },
                {
                  "@type": "WebSite",
                  url: "https://www.neevrealty.com/",
                  name: "Neev Realty",
                  potentialAction: {
                    "@type": "SearchAction",
                    target:
                      "https://www.neevrealty.com/search?q={search_term_string}",
                    "query-input": "required name=search_term_string",
                  },
                },
                {
                  "@type": "RealEstateAgent",
                  name: "Neev Realty",
                  url: "https://www.neevrealty.com",
                  image: "https://www.neevrealty.com/logo.png",
                  telephone: "+91-9999999999",
                  priceRange: "₹₹ - ₹₹₹",
                  address: {
                    "@type": "PostalAddress",
                    addressLocality: "Gurgaon",
                    addressRegion: "Haryana",
                    postalCode: "122001",
                    addressCountry: "IN",
                  },
                },
                {
                  "@type": "LocalBusiness",
                  name: "Neev Realty",
                  image: "https://www.neevrealty.com/logo.png",
                  url: "https://www.neevrealty.com",
                  telephone: "+91-9999999999",
                  priceRange: "₹₹ - ₹₹₹",
                  address: {
                    "@type": "PostalAddress",
                    addressLocality: "Gurgaon",
                    addressRegion: "Haryana",
                    postalCode: "122001",
                    addressCountry: "IN",
                  },
                },
              ],
            }),
          }}
        />

        {/* ✅ GOOGLE TAG MANAGER (HEAD SCRIPT SAFE) */}
        <Script
          id="gtm-head"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function(w,d,s,l,i){w[l]=w[l]||[];
              w[l].push({'gtm.start': new Date().getTime(),event:'gtm.js'});
              var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';
              j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;
              f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','GTM-M25MQ9BL');
            `,
          }}
        />

        {/* ✅ GTM NOSCRIPT (IMPORTANT - KEEP) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-M25MQ9BL"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>

        {/* ✅ UI */}
        <Toaster />

        <NextUIProvider>
          <main className="pt-[70px] min-[800px]:pt-[102px] min-h-screen">
            {children}
          </main>
        </NextUIProvider>

        <Conditionalstickyicons />
      </body>
    </html>
  );
}