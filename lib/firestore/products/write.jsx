import { db } from "@/lib/firebase";
import {
  collection,
  doc,
  setDoc,
  Timestamp,
  deleteDoc,
  updateDoc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import slugify from "slugify";

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

const removeEmpty = (obj) => {
  if (Array.isArray(obj)) {
    return obj.map(removeEmpty);
  }

  if (obj !== null && typeof obj === "object") {
    return Object.fromEntries(
      Object.entries(obj)
        .filter(([_, v]) => v !== "" && v !== undefined)
        .map(([k, v]) => [k, removeEmpty(v)])
    );
  }

  return obj;
};

const generateSlug = (data) => {
  const base =
    data?.slug?.trim() ||
    data?.title?.trim() ||
    `property-${Date.now()}`;

  return slugify(base, {
    lower: true,
    strict: true,
  });
};

const recalculateBuilderTotalProjects = async (builderId) => {
  if (!builderId) return;

  const q = query(
    collection(db, "properties"),
    where("builderId", "==", builderId)
  );
  const snap = await getDocs(q);
  const totalProjects = snap.docs.filter(
    (docSnap) => docSnap.data()?.isActive !== false
  ).length;

  await updateDoc(doc(db, "builders", builderId), {
    totalProjects,
  });
};

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

  const payload = removeEmpty(
    removeUndefined({
      ...data,
      slug,

      floorPlans: Array.isArray(data.floorPlans) ? data.floorPlans : [],

      mainImage: safeMainImage,
      brochure: safeBrochure,

      timestampUpdate: Timestamp.now(),
    })
  );

  await setDoc(doc(db, "properties", newId), payload, {
    merge: true,
  });

  if (data.builderId) {
    await recalculateBuilderTotalProjects(data.builderId);
  }
};

export const updateProperty = async ({ data }) => {
  if (!data?.id) throw new Error("Property ID is required");

  const existingSnap = await getDoc(doc(db, "properties", data.id));
  const previousBuilderId = existingSnap.exists()
    ? existingSnap.data()?.builderId
    : null;
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
    slug,
    floorPlans: Array.isArray(data.floorPlans) ? data.floorPlans : [],
    mainImage: safeMainImage,
    brochure: safeBrochure,
    timestampUpdate: Timestamp.now(),
  });

  await setDoc(doc(db, "properties", data.id), payload, {
    merge: true,
  });

  if (previousBuilderId && previousBuilderId !== data.builderId) {
    await recalculateBuilderTotalProjects(previousBuilderId);
  }

  if (data.builderId) {
    await recalculateBuilderTotalProjects(data.builderId);
  }
};

export const deleteProperty = async ({ id }) => {
  if (!id) throw new Error("Property ID is required");

  const ref = doc(db, "properties", id);
  const snap = await getDoc(ref);

  if (!snap.exists()) return;

  const data = snap.data();

  await deleteDoc(ref);

  if (data?.builderId) {
    await recalculateBuilderTotalProjects(data.builderId);
  }
};
