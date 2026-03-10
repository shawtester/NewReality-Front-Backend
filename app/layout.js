import localFont from "next/font/local";
import "./globals.css";
import Script from "next/script";
import { NextUIProvider } from "@nextui-org/react";
import { Toaster } from "react-hot-toast";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Conditionalstickyicons from "@/app/components/Conditionalstickyicons";

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
  title: "Neev Realty",
  description:
    "Neev Realty - Premium flats, apartments and commercial spaces in Gurgaon.",
  keywords: [
    "Neev Realty",
    "real estate in gurgaon",
    "property in gurugram",
  ],
  metadataBase: new URL("https://www.neevrealty.com"),
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>

        {/* Schema JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "Organization",
                  "name": "Neev Realty",
                  "url": "https://www.neevrealty.com",
                  "logo": "https://www.neevrealty.com/logo.png",
                  "sameAs": []
                },
                {
                  "@type": "WebSite",
                  "url": "https://www.neevrealty.com/",
                  "name": "Neev Realty",
                  "potentialAction": {
                    "@type": "SearchAction",
                    "target": "https://www.neevrealty.com/search?q={search_term_string}",
                    "query-input": "required name=search_term_string"
                  }
                },
                {
                  "@type": "RealEstateAgent",
                  "name": "Neev Realty",
                  "url": "https://www.neevrealty.com",
                  "address": {
                    "@type": "PostalAddress",
                    "addressLocality": "Varanasi",
                    "addressRegion": "UP",
                    "addressCountry": "IN"
                  }
                },
                {
                  "@type": "LocalBusiness",
                  "name": "Neev Realty",
                  "image": "https://www.neevrealty.com/logo.png",
                  "address": {
                    "@type": "PostalAddress",
                    "addressLocality": "Varanasi",
                    "addressRegion": "UP",
                    "addressCountry": "IN"
                  }
                }
              ]
            })
          }}
        />

        {/* Google Search Console Verification */}
        <meta
          name="google-site-verification"
          content="qehkTwAMVJUDTMNaCSLYCQKMVHOcK8QByWq2Ykwv9PY"
        />

        {/* Google Tag Manager */}
        <Script
          id="gtm-head"
          strategy="beforeInteractive"
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

      </head>

      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >

        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-M25MQ9BL"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>

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

