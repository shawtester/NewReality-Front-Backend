import { db } from "@/lib/firebase";
import {
  collection,
  getDocs,
  orderBy,
  query,
  doc,
  getDoc,
} from "firebase/firestore";

/* ================= ADMIN BLOG LIST ================= */
export const getAdminBlogs = async () => {
  const q = query(
    collection(db, "blogs"),
    orderBy("timestampCreate", "desc")
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => doc.data());
};

/* ================= SINGLE BLOG BY ID ================= */
export const getBlogById = async ({ id }) => {
  if (!id) return null;

  const snap = await getDoc(doc(db, `blogs/${id}`));
  return snap.exists() ? snap.data() : null;
};
