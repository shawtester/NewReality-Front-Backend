// lib/firestore/seo/read_server.js
import admin from "@/lib/firestore/admins/admin"; // Firebase Admin SDK initialized



const db = admin.firestore();

export async function getSEOPage(slug) {
  const doc = await db.collection("seoPages").doc(slug).get();

  if (!doc.exists) return null;

  return doc.data();
}
