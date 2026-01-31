import { db } from "@/lib/firebase";
import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  Timestamp,
} from "firebase/firestore";

/* ================= CREATE ================= */
export const createJob = async ({ data }) => {
  if (!data?.title) throw new Error("Job title required");

  const id = doc(collection(db, "ids")).id;

  await setDoc(doc(db, "jobs", id), {
    id,
    title: data.title,
    location: data.location || "",
    type: data.type || "Full Time",
    experience: data.experience || "",
    description: data.description || "",
    isActive: true,
    createdAt: Timestamp.now(),
  });
};

/* ================= UPDATE ================= */
export const updateJob = async ({ data }) => {
  if (!data?.id) throw new Error("Job ID missing");

  await setDoc(
    doc(db, "jobs", data.id),
    {
      title: data.title,
      location: data.location,
      type: data.type,
      experience: data.experience,
      description: data.description,
      isActive: data.isActive,
      updatedAt: Timestamp.now(),
    },
    { merge: true }
  );
};

/* ================= DELETE ================= */
export const deleteJob = async ({ id }) => {
  if (!id) throw new Error("Job ID required");
  await deleteDoc(doc(db, "jobs", id));
};
