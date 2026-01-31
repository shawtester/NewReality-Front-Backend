import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";

export const getHero = async () => {
  const ref = doc(db, "hero", "home");
  const snap = await getDoc(ref);

  if (!snap.exists()) return null;

  return snap.data();
};
