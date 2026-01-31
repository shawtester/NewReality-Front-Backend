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

/* ================= ADMIN : ALL BLOGS ================= */
export const getAdminBlogs = async () => {
  const q = query(
    collection(db, "blogs"),
    orderBy("timestampCreate", "desc")
  );

  const snap = await getDocs(q);

  return snap.docs.map((d) => ({
    id: d.id,
    ...d.data(),
    timestampCreate: d.data()?.timestampCreate?.seconds ?? null,
  }));
};

/* ================= HOME : ACTIVE BLOGS ================= */
export const getBlogsForHome = async () => {
  const q = query(
    collection(db, "blogs"),
    where("isActive", "==", true),
    orderBy("timestampCreate", "desc")
  );

  const snap = await getDocs(q);

  return snap.docs.map((d) => ({
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

/* ================= BLOG BY ID (ADMIN EDIT) ================= */
export const getBlogById = async ({ id }) => {
  if (!id) return null;

  const ref = doc(db, "blogs", id);
  const snap = await getDoc(ref);

  if (!snap.exists()) return null;

  return {
    id: snap.id,
    ...snap.data(),
    timestampCreate: snap.data()?.timestampCreate?.seconds ?? null,
  };
};

/* ===================================================== */
/* ============== SAFE / CLIENT FRIENDLY =============== */
/* ===================================================== */

const normalizeBlogData = (data) => {
  if (!data) return null;

  return JSON.parse(
    JSON.stringify(data, (key, value) => {
      if (
        value &&
        typeof value === "object" &&
        value.seconds !== undefined &&
        value.nanoseconds !== undefined
      ) {
        return value.seconds;
      }
      return value;
    })
  );
};

/* ================= SAFE : BLOG BY SLUG ================= */
export const getBlogBySlugSafe = async ({ slug }) => {
  if (!slug) return null;

  const q = query(
    collection(db, "blogs"),
    where("slug", "==", slug),
    limit(1)
  );

  const snap = await getDocs(q);
  if (snap.empty) return null;

  const d = snap.docs[0];

  return normalizeBlogData({
    id: d.id,
    ...d.data(),
  });
};
