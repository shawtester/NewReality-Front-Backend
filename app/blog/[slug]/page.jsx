import { getBlogBySlug } from "@/lib/firestore/blogs/read";
import BlogDetailClient from "./BlogDetailClient";

/* ================= SEO METADATA ================= */
export async function generateMetadata({ params }) {
  const blog = await getBlogBySlug({ slug: params.slug });

  if (!blog) {
    return {
      title: "Blog Not Found",
      description: "This blog does not exist.",
    };
  }

  return {
    title: blog.metaTitle || blog.title,
    description: blog.metaDescription || blog.excerpt,
    keywords: blog.metaKeywords || "",
    alternates: {
      canonical: url, // ✅ THIS LINE
    },
    openGraph: {
      title: blog.metaTitle || blog.title,
      description: blog.metaDescription || blog.excerpt,
      images: blog.image?.url ? [blog.image.url] : [],
    },
  };
}

/* ================= PAGE ================= */
export default async function Page({ params }) {
  const blog = await getBlogBySlug({ slug: params.slug });

  return (
    <>
      {blog && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "Article",
                  "headline": blog.title,
                  "description": blog.metaDescription || blog.excerpt,
                  "image": blog.image?.url || "",
                  "author": {
                    "@type": "Organization",
                    "name": "Neev Realty",
                  },
                  "publisher": {
                    "@type": "Organization",
                    "name": "Neev Realty",
                  },
                  "mainEntityOfPage": `https://www.neevrealty.com/blog/${blog.slug}`,
                },
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
                    },
                    {
                      "@type": "ListItem",
                      "position": 3,
                      "name": blog.title,
                      "item": `https://www.neevrealty.com/blog/${blog.slug}`
                    }
                  ]
                },
                {
                  "@type": "FAQPage",
                  "mainEntity": [
                    {
                      "@type": "Question",
                      "name": "What is this real estate blog about?",
                      "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "This blog provides insights on real estate trends, property investment tips, and updates on premium properties in Gurgaon."
                      }
                    }
                  ]
                }
              ]
            }),
          }}
        />
      )}

      <BlogDetailClient params={params} />
    </>
  );
}