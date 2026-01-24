import { db } from "@/lib/firebase";
import { doc, setDoc, Timestamp } from "firebase/firestore";

export const updateHero = async ({ data }) => {
  await setDoc(
    doc(db, "hero", "home"),
    {
      image: data.image || null,
      videoUrl: data.videoUrl || "",
      updatedAt: Timestamp.now(),
    },
    { merge: true }
  );
};
