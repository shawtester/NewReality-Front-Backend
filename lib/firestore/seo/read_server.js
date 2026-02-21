// lib/firestore/seo/read_server.js

import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";

/* =====================================================
   🔹 SERVER – GET SEO PAGE BY SLUG
===================================================== */
export async function getSEOPage(slug) {
  if (!slug) return null;

  try {
    const ref = doc(db, "seoPages", slug);
    const snap = await getDoc(ref);

    if (!snap.exists()) return null;

    return snap.data();
  } catch (error) {
    console.error("Error fetching SEO page:", error);
    return null;
  }
}