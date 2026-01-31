import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

const COLLECTION = "career_slider";

export const addCareerSliderImage = async (data) => {
  return await addDoc(collection(db, COLLECTION), {
    ...data,
    createdAt: serverTimestamp(),
  });
};

export const updateCareerSliderImage = async (id, data) => {
  return await updateDoc(doc(db, COLLECTION, id), data);
};

export const deleteCareerSliderImage = async (id) => {
  return await deleteDoc(doc(db, COLLECTION, id));
};
