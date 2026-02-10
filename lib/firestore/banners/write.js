import { db } from "@/lib/firebase";
import { doc, setDoc, Timestamp } from "firebase/firestore";

export const updateBanner = async ({
  category,
  image = "",
  introText = "",
  pageTitle = "",
}) => {
  if (!category) throw new Error("Category missing");

  await setDoc(
    doc(db, "banners", category),
    {
      image,
      introText,
      pageTitle, // ✅🔥 THIS WAS THE MISSING FIELD
      updatedAt: Timestamp.now(),
    },
    { merge: true }
  );
};
