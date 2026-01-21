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

  const image = data.image?.url
    ? {
        url: data.image.url,
        publicId: data.image.publicId || null,
      }
    : null;

  await setDoc(doc(db, `blogs/${newId}`), {
    id: newId,
    title: data.title,
    slug: data.slug,
    excerpt: data.excerpt || "",
    content: data.content || "",
    image,
    isActive: true,
    timestampCreate: Timestamp.now(),
  });
};

/* ================= UPDATE ================= */
export const updateBlog = async ({ data }) => {
  if (!data?.id) throw new Error("Blog ID missing");

  const image = data.image?.url
    ? {
        url: data.image.url,
        publicId: data.image.publicId || null,
      }
    : null;

  await setDoc(
    doc(db, `blogs/${data.id}`),
    {
      title: data.title,
      slug: data.slug,
      excerpt: data.excerpt,
      content: data.content,
      image,
      timestampUpdate: Timestamp.now(),
    },
    { merge: true }
  );
};

/* ================= DELETE ================= */
export const deleteBlog = async ({ id }) => {
  if (!id) throw new Error("Blog ID required");
  await deleteDoc(doc(db, `blogs/${id}`));
};
