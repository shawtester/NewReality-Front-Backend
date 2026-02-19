import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export async function getSEO(page) {
  try {
    const docRef = doc(db, "seo", page);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? docSnap.data() : null;
  } catch (err) {
    console.error(`Failed to fetch SEO for ${page}:`, err.message);
    return null;
  }
}
