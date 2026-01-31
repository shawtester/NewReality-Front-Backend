import { db } from "@/lib/firebase";
import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  Timestamp,
} from "firebase/firestore";

/* ================= CREATE BLOG ================= */
export const createBlog = async ({ data }) => {
  // ✅ Support BOTH: mainTitle (new) & title (old)
  const title = data.mainTitle || data.title;

  if (!title?.trim()) throw new Error("Title required");
  if (!data?.slug?.trim()) throw new Error("Slug required");

  // ✅ Proper ID generation
  const newId = doc(collection(db, "blogs")).id;

  await setDoc(doc(db, "blogs", newId), {
    id: newId,

    // ✅ Store in consistent way
    title: title.trim(),
    mainTitle: title.trim(),
    detailHeading: data.detailHeading?.trim() || "",

    slug: data.slug.trim(),
    excerpt: data.excerpt?.trim() || "",
    image: data.image || null,
    sections: data.sections || [],

    isActive: true,
    timestampCreate: Timestamp.now(),
    timestampUpdate: Timestamp.now(),
  });

  return newId;
};

/* ================= UPDATE BLOG ================= */
export const updateBlog = async ({ data }) => {
  if (!data?.id) throw new Error("Blog ID missing");

  // ✅ Again support both fields
  const title = data.mainTitle || data.title;

  if (!title?.trim()) throw new Error("Title required");
  if (!data?.slug?.trim()) throw new Error("Slug required");

  await setDoc(
    doc(db, "blogs", data.id),
    {
      title: title.trim(),
      mainTitle: title.trim(),
      detailHeading: data.detailHeading?.trim() || "",

      slug: data.slug.trim(),
      excerpt: data.excerpt?.trim() || "",
      image: data.image || null,
      sections: data.sections || [],

      timestampUpdate: Timestamp.now(),
    },
    { merge: true }
  );

  return data.id;
};

/* ================= DELETE BLOG ================= */
export const deleteBlog = async ({ id }) => {
  if (!id) throw new Error("Blog ID required");
  await deleteDoc(doc(db, "blogs", id));
};
