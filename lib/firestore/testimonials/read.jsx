import { db } from "@/lib/firebase";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { unstable_noStore as noStore } from "next/cache";

export async function getTestimonials() {
  noStore(); // 🔥 disable caching

  const q = query(
    collection(db, "testimonials"),
    orderBy("createdAt", "desc")
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
}
