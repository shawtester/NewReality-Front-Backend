import { db } from "@/lib/firebase";
import {
  collection,
  doc,
  setDoc,
  Timestamp,
  deleteDoc,
} from "firebase/firestore";
import slugify from "slugify";
import { defaultProperty } from "@/constants/propertyDefaults";

/* ================= UTILS ================= */
const removeUndefined = (obj) => {
  if (Array.isArray(obj)) {
    return obj
      .map(removeUndefined)
      .filter((v) => v !== undefined);
  }

  if (obj !== null && typeof obj === "object") {
    return Object.fromEntries(
      Object.entries(obj)
        .filter(([_, v]) => v !== undefined)
        .map(([k, v]) => [k, removeUndefined(v)])
    );
  }

  return obj;
};

/* ================= CREATE PROPERTY ================= */
export const createNewProperty = async ({ data }) => {
  if (!data?.title) throw new Error("Project name is required");
  if (!data?.location) throw new Error("Location is required");

  const newId = doc(collection(db, "ids")).id;

  const slug =
    data.slug ||
    slugify(data.title, { lower: true, strict: true });

  const safeMainImage = {
    url: data.mainImage?.url || "",
    publicId: data.mainImage?.publicId || "",
  };

  const safeBrochure = data.brochure
    ? {
        url: data.brochure.url || "",
        name: data.brochure.name || "",
      }
    : null;

  const payload = removeUndefined({
    ...defaultProperty,
    ...data,
    id: newId,
    slug,
    mainImage: safeMainImage,
    brochure: safeBrochure,
    timestampCreate: Timestamp.now(),
    timestampUpdate: null,
  });

  await setDoc(doc(db, "properties", newId), payload, {
    merge: true,
  });
};

/* ================= UPDATE PROPERTY ================= */
export const updateProperty = async ({ data }) => {
  if (!data?.id) throw new Error("Property ID is required");

  const slug =
    data.slug ||
    slugify(data.title, { lower: true, strict: true });

  const safeMainImage = {
    url: data.mainImage?.url || "",
    publicId: data.mainImage?.publicId || "",
  };

  const safeBrochure = data.brochure
    ? {
        url: data.brochure.url || "",
        name: data.brochure.name || "",
      }
    : null;

  const payload = removeUndefined({
    ...data,

    // 🔥 FORCE INCLUDE FLOOR PLANS
    floorPlans: Array.isArray(data.floorPlans)
      ? data.floorPlans
      : [],

    slug,
    mainImage: safeMainImage,
    brochure: safeBrochure,
    timestampUpdate: Timestamp.now(),
  });

  await setDoc(
    doc(db, "properties", data.id),
    payload,
    { merge: true }
  );
};

/* ================= DELETE PROPERTY ================= */
export const deleteProperty = async ({ id }) => {
  if (!id) throw new Error("Property ID is required");
  await deleteDoc(doc(db, "properties", id));
};
