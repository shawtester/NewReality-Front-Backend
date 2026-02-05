import { db } from "@/lib/firebase";
import { doc, setDoc, Timestamp } from "firebase/firestore";

export const updateBanner = async ({ category, image }) => {
  if (!category) throw new Error("Category missing");

  await setDoc(doc(db, "banners", category), {
    image: image || "",
    updatedAt: Timestamp.now(),
  });
};
