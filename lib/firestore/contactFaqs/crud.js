import { db } from "@/lib/firebase";
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  orderBy,
  query,
} from "firebase/firestore";

const faqRef = collection(db, "contactFaqs");

/* CREATE */
export const createFaq = async (data) => {
  await addDoc(faqRef, {
    ...data,
    createdAt: Date.now(),
  });
};

/* READ */
export const getFaqs = async () => {
  const q = query(faqRef, orderBy("createdAt", "desc"));
  const snap = await getDocs(q);

  return snap.docs.map((d) => ({
    id: d.id,
    ...d.data(),
  }));
};

/* UPDATE */
export const updateFaq = async (id, data) => {
  await updateDoc(doc(db, "contactFaqs", id), data);
};

/* DELETE */
export const deleteFaq = async (id) => {
  await deleteDoc(doc(db, "contactFaqs", id));
};
