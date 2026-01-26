import { db } from "@/lib/firebase";
import {
  collection,
  getDocs,
  getDoc,
  query,
  where,
  orderBy,
  limit,
  doc,
} from "firebase/firestore";

/* ================= ADMIN ================= */
export const getAdminBlogs = async () => {
  const q = query(collection(db, "blogs"), orderBy("timestampCreate", "desc"));
  const snap = await getDocs(q);

  return snap.docs.map(d => ({
    id: d.id,
    ...d.data(),
    timestampCreate: d.data()?.timestampCreate?.seconds ?? null,
  }));
};

/* ================= BLOG LIST ================= */
export const getBlogsForHome = async () => {
  const q = query(
    collection(db, "blogs"),
    where("isActive", "==", true),
    orderBy("timestampCreate", "desc")
  );

  const snap = await getDocs(q);

  return snap.docs.map(d => ({
    id: d.id,
    ...d.data(),
    timestampCreate: d.data()?.timestampCreate?.seconds ?? null,
  }));
};

/* ================= BLOG BY SLUG ================= */
export const getBlogBySlug = async ({ slug }) => {
  const q = query(
    collection(db, "blogs"),
    where("slug", "==", slug),
    limit(1)
  );

  const snap = await getDocs(q);
  if (snap.empty) return null;

  const d = snap.docs[0];
  return {
    id: d.id,
    ...d.data(),
    timestampCreate: d.data()?.timestampCreate?.seconds ?? null,
  };
};
