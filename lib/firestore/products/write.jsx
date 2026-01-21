import { db } from "@/lib/firebase";
import {
  collection,
  deleteDoc,
  doc,
  setDoc,
  Timestamp,
} from "firebase/firestore";
import slugify from "slugify";

/* =====================================================
   🔹 CREATE PROPERTY
===================================================== */
export const createNewProperty = async ({ data }) => {
  if (!data?.title) throw new Error("Project name is required");
  if (!data?.location) throw new Error("Location is required");

  const newId = doc(collection(db, "ids")).id;

  // ✅ AUTO SLUG (TITLE → SLUG)
  const slug =
    data.slug ||
    slugify(data.title, {
      lower: true,
      strict: true,
    });

  await setDoc(doc(db, "properties", newId), {
    id: newId,
    title: data.title,
    slug, // ✅ IMPORTANT

    location: data.location,
    developer: data.developer || "",
    areaRange: data.areaRange || "",
    reraNumber: data.reraNumber || "",
    lastUpdated: data.lastUpdated || "",

    configurations: data.configurations || [],
    priceRange: data.priceRange || "",

    // ✅ CLOUDINARY STRUCTURE
    image: data.image || null,
    mainImage: data.mainImage || null,
    gallery: data.gallery || [],

    overview: {
      title: data.overview?.title || "",
      subtitle: data.overview?.subtitle || "",
      description: data.overview?.description || "",
    },

    floorPlans: data.floorPlans || [],
    amenities: data.amenities || [],
    locationPoints: data.locationPoints || [],
    faq: data.faq || [],
    disclaimer: data.disclaimer || "",

    isNewLaunch: !!data.isNewLaunch,
    isTrending: !!data.isTrending,
    isActive: true,

    timestampCreate: Timestamp.now(),
  });
};

/* =====================================================
   🔹 UPDATE PROPERTY
===================================================== */
export const updateProperty = async ({ data }) => {
  // ✅ ENSURE SLUG ALWAYS EXISTS
  const slug =
    data.slug ||
    slugify(data.title, {
      lower: true,
      strict: true,
    });

  await setDoc(
    doc(db, "properties", data.id),
    {
      ...data,
      slug, // ✅ KEEP SLUG IN SYNC
      timestampUpdate: Timestamp.now(),
    },
    { merge: true }
  );
};

/* =====================================================
   🔹 DELETE PROPERTY
===================================================== */
export const deleteProperty = async ({ id }) => {
  await deleteDoc(doc(db, "properties", id));
};
