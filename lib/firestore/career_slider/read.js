import {
  collection,
  getDocs,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

const COLLECTION = "career_slider";

/* ADMIN */
export const getAllCareerSliderImages = async () => {
  const q = query(
    collection(db, COLLECTION),
    orderBy("order", "asc")
  );

  const snap = await getDocs(q);
  return snap.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};

/* FRONTEND */
export const getActiveCareerSliderImages = async () => {
  const q = query(
    collection(db, COLLECTION),
    where("isActive", "==", true),
    orderBy("order", "asc")
  );

  const snap = await getDocs(q);
  return snap.docs.map((doc) => doc.data().image);
};
