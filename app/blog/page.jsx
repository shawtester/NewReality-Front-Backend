import BlogClient from "./BlogClient";
import { getSEOServer } from "@/lib/firestore/seo/read_server_rest";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  const seo = await getSEOServer("blog");

  return {
    title: seo?.title || "Blog | Neev Realty",
    description:
      seo?.description ||
      "Latest real estate insights from Neev Realty.",
    alternates: {
      canonical:
        seo?.canonical ||
        "https://www.neevrealty.com/blog",
    },
  };
}

export default function BlogPage() {
  return <BlogClient />;
}