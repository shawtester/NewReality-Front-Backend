import { db } from "@/lib/firebase";
import {
  collection,
  doc,
  setDoc,
  Timestamp,
  deleteDoc,
  increment,
  updateDoc,
  getDoc,
} from "firebase/firestore";
import slugify from "slugify";
import { defaultProperty } from "@/constants/propertyDefaults";

/* ================= UTILS ================= */
const removeUndefined = (obj) => {
  if (Array.isArray(obj)) {
    return obj.map(removeUndefined).filter((v) => v !== undefined);
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

/* ================= SLUG HELPER ================= */
const generateSlug = (data) => {
  if (data.slug && data.slug.trim()) {
    return slugify(data.slug, {
      lower: true,
      strict: true,
    });
  }

  return slugify(data.title || "", {
    lower: true,
    strict: true,
  });
};

/* ================= CREATE PROPERTY ================= */
export const createNewProperty = async ({ data }) => {
  if (!data?.title) throw new Error("Project name is required");
  if (!data?.location) throw new Error("Location is required");

  const newId = doc(collection(db, "ids")).id;

  const slug = generateSlug(data);

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
    slug, // ✅ FINAL SLUG

    mainImage: safeMainImage,
    brochure: safeBrochure,

    timestampCreate: Timestamp.now(),
    timestampUpdate: null,
  });

  // ✅ SAVE PROPERTY
  await setDoc(doc(db, "properties", newId), payload);

  // 🔥 AUTO INCREMENT BUILDER TOTAL PROJECTS (ONLY ON CREATE)
  if (data.builderId) {
    await updateDoc(doc(db, "builders", data.builderId), {
      totalProjects: increment(1),
    });
  }
};

/* ================= UPDATE PROPERTY ================= */
export const updateProperty = async ({ data }) => {
  if (!data?.id) throw new Error("Property ID is required");

  const slug = generateSlug(data);

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

    slug, // ✅ ALWAYS UPDATE SLUG

    // 🔥 FORCE INCLUDE FLOOR PLANS
    floorPlans: Array.isArray(data.floorPlans)
      ? data.floorPlans
      : [],

    mainImage: safeMainImage,
    brochure: safeBrochure,

    timestampUpdate: Timestamp.now(),
  });

  await setDoc(
    doc(db, "properties", data.id),
    payload,
    { merge: true }
  );

  // ❌ UPDATE PE totalProjects KO TOUCH NAHI KARNA
};

/* ================= DELETE PROPERTY ================= */
export const deleteProperty = async ({ id }) => {
  if (!id) throw new Error("Property ID is required");

  const ref = doc(db, "properties", id);
  const snap = await getDoc(ref);

  if (!snap.exists()) return;

  const data = snap.data();

  // ❌ DELETE PROPERTY
  await deleteDoc(ref);

  // 🔥 AUTO DECREMENT BUILDER TOTAL PROJECTS
  if (data?.builderId) {
    await updateDoc(doc(db, "builders", data.builderId), {
      totalProjects: increment(-1),
    });
  }
};

