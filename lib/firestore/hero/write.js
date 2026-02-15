import { db } from "@/lib/firebase";
import { doc, updateDoc, setDoc, getDoc } from "firebase/firestore";

export const updateHero = async (data) => {
  const ref = doc(db, "hero", "home");

  const snap = await getDoc(ref);

  if (snap.exists()) {
    // ✅ update only if document exists
    await updateDoc(ref, {
      mobileImages: data.mobileImages,
      desktopImages: data.desktopImages,
      videoUrl: data.videoUrl,
      mediaType: data.mediaType,
      updatedAt: new Date(),
    });
  } else {
    // ✅ create if not exists
    await setDoc(ref, {
      mobileImages: data.mobileImages || [],
      desktopImages: data.desktopImages || [],
      videoUrl: data.videoUrl || "",
      mediaType: data.mediaType || "youtube",
      updatedAt: new Date(),
    });
  }
};
