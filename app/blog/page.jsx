import BlogClient from "./BlogClient";
import { getSEO } from "@/lib/firestore/seo/read"; // ✅ SAME as Contact

export const dynamic = "force-dynamic"; // optional but safe

/* ✅ SAME PATTERN AS CONTACT PAGE */
export async function generateMetadata() {
  const slug = "blog"; // 🔥 Must match Firestore document ID

  try {
    const seo = await getSEO(slug);

    const title =
      seo?.title || "Blog | Neev Realty";

    const description =
      seo?.description ||
      "Latest real estate insights from Neev Realty.";

    const canonicalURL =
      seo?.canonical ||
      "https://www.neevrealty.com/blog";

    const keywords = Array.isArray(seo?.keywords)
      ? seo.keywords
      : seo?.keywords?.split(",").map((k) => k.trim()) || [
          "neev realty blog",
          "real estate blog gurgaon",
          "property insights india",
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
      title: "Blog | Neev Realty",
      description: "Latest real estate insights from Neev Realty.",
    };
  }
}

export default function BlogPage() {
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          {
             "@type": "ListItem",
             "position": 1,
             "name": "Home",
             "item": "https://www.neevrealty.com"
          },
          {
             "@type": "ListItem",
             "position": 2,
             "name": "Blog",
             "item": "https://www.neevrealty.com/blog"
          }
        ]
      },
      {
         "@type": "FAQPage",
         "mainEntity": [
           {
             "@type": "Question",
             "name": "What topics does the Neev Realty blog cover?",
             "acceptedAnswer": {
               "@type": "Answer",
               "text": "Our blog covers insights on Gurgaon real estate, property investment tips, and updates on luxury and commercial projects."
             }
           }
         ]
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <BlogClient />
    </>
  );
}