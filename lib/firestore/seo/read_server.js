// lib/firestore/seo/read_server.js
import admin from "@/lib/firestore/admins/admin"; // Firebase Admin SDK initialized

export async function getSEOServer(pageSlug) {
  const docRef = admin.firestore().collection("seo").doc(pageSlug);
  const doc = await docRef.get();
  if (!doc.exists) return null;
  return doc.data();
}
