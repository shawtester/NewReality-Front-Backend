import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";

/* =====================================================
   🔥 SERVER – GET FOOTER SEO DATA BY SLUG
===================================================== */
export const getFooterSeoBySlug = async (slug) => {
  if (!slug) return null;

  try {
    const collections = [
      "projects_by_budget",
      "projects_by_location",
      "projects_by_size",
      "projects_by_status",
      "property_by_type",
    ];

    for (const col of collections) {
      const ref = doc(db, "footer_links", col);
      const snap = await getDoc(ref);

      if (!snap.exists()) continue;

      const data = snap.data();

      const found = data?.links?.find(
        (l) => l.value === slug
      );

      if (found) {
        return {
          metaTitle: found.metaTitle || "",
          metaDescription: found.metaDescription || "",
          metaKeywords: found.metaKeywords || "",
          heading: found.heading || "",
          description: found.description || "",
        };
      }
    }

    return null;
  } catch (error) {
    console.error("Error fetching footer SEO:", error);
    return null;
  }
};