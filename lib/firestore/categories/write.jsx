import { db } from "@/lib/firebase";
import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  Timestamp,
} from "firebase/firestore";

/* ================= CREATE ================= */
export const createNewCategory = async ({ data }) => {
  if (!data?.name) throw new Error("Category name is required");
  if (!data?.slug) throw new Error("Slug is required");

  const newId = doc(collection(db, "ids")).id;

  const image = data.image?.url
    ? {
        url: data.image.url,
        publicId: data.image.publicId || null,
      }
    : null;

  await setDoc(doc(db, `categories/${newId}`), {
    id: newId,
    name: data.name,
    slug: data.slug,
    parent: data.parent || "Residential",
    image,
    timestampCreate: Timestamp.now(),
  });
};

/* ================= UPDATE ================= */
export const updateCategory = async ({ data }) => {
  if (!data?.id) throw new Error("Category ID is required");

  const image = data.image?.url
    ? {
        url: data.image.url,
        publicId: data.image.publicId || null,
      }
    : null;

  await setDoc(
    doc(db, `categories/${data.id}`),
    {
      name: data.name,
      slug: data.slug,
      parent: data.parent || "Residential",
      image,
      timestampUpdate: Timestamp.now(),
    },
    { merge: true }
  );
};

/* ================= DELETE (ONLY FIREBASE) ================= */
export const deleteCategory = async ({ id }) => {
  if (!id) throw new Error("Category ID is required");

  await deleteDoc(doc(db, `categories/${id}`));
};
