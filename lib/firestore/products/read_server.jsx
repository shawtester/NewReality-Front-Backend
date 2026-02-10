import { db } from "@/lib/firebase";

import {
  collection,
  getDocs,
  getDoc,
  query,
  where,
  orderBy,
  doc,
  limit,
} from "firebase/firestore";

/* =====================================================
   🔹 SAFE SERIALIZER (🔥 IMPORTANT FIX)
===================================================== */
const serializeProperty = (d) => {
  const data = d.data();

  return {
    id: d.id,

    ...data,

    // ✅ FORCE brochure pass (Next.js nested object fix)
    brochure: data?.brochure
      ? {
          url: data.brochure.url || "",
          name: data.brochure.name || "",
        }
      : null,

    // ✅ Timestamp safe
    timestampCreate: data?.timestampCreate?.seconds ?? null,
  };
};

/* =====================================================
   🔹 ALL ACTIVE PROPERTIES (HOME PAGE)
===================================================== */
export async function getAllProperties() {
  const q = query(
    collection(db, "properties"),
    where("isActive", "==", true),
    orderBy("timestampCreate", "desc")
  );

  const snap = await getDocs(q);

  return snap.docs.map((d) => serializeProperty(d));
}

/* =====================================================
   🔹 NEW LAUNCH PROPERTIES
===================================================== */
export async function getNewLaunchProperties() {
  const q = query(
    collection(db, "properties"),
    where("isActive", "==", true),
    where("isNewLaunch", "==", true),
    orderBy("timestampCreate", "desc")
  );

  const snap = await getDocs(q);

  return snap.docs.map((d) => serializeProperty(d));
}

/* =====================================================
   🔹 TRENDING PROPERTIES
===================================================== */
export async function getTrendingProperties() {
  const q = query(
    collection(db, "properties"),
    where("isActive", "==", true),
    where("isTrending", "==", true),
    orderBy("timestampCreate", "desc")
  );

  const snap = await getDocs(q);

  return snap.docs.map((d) => serializeProperty(d));
}

/* =====================================================
   🔹 GET SINGLE PROPERTY BY SLUG (DETAIL PAGE)
===================================================== */
export async function getPropertyBySlug(slug) {
  if (!slug) return null;

  const q = query(
    collection(db, "properties"),
    where("slug", "==", slug),
    where("isActive", "==", true),
    limit(1)
  );

  const snap = await getDocs(q);

  if (snap.empty) return null;

  return serializeProperty(snap.docs[0]);
}

/* =====================================================
   🔹 FALLBACK: GET PROPERTY BY ID (SAFE)
===================================================== */
export async function getPropertyById(id) {
  if (!id) return null;

  const ref = doc(db, "properties", id);
  const snap = await getDoc(ref);

  if (!snap.exists()) return null;

  return serializeProperty(snap);
}

/* =====================================================
   🔹 SAFE HELPER: GET PROPERTY BY SLUG OR ID
===================================================== */
export async function getPropertyBySlugOrId(value) {
  if (!value) return null;

  let property = await getPropertyBySlug(value);

  if (!property) {
    property = await getPropertyById(value);
  }

  return property;
}
