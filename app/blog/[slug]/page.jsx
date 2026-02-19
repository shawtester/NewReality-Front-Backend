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
    openGraph: {
      title: blog.metaTitle || blog.title,
      description: blog.metaDescription || blog.excerpt,
      images: blog.image?.url ? [blog.image.url] : [],
    },
  };
}

/* ================= PAGE ================= */
export default function Page({ params }) {
  return <BlogDetailClient params={params} />;
}
