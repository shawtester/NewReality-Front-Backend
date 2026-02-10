import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";

export const getBanner = async (category) => {
  const ref = doc(db, "banners", category);
  const snap = await getDoc(ref);

  if (snap.exists()) {
    return snap.data(); // image + introText + pageTitle
  }

  return null;
};
