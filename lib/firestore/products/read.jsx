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
  getDocsFromCache,
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

      // 🔥 REALTIME (admin only)
      const unsub = onSnapshot(
        q,
        (snapshot) =>
          next(null, {
            items: snapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
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
   🔹 SERVER SIDE FETCH (HOME PAGE) – FAST
===================================================== */
export async function getAllProperties({ pageLimit = 8 } = {}) {
  const q = query(
    collection(db, "properties"),
    where("isActive", "==", true),
    orderBy("timestampCreate", "desc"),
    limit(pageLimit)
  );

  try {
    // ⚡ CACHE FIRST
    const snap = await getDocsFromCache(q);
    return mapDocs(snap);
  } catch {
    // 🌐 NETWORK FALLBACK
    const snap = await getDocs(q);
    return mapDocs(snap);
  }
}

/* =====================================================
   🔹 SERVER: NEW LAUNCH (FAST)
===================================================== */
export async function getNewLaunchProperties({ pageLimit = 6 } = {}) {
  const q = query(
    collection(db, "properties"),
    where("isActive", "==", true),
    where("isNewLaunch", "==", true),
    orderBy("timestampCreate", "desc"),
    limit(pageLimit)
  );

  try {
    const snap = await getDocsFromCache(q);
    return mapDocs(snap);
  } catch {
    const snap = await getDocs(q);
    return mapDocs(snap);
  }
}

/* =====================================================
   🔹 SERVER: TRENDING (FAST)
===================================================== */
export async function getTrendingProperties({ pageLimit = 6 } = {}) {
  const q = query(
    collection(db, "properties"),
    where("isActive", "==", true),
    where("isTrending", "==", true),
    orderBy("timestampCreate", "desc"),
    limit(pageLimit)
  );

  try {
    const snap = await getDocsFromCache(q);
    return mapDocs(snap);
  } catch {
    const snap = await getDocs(q);
    return mapDocs(snap);
  }
}

/* =====================================================
   🔹 HELPER (DRY + FAST)
===================================================== */
function mapDocs(snap) {
  return snap.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
    timestampCreate: doc.data().timestampCreate?.seconds ?? null,
  }));
}
