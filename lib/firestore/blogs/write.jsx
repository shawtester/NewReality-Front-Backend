import { db } from "@/lib/firebase";
import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  Timestamp,
} from "firebase/firestore";

/* ================= CREATE ================= */
export const createBlog = async ({ data }) => {
  if (!data?.title) throw new Error("Title is required");
  if (!data?.slug) throw new Error("Slug is required");

  const newId = doc(collection(db, "ids")).id;

  await setDoc(doc(db, "blogs", newId), {
    id: newId,
    title: data.title,
    slug: data.slug,
    excerpt: data.excerpt || "",
    content: data.content || "",
    image: data.image || null,
    faqs: data.faqs || [],
    isActive: true,
    timestampCreate: Timestamp.now(),
  });
};

/* ================= UPDATE ================= */
export const updateBlog = async ({ data }) => {
  if (!data?.id) throw new Error("Blog ID missing");

  await setDoc(
    doc(db, "blogs", data.id),
    {
      title: data.title,
      slug: data.slug,
      excerpt: data.excerpt,
      content: data.content,
      image: data.image || null,
      faqs: data.faqs || [],
      timestampUpdate: Timestamp.now(),
    },
    { merge: true }
  );
};

/* ================= DELETE ================= */
export const deleteBlog = async ({ id }) => {
  await deleteDoc(doc(db, "blogs", id));
};
