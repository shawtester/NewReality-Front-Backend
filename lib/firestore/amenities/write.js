import { db } from "@/lib/firebase";
import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  Timestamp,
} from "firebase/firestore";

export const createAmenity = async ({ data }) => {
  const id = doc(collection(db, "amenities")).id;

  await setDoc(doc(db, "amenities", id), {
    ...data,
    id,
    isActive: true,
    timestampCreate: Timestamp.now(),
  });
};

export const updateAmenity = async ({ id, data }) => {
  await setDoc(
    doc(db, "amenities", id),
    {
      ...data,
      timestampUpdate: Timestamp.now(),
    },
    { merge: true }
  );
};

export const deleteAmenity = async ({ id }) => {
  await deleteDoc(doc(db, "amenities", id));
};
