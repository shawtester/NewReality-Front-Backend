import { db } from "@/lib/firebase";
import { toWebpUrl } from "@/lib/cloudinary/toWebpUrl";
import { collection, doc, getDoc, getDocs, query, where, limit } from "firebase/firestore";

const timestampToMillis = (value) => {
  if (!value) return null;
  if (typeof value.toMillis === "function") return value.toMillis();
  if (typeof value.seconds === "number") return value.seconds * 1000;
  return value;
};

const serializeBuilder = (snap) => {
  const data = snap.data();

  return {
    id: snap.id,
    ...data,
    logo: data?.logo?.url
      ? { ...data.logo, url: toWebpUrl(data.logo.url) }
      : data?.logo || null,
    createdAt: timestampToMillis(data?.createdAt),
    updatedAt: timestampToMillis(data?.updatedAt),
  };
};

export async function getAllBuilders() {
  const snap = await getDocs(collection(db, "builders"));

  return snap.docs
    .map((docSnap) => serializeBuilder(docSnap))
    .filter((builder) => builder.isActive !== false)
    .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
}

export async function getBuilderById(id) {
  if (!id) return null;

  const snap = await getDoc(doc(db, "builders", id));
  if (!snap.exists()) return null;

  return serializeBuilder(snap);
}

export async function getBuilderBySlugOrId(slugOrId) {
  if (!slugOrId) return null;

  // First try to find by slug
  const q = query(
    collection(db, "builders"),
    where("slug", "==", slugOrId),
    limit(1)
  );
  const snap = await getDocs(q);

  if (!snap.empty) {
    return serializeBuilder(snap.docs[0]);
  }

  // Fallback to fetch by ID if not found by slug
  return await getBuilderById(slugOrId);
}
