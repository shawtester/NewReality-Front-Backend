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
  { path: "/privacy-policy", priority: 0.5 },
  { path: "/terms-and-conditions", priority: 0.5 },
  { path: "/our-services", priority: 0.8 },
  { path: "/commercial-property-in-gurgaon", priority: 0.9 },
  { path: "/residential-property-in-gurgaon", priority: 0.9 },
  { path: "/blog", priority: 0.9 },
  { path: "/top-builders-in-gurgaon", priority: 0.9 },
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

  const docs = [
    "projects_by_budget",
    "projects_by_location",
    "projects_by_size",
    "projects_by_status",
    "property_by_type",
  ];

  const urls = [];

  for (const name of docs) {

    const snap = await db.collection("footer_links").doc(name).get();

    if (!snap.exists) continue;

    const data = snap.data();

    const links = data?.links || [];

    links.forEach((link) => {

      if (link?.value) {

        urls.push(
          formatEntry(`/${link.value}`, new Date(), 0.8)
        );

      }

    });

  }

  return urls;
}

/* ===============================
   Main Sitemap Function
================================ */
export default async function sitemap() {

  try {

    /* STATIC */
    const staticEntries = staticRoutes.map((route) =>
      formatEntry(route.path, new Date(), route.priority)
    );

    /* BLOGS */
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

    /* PROPERTIES */
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

    /* BUILDERS */
    const buildersSnapshot = await db.collection("builders").get();

    const builderEntries = buildersSnapshot.docs
      .filter((doc) => doc.data()?.isActive !== false)
      .map((doc) => {
        const data = doc.data();
        const slug = data.slug || doc.id;
        return formatEntry(
          `/builder/${slug}`,
          data.updatedAt?.toDate?.() || new Date(),
          0.8
        );
      });

    /* FOOTER LINKS */
    const footerEntries = await getFooterLinks();

    /* MERGE */
    const allEntries = [
      ...staticEntries,
      ...blogEntries,
      ...propertyEntries,
      ...builderEntries,
      ...footerEntries,
    ];

    /* REMOVE DUPLICATES AND KEEP THE HIGHEST PRIORITY ENTRY */
    const uniqueEntries = Array.from(
      allEntries.reduce((map, item) => {
        const existing = map.get(item.url);

        if (
          !existing ||
          item.priority > existing.priority ||
          (item.priority === existing.priority && item.lastModified > existing.lastModified)
        ) {
          map.set(item.url, item);
        }

        return map;
      }, new Map())
      .values()
    );

    /* SORT BY PRIORITY DESC, THEN BY URL ASC */
    uniqueEntries.sort((a, b) => {
      if (b.priority !== a.priority) return b.priority - a.priority;
      return a.url.localeCompare(b.url);
    });

    return uniqueEntries;

  } catch (error) {

    console.error("Sitemap error:", error);
    return [];

  }

}