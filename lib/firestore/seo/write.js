import { doc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export async function saveSEO(page, data) {
  try {
    if (!data) return;
    await setDoc(doc(db, "seo", page), data, { merge: true });
  } catch (err) {
    // Log warning but don’t break for any page
    console.warn(`SEO save failed for ${page}:`, err.message);
  }
}
