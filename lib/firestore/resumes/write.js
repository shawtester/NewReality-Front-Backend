import { db } from "@/lib/firebase";
import { doc, deleteDoc } from "firebase/firestore";

export async function deleteResume(id) {
  const ref = doc(db, "resumes", id);
  await deleteDoc(ref);
}
