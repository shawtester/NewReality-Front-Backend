import { db } from "@/lib/firebase";
import {
  collection,
  getDocs,
  getDoc,
  query,
  orderBy,
  where,
  doc,
} from "firebase/firestore";

/* ================= ADMIN ================= */
export const getAdminJobs = async () => {
  const q = query(collection(db, "jobs"), orderBy("createdAt", "desc"));
  const snap = await getDocs(q);

  return snap.docs.map(d => ({
    id: d.id,
    ...d.data(),
  }));
};

/* ================= SINGLE JOB ================= */
export const getJobById = async ({ id }) => {
  if (!id) return null;
  const snap = await getDoc(doc(db, "jobs", id));
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() };
};

/* ================= PUBLIC ================= */
export const getJobs = async () => {
  const q = query(
    collection(db, "jobs"),
    where("isActive", "==", true),
    orderBy("createdAt", "desc")
  );

  const snap = await getDocs(q);

  return snap.docs.map(d => ({
    id: d.id,
    ...d.data(),
  }));
};
