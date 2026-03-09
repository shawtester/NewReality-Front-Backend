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
   Fetch Footer Links
================================ */
async function getFooterLinks() {

  const footerCollections = [
    "projects_by_location",
    "projects_by_budget",
    "projects_by_size",
    "projects_by_status",
    "property_by_type",
  ];

  const links = [];

  for (const col of footerCollections) {

    const snapshot = await db
      .collection("footer_links")
      .doc(col)
      .collection("items")
      .get()
      .catch(() => null);

    if (!snapshot) continue;

    snapshot.docs.forEach((doc) => {

      const data = doc.data();

      if (data?.value) {
        links.push(
          formatEntry(
            `/${data.value}`,
            new Date(),
            0.8
          )
        );
      }

    });

  }

  return links;
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

    const blogEntries = blogsSnapshot.docs.map((doc) => {

      const data = doc.data();
      const slug = data.slug || doc.id;

      return formatEntry(
        `/blog/${slug}`,
        data.updatedAt?.toDate?.() || new Date(),
        0.8
      );

    });

    /* ---------- Properties ---------- */
    const propertiesSnapshot = await db.collection("properties").get();

    const propertyEntries = propertiesSnapshot.docs.map((doc) => {

      const data = doc.data();
      const slug = data.slug || doc.id;

      return formatEntry(
        `/${slug}`,
        data.updatedAt?.toDate?.() || new Date(),
        0.9
      );

    });

    /* ---------- Footer Links ---------- */
    const footerEntries = await getFooterLinks();

    /* ---------- Merge ---------- */
    const allEntries = [
      ...staticEntries,
      ...blogEntries,
      ...propertyEntries,
      ...footerEntries,
    ];

    /* ---------- Remove Duplicate URLs ---------- */
    const uniqueEntries = Array.from(
      new Map(allEntries.map((item) => [item.url, item])).values()
    );

    console.log("Total URLs:", uniqueEntries.length);

    return uniqueEntries;

  } catch (error) {

    console.error("Sitemap generation error:", error);
    return [];

  }

}