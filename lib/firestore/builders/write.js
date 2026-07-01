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

const calculateTotalProjects = async (builderId) => {
  const q = query(
    collection(db, "properties"),
    where("builderId", "==", builderId)
  );

  const snap = await getDocs(q);
  return snap.docs.filter((docSnap) => docSnap.data()?.isActive !== false).length;
};

export const createBuilder = async ({ data }) => {
  const ref = doc(collection(db, "builders"));
  const generatedSlug = data.slug
    ? buildBuilderSlug(data.slug)
    : buildBuilderSlug(data.name);

  await setDoc(ref, {
    id: ref.id,
    name: data.name,
    slug: generatedSlug,
    description: data.description || "",
    logo: data.logo || null,
    establishedYear: data.establishedYear || null,
    ongoingProjects: data.ongoingProjects || 0,
    citiesPresent: data.citiesPresent || 0,
    metaTitle: data.metaTitle || "",
    metaDescription: data.metaDescription || "",
    metaKeywords: data.metaKeywords || "",
    manualTotalProjects: data.manualTotalProjects || 0,
    totalProjects: 0,
    isActive: true,
    createdAt: Timestamp.now(),
    updatedAt: null,
  });
};

export const updateBuilder = async ({ id, data }) => {
  const totalProjects = await calculateTotalProjects(id);

  const payload = {
    ...data,
    totalProjects,
    updatedAt: Timestamp.now(),
  };

  if (data.slug !== undefined) {
    payload.slug = data.slug
      ? buildBuilderSlug(data.slug)
      : buildBuilderSlug(data.name);
  }

  await setDoc(doc(db, "builders", id), payload, {
    merge: true,
  });
};

export const deleteBuilder = async ({ id }) => {
  await deleteDoc(doc(db, "builders", id));
};
