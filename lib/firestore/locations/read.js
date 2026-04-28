import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

export async function getActiveLocations() {
  try {
    const snapshot = await getDocs(collection(db, "locations"));

    return snapshot.docs
      .map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
      .filter((item) => item?.isActive !== false && item?.name && item?.slug)
      .sort((a, b) => a.name.localeCompare(b.name));
  } catch (error) {
    console.error("Locations fetch failed:", error);
    return [];
  }
}
