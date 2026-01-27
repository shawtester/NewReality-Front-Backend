import { db } from "@/lib/firebase";
import { collection, doc, setDoc, Timestamp } from "firebase/firestore";

export const submitResume = async ({ data }) => {
  const id = doc(collection(db, "ids")).id;

  await setDoc(doc(db, "job_applications", id), {
    id,
    ...data,
    createdAt: Timestamp.now(),
  });
};
