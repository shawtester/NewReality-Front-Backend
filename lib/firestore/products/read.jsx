"use client";

import { db } from "@/lib/firebase";
import {
  collection,
  onSnapshot,
  query,
  orderBy,
  limit,
  startAfter,
  where,
  getDocs,
  getDoc,
  doc,
} from "firebase/firestore";
import useSWRSubscription from "swr/subscription";

/* =====================================================
   🔹 CLIENT SIDE HOOK (ADMIN / REALTIME / PAGINATION)
===================================================== */
export function useProperties({ pageLimit = 10, lastSnapDoc = null } = {}) {
  const { data, error } = useSWRSubscription(
    ["properties", pageLimit, lastSnapDoc],
    ([_, pageLimit, lastSnapDoc], { next }) => {
      let q = query(
        collection(db, "properties"),
        orderBy("timestampCreate", "desc"),
        limit(pageLimit)
      );

      if (lastSnapDoc) {
        q = query(
          collection(db, "properties"),
          orderBy("timestampCreate", "desc"),
          startAfter(lastSnapDoc),
          limit(pageLimit)
        );
      }

      const unsub = onSnapshot(
        q,
        (snapshot) =>
          next(null, {
            items: snapshot.docs.map((d) => ({
              id: d.id,
              ...d.data(),
            })),
            lastSnapDoc:
              snapshot.docs[snapshot.docs.length - 1] ?? null,
          }),
        (err) => next(err, null)
      );

      return () => unsub();
    }
  );

  return {
    data: data?.items || [],
    lastSnapDoc: data?.lastSnapDoc || null,
    error: error?.message,
    isLoading: data === undefined,
  };
}

/* =====================================================
   🔹 SERVER SIDE – ALL ACTIVE PROPERTIES
===================================================== */
export async function getAllProperties({ pageLimit = 8 } = {}) {
  const q = query(
    collection(db, "properties"),
    where("isActive", "==", true),
    orderBy("timestampCreate", "desc"),
    limit(pageLimit)
  );

  const snap = await getDocs(q);
  return mapDocs(snap);
}

/* =====================================================
   🔹 SERVER – NEW LAUNCH
===================================================== */
export async function getNewLaunchProperties({ pageLimit = 6 } = {}) {
  const q = query(
    collection(db, "properties"),
    where("isActive", "==", true),
    where("isNewLaunch", "==", true),
    orderBy("timestampCreate", "desc"),
    limit(pageLimit)
  );

  const snap = await getDocs(q);
  return mapDocs(snap);
}

/* =====================================================
   🔹 SERVER – TRENDING
===================================================== */
export async function getTrendingProperties({ pageLimit = 6 } = {}) {
  const q = query(
    collection(db, "properties"),
    where("isActive", "==", true),
    where("isTrending", "==", true),
    orderBy("timestampCreate", "desc"),
    limit(pageLimit)
  );

  const snap = await getDocs(q);
  return mapDocs(snap);
}

/* =====================================================
   🔥 SERVER – GET PROPERTY BY SLUG OR ID (MOST IMPORTANT)
===================================================== */
export async function getPropertyBySlugOrId(slugOrId) {
  if (!slugOrId) return null;

  // 1️⃣ Try slug
  const q = query(
    collection(db, "properties"),
    where("slug", "==", slugOrId)
  );

  const snapBySlug = await getDocs(q);
  if (!snapBySlug.empty) {
    const d = snapBySlug.docs[0];
    return { id: d.id, ...d.data() };
  }

  // 2️⃣ Fallback → ID
  const ref = doc(db, "properties", slugOrId);
  const snapById = await getDoc(ref);

  if (snapById.exists()) {
    return { id: snapById.id, ...snapById.data() };
  }

  return null;
}

/* =====================================================
   🔹 HELPER
===================================================== */
function mapDocs(snap) {
  return snap.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
    timestampCreate: doc.data().timestampCreate?.seconds ?? null,
  }));
}
