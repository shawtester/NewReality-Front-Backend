import { db } from "@/lib/firebase";
import {
  collection,
  addDoc,
  serverTimestamp,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";

// ➕ ADD
export async function addTestimonial(data) {
  await addDoc(collection(db, "testimonials"), {
    ...data,
    createdAt: serverTimestamp(),
  });
}

// ✏️ UPDATE
export async function updateTestimonial(id, data) {
  const ref = doc(db, "testimonials", id);
  await updateDoc(ref, data);
}

// ❌ DELETE
export async function deleteTestimonial(id) {
  await deleteDoc(doc(db, "testimonials", id));
}
