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

/* ===================================================== */
/* ================== NORMALIZER ======================= */
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

/* ===================================================== */
/* ================= ADMIN : ALL BLOGS ================= */
/* ===================================================== */

export const getAdminBlogs = async () => {
  const q = query(
    collection(db, "blogs"),
    orderBy("timestampCreate", "desc")
  );

  const snap = await getDocs(q);

  return snap.docs.map((d) =>
    normalizeBlogData({
      id: d.id,
      ...d.data(),
    })
  );
};

/* ===================================================== */
/* ================= HOME : PUBLISHED ================== */
/* ===================================================== */

export const getBlogsForHome = async () => {
  const q = query(
    collection(db, "blogs"),
    where("isActive", "==", true),
    orderBy("timestampCreate", "desc")
  );

  const snap = await getDocs(q);

  return snap.docs.map((d) =>
    normalizeBlogData({
      id: d.id,
      ...d.data(),
    })
  );
};

/* ===================================================== */
/* ============ BLOG BY SLUG (PUBLIC ONLY) ============= */
/* ===================================================== */

export const getBlogBySlug = async ({ slug }) => {
  if (!slug) return null;

  const q = query(
    collection(db, "blogs"),
    where("slug", "==", slug),
    where("isActive", "==", true), // only published
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

/* ===================================================== */
/* ============ BLOG BY SLUG (ADMIN SAFE) ============== */
/* ===================================================== */

export const getBlogBySlugAdmin = async ({ slug }) => {
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

/* ===================================================== */
/* ================ BLOG BY ID (ADMIN) ================= */
/* ===================================================== */

export const getBlogById = async ({ id }) => {
  if (!id) return null;

  const ref = doc(db, "blogs", id);
  const snap = await getDoc(ref);

  if (!snap.exists()) return null;

  return normalizeBlogData({
    id: snap.id,
    ...snap.data(),
  });
};

/* ===================================================== */
/* ================= FILTER BY CATEGORY ================= */
/* ===================================================== */

export const getBlogsByCategory = async ({ category }) => {
  if (!category) return [];

  const q = query(
    collection(db, "blogs"),
    where("category", "==", category),
    where("isActive", "==", true),
    orderBy("timestampCreate", "desc")
  );

  const snap = await getDocs(q);

  return snap.docs.map((d) =>
    normalizeBlogData({
      id: d.id,
      ...d.data(),
    })
  );
};

/* ===================================================== */
/* ================= FILTER BY AUTHOR =================== */
/* ===================================================== */

export const getBlogsByAuthor = async ({ author }) => {
  if (!author) return [];

  const q = query(
    collection(db, "blogs"),
    where("author", "==", author),
    where("isActive", "==", true),
    orderBy("timestampCreate", "desc")
  );

  const snap = await getDocs(q);

  return snap.docs.map((d) =>
    normalizeBlogData({
      id: d.id,
      ...d.data(),
    })
  );
};
