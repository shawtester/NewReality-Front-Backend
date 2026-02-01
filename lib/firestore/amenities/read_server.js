import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";

export async function getAmenitiesByIds(ids = []) {
  if (!Array.isArray(ids) || ids.length === 0) return [];

  const results = await Promise.all(
    ids.map(async (item) => {
      // ✅ normalize ID
      const id =
        typeof item === "string"
          ? item
          : item?.id || item?.value || item?.amenityId;

      if (!id || typeof id !== "string") return null;

      const snap = await getDoc(doc(db, "amenities", id));

      return snap.exists()
        ? { id: snap.id, ...snap.data() }
        : null;
    })
  );

  return results.filter(Boolean);
}
