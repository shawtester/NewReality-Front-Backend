import { db } from "@/lib/firebase";
import {
  collection,
  addDoc,
  serverTimestamp,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";

/* ➕ ADD TESTIMONIAL */
export async function addTestimonial(data) {
  await addDoc(collection(db, "testimonials"), {
    name: data.name || "",
    role: data.role || "",
    quote: data.quote || "",
    avatar: data.avatar || "",
    rating: data.rating ?? 5,
    createdAt: serverTimestamp(),
  });
}

/* ✏️ UPDATE TESTIMONIAL */
export async function updateTestimonial(id, data) {
  const ref = doc(db, "testimonials", id);

  await updateDoc(ref, {
    name: data.name || "",
    role: data.role || "",
    quote: data.quote || "",
    avatar: data.avatar || "",
    rating: data.rating ?? 5,
  });
}

/* ❌ DELETE TESTIMONIAL */
export async function deleteTestimonial(id) {
  await deleteDoc(doc(db, "testimonials", id));
}
