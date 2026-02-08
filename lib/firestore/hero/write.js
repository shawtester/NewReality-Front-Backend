import { db } from "@/lib/firebase";
import { doc, setDoc, Timestamp } from "firebase/firestore";

export const updateHero = async (data) => {
  const ref = doc(db, "hero", "home");

  await setDoc(
    ref,
    {
      images: data.images || [],
      videoUrl: data.videoUrl || "",
      mediaType: data.mediaType || "youtube",
      updatedAt: Timestamp.now(),
    },
    { merge: true }
  );
};
