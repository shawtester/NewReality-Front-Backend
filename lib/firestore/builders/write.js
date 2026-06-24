import { db } from "@/lib/firebase";
import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  Timestamp,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { buildBuilderSlug } from "./slug";

/* ============================
   🔹 HELPER: AUTO COUNT PROJECTS
============================ */
const calculateTotalProjects = async (builderId) => {
  const q = query(
    collection(db, "properties"),
    where("builderId", "==", builderId)
  );

  const snap = await getDocs(q);
  return snap.size; // 🔥 auto count
};

/* ============================
   🔹 CREATE BUILDER
============================ */
export const createBuilder = async ({ data }) => {
  const ref = doc(collection(db, "builders"));
  
  const generatedSlug = data.slug ? buildBuilderSlug(data.slug) : buildBuilderSlug(data.name);

  await setDoc(ref, {
    id: ref.id,
    name: data.name,
    slug: generatedSlug,
    description: data.description || "",

    logo: data.logo || null,

    // 🔹 ADMIN CONTROLLED
    establishedYear: data.establishedYear || null,
    ongoingProjects: data.ongoingProjects || 0,
    citiesPresent: data.citiesPresent || 0,

    // 🔹 SEO DATA
    metaTitle: data.metaTitle || "",
    metaDescription: data.metaDescription || "",

    // 🔥 ADMIN EDITABLE TOTAL
    manualTotalProjects: data.manualTotalProjects || 0,

    // 🔹 AUTO (initially 0)
    totalProjects: 0,

    isActive: true,
    createdAt: Timestamp.now(),
    updatedAt: null,
  });
};

/* ============================
   🔹 UPDATE BUILDER
============================ */
export const updateBuilder = async ({ id, data }) => {
  // 🔥 AUTO calculate total projects
  const totalProjects = await calculateTotalProjects(id);

  const payload = {
    ...data,

    // 🔥 FORCE AUTO FIELD (SYSTEM CONTROLLED)
    totalProjects,

    updatedAt: Timestamp.now(),
  };
  
  // If slug is provided, update it
  if (data.slug !== undefined) {
      payload.slug = data.slug ? buildBuilderSlug(data.slug) : buildBuilderSlug(data.name);
  }

  await setDoc(doc(db, "builders", id), payload, {
    merge: true,
  });
};

/* ============================
   🔹 DELETE BUILDER
============================ */
export const deleteBuilder = async ({ id }) => {
  await deleteDoc(doc(db, "builders", id));
};
