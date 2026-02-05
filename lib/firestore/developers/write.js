import { db } from "@/lib/firebase";
import {
  addDoc,
  collection,
  doc,
  updateDoc,
  deleteDoc,        // ✅ ADD THIS
  serverTimestamp,
} from "firebase/firestore";

/* ================= CREATE ================= */
export async function createDeveloper({ data }) {
  const cleanData = {
    title: data.title,
    totalProjects: data.totalProjects,
    isActive: data.isActive,
    createdAt: serverTimestamp(),
  };

  // ✅ logo only if valid
  if (data.logo?.url) {
    cleanData.logo = {
      url: data.logo.url,
      ...(data.logo.publicId && { publicId: data.logo.publicId }),
    };
  }

  await addDoc(collection(db, "developers"), cleanData);
}

/* ================= UPDATE ================= */
export async function updateDeveloper({ id, data }) {
  const ref = doc(db, "developers", id);

  const cleanData = {
    title: data.title,
    totalProjects: data.totalProjects,
    isActive: data.isActive,
    updatedAt: serverTimestamp(),
  };

  // ✅ logo only if valid
  if (data.logo?.url) {
    cleanData.logo = {
      url: data.logo.url,
      ...(data.logo.publicId && { publicId: data.logo.publicId }),
    };
  }

  await updateDoc(ref, cleanData);
}

/* ================= DELETE ================= */
export async function deleteDeveloper(id) {
  const ref = doc(db, "developers", id);
  await deleteDoc(ref);
}
