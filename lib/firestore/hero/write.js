import { db } from "@/lib/firebase";
import { doc, setDoc } from "firebase/firestore";

export const updateHero = async (data) => {
  const ref = doc(db, "hero", "home");

  await setDoc(
    ref,
    {
      mobileImages: data.mobileImages || [],
      desktopImages: data.desktopImages || [],
      videoUrl: data.videoUrl || "",
      mediaType: data.mediaType || "youtube",
      updatedAt: new Date(),
    },
    { merge: true }
  );
};
