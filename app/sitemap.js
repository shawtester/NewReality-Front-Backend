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
  { path: "/residential", priority: 0.9 },
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

    /* ---------- Blogs ---------- */
    const blogsSnapshot = await db.collection("blogs").get();
    const blogEntries = blogsSnapshot.docs.map((doc) =>
      formatEntry(
        `/blog/${doc.data().slug || doc.id}`,
        doc.data().updatedAt?.toDate?.() || new Date(),
        0.8
      )
    );

    /* ---------- Properties (🔥 FIXED HERE) ---------- */
    const propertiesSnapshot = await db.collection("properties").get();
    const propertyEntries = propertiesSnapshot.docs.map((doc) =>
      formatEntry(
        `/${doc.data().slug || doc.id}`,   // ✅ DIRECT ROOT SLUG
        doc.data().updatedAt?.toDate?.() || new Date(),
        0.9
      )
    );

    /* ---------- Builders ---------- */
    const buildersSnapshot = await db.collection("builders").get();
    const builderEntries = buildersSnapshot.docs.map((doc) =>
      formatEntry(
        `/builder/${doc.data().slug || doc.id}`,
        doc.data().updatedAt?.toDate?.() || new Date(),
        0.7
      )
    );

    /* ---------- Locations ---------- */
    const locationsSnapshot = await db.collection("locations").get();
    const locationEntries = locationsSnapshot.docs.map((doc) =>
      formatEntry(
        `/location/${doc.data().slug || doc.id}`,
        doc.data().updatedAt?.toDate?.() || new Date(),
        0.7
      )
    );

    /* ---------- SEO Landing Pages ---------- */
    const seoSnapshot = await db.collection("seo").get();
    const seoEntries = seoSnapshot.docs.map((doc) =>
      formatEntry(
        `/${doc.id}`,
        doc.data().updatedAt?.toDate?.() || new Date(),
        0.8
      )
    );

    /* ---------- Jobs ---------- */
    const jobsSnapshot = await db.collection("jobs").get();
    const jobEntries = jobsSnapshot.docs.map((doc) =>
      formatEntry(
        `/careers/${doc.data().slug || doc.id}`,
        doc.data().updatedAt?.toDate?.() || new Date(),
        0.6
      )
    );

    return [
      ...staticEntries,
      ...blogEntries,
      ...propertyEntries,
      ...builderEntries,
      ...locationEntries,
      ...seoEntries,
      ...jobEntries,
    ];
  } catch (error) {
    console.error("Sitemap generation error:", error);
    return [];
  }
}

