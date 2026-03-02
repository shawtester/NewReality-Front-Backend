import { db } from "@/lib/firebase_admin";

const BASE_URL = "https://www.neevrealty.com";

/* ===============================
   Static Pages
================================ */
const staticRoutes = [
  { path: "/", priority: 1.0 },
  { path: "/about-us", priority: 0.8 },
  { path: "/contact-us", priority: 0.8 },
  { path: "/careers", priority: 0.7 },
  { path: "/disclaimer", priority: 0.5 },
  { path: "/faqs", priority: 0.7 },
  { path: "/privacy", priority: 0.5 },
  { path: "/terms-condition", priority: 0.5 },
  { path: "/our-services", priority: 0.8 },
  { path: "/commercial-property-in-gurgaon", priority: 0.9 },
  { path: "/residential-property-in-gurgaon", priority: 0.9 },
  { path: "/blog", priority: 0.9 },
  // ❌ removed "/residential" because duplicate/unused
];

/* ===============================
   Helper
================================ */
function formatEntry(path, lastModified = new Date(), priority = 0.7) {
  return {
    url: `${BASE_URL}${path}`,
    lastModified,
    priority,
  };
}

/* ===============================
   Main Sitemap Function
================================ */
export default async function sitemap() {
  console.log("SITEMAP RUNNING");

  try {
    /* ---------- Static ---------- */
    const staticEntries = staticRoutes.map((route) =>
      formatEntry(route.path, new Date(), route.priority)
    );

    /* ---------- Blogs (unique) ---------- */
    const blogsSnapshot = await db.collection("blogs").get();

    const blogMap = new Map();

    blogsSnapshot.docs.forEach((doc) => {
      const data = doc.data();
      const slug = data.slug || doc.id;

      if (!blogMap.has(slug)) {
        blogMap.set(
          slug,
          formatEntry(
            `/blog/${slug}`,
            data.updatedAt?.toDate?.() || new Date(),
            0.8
          )
        );
      }
    });

    const blogEntries = Array.from(blogMap.values());

    /* ---------- Properties (unique) ---------- */
    const propertiesSnapshot = await db.collection("properties").get();

    const propertyMap = new Map();

    propertiesSnapshot.docs.forEach((doc) => {
      const data = doc.data();
      const slug = data.slug || doc.id;

      if (!propertyMap.has(slug)) {
        propertyMap.set(
          slug,
          formatEntry(
            `/${slug}`, // keeping your root slug structure SAME
            data.updatedAt?.toDate?.() || new Date(),
            0.9
          )
        );
      }
    });

    const propertyEntries = Array.from(propertyMap.values());

    /* ---------- SEO Landing Pages (unique) ---------- */
    const seoSnapshot = await db.collection("seo").get();

    const seoMap = new Map();

    seoSnapshot.docs.forEach((doc) => {
      const slug = doc.id;

      if (!seoMap.has(slug)) {
        seoMap.set(
          slug,
          formatEntry(
            `/${slug}`,
            doc.data().updatedAt?.toDate?.() || new Date(),
            0.8
          )
        );
      }
    });

    const seoEntries = Array.from(seoMap.values());

    /* ---------- Merge & Final Deduplicate by Full URL ---------- */
    const allEntries = [
      ...staticEntries,
      ...blogEntries,
      ...propertyEntries,
      ...seoEntries,
    ];

    const uniqueEntries = Array.from(
      new Map(allEntries.map((item) => [item.url, item])).values()
    );

    return uniqueEntries;
  } catch (error) {
    console.error("Sitemap generation error:", error);
    return [];
  }
}