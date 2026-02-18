import { db } from "@/lib/firebase";
import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  Timestamp,
  query,
  where,
  getDocs,
} from "firebase/firestore";

/* ===================================================== */
/* ================= SLUG CHECK ======================== */
/* ===================================================== */

const ensureUniqueSlug = async (slug, currentId = null) => {
  const q = query(
    collection(db, "blogs"),
    where("slug", "==", slug)
  );

  const snap = await getDocs(q);

  if (snap.empty) return slug;

  const existing = snap.docs.find((d) => d.id !== currentId);
  if (!existing) return slug;

  let counter = 1;
  let newSlug = `${slug}-${counter}`;

  while (true) {
    const checkQuery = query(
      collection(db, "blogs"),
      where("slug", "==", newSlug)
    );

    const checkSnap = await getDocs(checkQuery);

    if (checkSnap.empty) break;

    counter++;
    newSlug = `${slug}-${counter}`;
  }

  return newSlug;
};

/* ===================================================== */
/* ================= CREATE BLOG ======================= */
/* ===================================================== */

export const createBlog = async ({ data }) => {

  if (!data) throw new Error("Blog data missing");

  if (data.image?.file) {
    delete data.image.file;
  }

  const title = data.mainTitle || data.title;

  if (!title?.trim()) throw new Error("Title required");
  if (!data?.slug?.trim()) throw new Error("Slug required");

  const newId = doc(collection(db, "blogs")).id;
  const finalSlug = await ensureUniqueSlug(data.slug.trim());

  const payload = {
    id: newId,

    title: title.trim(),
    mainTitle: title.trim(),
    detailHeading: data.detailHeading?.trim() || "",

    slug: finalSlug,
    excerpt: data.excerpt?.trim() || "",

    shortDescription: data.shortDescription || "",
    content: data.content || "",

    category: data.category || "",
    author: data.author || "",
    source: data.source || "",

    metaTitle: data.metaTitle || "",
    metaDescription: data.metaDescription || "",

    sections: data.sections || [],
    faqs: data.faqs || [],

    isActive: data.isActive ?? false,

    timestampCreate: Timestamp.now(),
    timestampUpdate: Timestamp.now(),
  };

  // ✅ Only add image if valid
  if (data.image?.url) {
    payload.image = {
      url: data.image.url,
      publicId: data.image.publicId || "",
    };
  } else {
    payload.image = null;
  }

  await setDoc(doc(db, "blogs", newId), payload);

  return newId;
};

/* ===================================================== */
/* ================= UPDATE BLOG ======================= */
/* ===================================================== */

export const updateBlog = async ({ id, data }) => {

  if (!id) throw new Error("Blog ID missing");
  if (!data) throw new Error("Blog data missing");

  if (data.image?.file) {
    delete data.image.file;
  }

  const title = data.mainTitle || data.title;

  if (!title?.trim()) throw new Error("Title required");
  if (!data?.slug?.trim()) throw new Error("Slug required");

  const finalSlug = await ensureUniqueSlug(
    data.slug.trim(),
    id
  );

  const updatePayload = {
    title: title.trim(),
    mainTitle: title.trim(),
    detailHeading: data.detailHeading?.trim() || "",

    slug: finalSlug,
    excerpt: data.excerpt?.trim() || "",

    shortDescription: data.shortDescription || "",
    content: data.content || "",

    category: data.category || "",
    author: data.author || "",
    source: data.source || "",

    metaTitle: data.metaTitle || "",
    metaDescription: data.metaDescription || "",

    sections: data.sections || [],
    faqs: data.faqs || [],

    isActive: data.isActive ?? false,

    timestampUpdate: Timestamp.now(),
  };

  // ✅ IMPORTANT: Only update image if new valid image exists
  if (data.image?.url) {
    updatePayload.image = {
      url: data.image.url,
      publicId: data.image.publicId || "",
    };
  }

  await setDoc(
    doc(db, "blogs", id),
    updatePayload,
    { merge: true }
  );

  return id;
};

/* ===================================================== */
/* ================= DELETE BLOG ======================= */
/* ===================================================== */

export const deleteBlog = async ({ id }) => {
  if (!id) throw new Error("Blog ID required");

  await deleteDoc(doc(db, "blogs", id));
};
