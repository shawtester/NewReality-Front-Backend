import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";

export async function getBuilderById(id) {
  if (!id) return null;

  const snap = await getDoc(doc(db, "builders", id));
  if (!snap.exists()) return null;

  return { id: snap.id, ...snap.data() };
}
