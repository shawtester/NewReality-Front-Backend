import localFont from "next/font/local";
import "./globals.css";
import Script from "next/script";
import dynamic from "next/dynamic";
import { NextUIProvider } from "@nextui-org/react";
import SchemaScript from "@/app/components/SchemaScript"; // ✅ NEW

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

/* ✅ METADATA */
export const metadata = {
  title: "Neev Realty",
  description:
    "Neev Realty - Premium flats, apartments and commercial spaces in Gurgaon.",
  metadataBase: new URL("https://www.neevrealty.com"),
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
        {/* ✅ GLOBAL SCHEMA (CONTROLLED VIA CLIENT COMPONENT) */}
        <SchemaScript />

        {/* ✅ GTM */}
        <Script
          id="gtm-head"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];
            w[l].push({'gtm.start': new Date().getTime(),event:'gtm.js'});
            var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';
            j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;
            f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-M25MQ9BL');`,
          }}
        />

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
          <main className="pt-[60px] min-[800px]:pt-[50px] min-h-screen">
            {children}
          </main>
        </NextUIProvider>

        <Conditionalstickyicons />
      </body>
    </html>
  );
}