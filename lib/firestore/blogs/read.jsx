import { db } from "@/lib/firebase";
import {
  collection,
  getDocs,
  orderBy,
  query,
  doc,
  getDoc,
  where,
  limit,
} from "firebase/firestore";

/* ================= ADMIN BLOG LIST ================= */
export const getAdminBlogs = async () => {
  const q = query(
    collection(db, "blogs"),
    orderBy("timestampCreate", "desc")
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map((d) => ({
    id: d.id,
    ...d.data(),
    timestampCreate: d.data()?.timestampCreate?.seconds ?? null,
  }));
};

/* ================= HOME PAGE BLOGS ================= */
export const getBlogsForHome = async () => {
  const q = query(
    collection(db, "blogs"),
    where("isActive", "==", true),   // ✅ optional but recommended
    orderBy("timestampCreate", "desc"),
    limit(5)                         // ✅ home pe limited blogs
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map((d) => ({
    id: d.id,
    ...d.data(),
    timestampCreate: d.data()?.timestampCreate?.seconds ?? null,
  }));
};

/* ================= SINGLE BLOG BY ID ================= */
export const getBlogById = async ({ id }) => {
  if (!id) return null;

  const snap = await getDoc(doc(db, "blogs", id));

  if (!snap.exists()) return null;

  return {
    id: snap.id,
    ...snap.data(),
    timestampCreate: snap.data()?.timestampCreate?.seconds ?? null,
  };
};
