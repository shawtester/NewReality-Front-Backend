import { db } from "@/lib/firebase";
import {
  collection,
  doc,           // 🔥 ADD THIS LINE
  setDoc,
  deleteDoc,
  Timestamp,
} from "firebase/firestore";

/* ================= CREATE ================= */
export const createBlog = async ({ data }) => {
  // 🔥 FIXED: Use mainTitle OR title
  const title = data.mainTitle || data.title;
  if (!title?.trim()) throw new Error("Title required");
  if (!data?.slug?.trim()) throw new Error("Slug required");

  // 🔥 FIXED: Import doc + proper ID generation
  const newId = doc(collection(db, "blogs")).id;  // Changed from "ids" to "blogs"

  await setDoc(doc(db, "blogs", newId), {
    id: newId,
    title: title.trim(),
    slug: data.slug.trim(),
    excerpt: data.excerpt?.trim() || "",
    image: data.image || null,
    sections: data.sections || [],
    isActive: true,
    timestampCreate: Timestamp.now(),
  });
};

/* ================= UPDATE ================= */
export const updateBlog = async ({ data }) => {
  const title = data.mainTitle || data.title;
  if (!data?.id) throw new Error("Blog ID missing");

  await setDoc(
    doc(db, "blogs", data.id),
    {
      title: title?.trim(),
      slug: data.slug?.trim(),
      excerpt: data.excerpt?.trim() || "",
      image: data.image || null,
      sections: data.sections || [],
      timestampUpdate: Timestamp.now(),
    },
    { merge: true }
  );
};

/* ================= DELETE ================= */
export const deleteBlog = async ({ id }) => {
  await deleteDoc(doc(db, "blogs", id));
};
