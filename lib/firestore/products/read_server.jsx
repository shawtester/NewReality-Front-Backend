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
   🔹 ALL ACTIVE PROPERTIES (HOME PAGE)
===================================================== */
export async function getAllProperties() {
  const q = query(
    collection(db, "properties"),
    where("isActive", "==", true),
    orderBy("timestampCreate", "desc")
  );

  const snap = await getDocs(q);

  return snap.docs.map((d) => ({
    id: d.id,
    ...d.data(),
    // ✅ Next.js warning fix
    timestampCreate: d.data()?.timestampCreate?.seconds ?? null,
  }));
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

  return snap.docs.map((d) => ({
    id: d.id,
    ...d.data(),
    timestampCreate: d.data()?.timestampCreate?.seconds ?? null,
  }));
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

  return snap.docs.map((d) => ({
    id: d.id,
    ...d.data(),
    timestampCreate: d.data()?.timestampCreate?.seconds ?? null,
  }));
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

  const docSnap = snap.docs[0];

  return {
    id: docSnap.id,
    ...docSnap.data(),
    timestampCreate: docSnap.data()?.timestampCreate?.seconds ?? null,
  };
}

/* =====================================================
   🔹 FALLBACK: GET PROPERTY BY ID (SAFE)
===================================================== */
export async function getPropertyById(id) {
  if (!id) return null;

  const ref = doc(db, "properties", id);
  const snap = await getDoc(ref);

  if (!snap.exists()) return null;

  const data = snap.data();

  return {
    id: snap.id,
    ...data,
    timestampCreate: data?.timestampCreate?.seconds ?? null,
  };
}

/* =====================================================
   🔹 SAFE HELPER: GET PROPERTY BY SLUG OR ID
   (Client-side fallback utility)
===================================================== */
export async function getPropertyBySlugOrId(value) {
  if (!value) return null;

  // 1️⃣ Try slug
  let property = await getPropertyBySlug(value);

  // 2️⃣ Fallback to ID
  if (!property) {
    property = await getPropertyById(value);
  }

  return property;
}

