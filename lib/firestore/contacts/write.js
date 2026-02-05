import { db } from "@/lib/firebase";
import { doc, deleteDoc } from "firebase/firestore";

export async function deleteContact(id) {
  await deleteDoc(doc(db, "contacts", id));
}