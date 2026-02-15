import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";

export const getHero = async () => {
  try {
    const ref = doc(db, "hero", "home"); // ✅ fixed doc id
    const snap = await getDoc(ref);

    if (!snap.exists()) return null;

    const data = snap.data();

    return {
      mobileImages: data.mobileImages || [],
      desktopImages: data.desktopImages || [],
      videoUrl: data.videoUrl || "",
      mediaType: data.mediaType || "youtube",
    };
  } catch (error) {
    console.error("Error fetching hero:", error);
    throw error;
  }
};
