import localFont from "next/font/local";
import "./globals.css";
import Script from "next/script";
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
  title: "Neev Realty",
  description: "Create By Docs Readers",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Google Search Console Verification */}
        <meta
          name="google-site-verification"
          content="qehkTwAMVJUDTMNaCSLYCQKMVHOcK8QByWq2Ykwv9PY"
        />

        {/* Google Tag Manager */}
        <Script id="gtm-script" strategy="afterInteractive">
          {`
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id=GTM-M25MQ9BL'+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-M25MQ9BL');
          `}
        </Script>
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

