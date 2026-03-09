// lib/firestore/seo/read_server.js

import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";

export async function getSEOServer(pageSlug) {
  try {
    const ref = doc(db, "seo", pageSlug);
    const snap = await getDoc(ref);

    if (!snap.exists()) {
      console.warn("SEO not found for:", pageSlug);
      return null;
    }

    return snap.data();

  } catch (error) {
    console.error("SEO fetch error:", error);
    return null;
  }
}