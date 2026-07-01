import { doc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export async function saveSEO(page, data) {
  try {
    if (!data) return;
    await setDoc(doc(db, "seo", page), data, { merge: true });
  } catch (err) {
    console.warn(`SEO save failed for ${page}:`, err.message);
    throw err;
  }
}
