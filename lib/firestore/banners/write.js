import { db } from "@/lib/firebase";
import { doc, setDoc, Timestamp } from "firebase/firestore";

export const updateBanner = async ({
  category,
  images = [],
  imageLinks = {},    // 🔥 ADDED: imageLinks support
  introText = "",
  pageTitle = "",
}) => {
  if (!category) throw new Error("Category missing");

  // 🔥 VALIDATE HTML SIZE (Firestore 1MB limit)
  if (introText && introText.length > 500000) {
    throw new Error("Intro text too long (max 500KB)");
  }

  await setDoc(
    doc(db, "banners", category),
    {
      images,
      imageLinks,       // 🔥 NEW: Save image links
      introText,
      pageTitle,
      updatedAt: Timestamp.now(),
    },
    { merge: true }
  );
};
