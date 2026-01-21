/* =====================================================
   🔥 CLIENT + SERVER COMBINED FILE
   📁 lib/firestore/properties/read.jsx
===================================================== */

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
} from "firebase/firestore";
import useSWRSubscription from "swr/subscription";

/* =====================================================
   🔹 CLIENT SIDE HOOK (ADMIN / REALTIME / PAGINATION)
   ❌ ISKO TOUCH NAHI KIYA
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
   🔹 SERVER SIDE FETCH (HOME PAGE)
===================================================== */
export async function getAllProperties() {
  const q = query(
    collection(db, "properties"),
    where("isActive", "==", true),
    orderBy("timestampCreate", "desc")
  );

  const snap = await getDocs(q);

  return snap.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
    // ⚠️ timestamp plain object banaya (Next.js warning fix)
    timestampCreate: doc.data().timestampCreate?.seconds ?? null,
  }));
}

/* =====================================================
   🔹 SERVER: NEW LAUNCH PROPERTIES
===================================================== */
export async function getNewLaunchProperties() {
  const q = query(
    collection(db, "properties"),
    where("isActive", "==", true),
    where("isNewLaunch", "==", true),
    orderBy("timestampCreate", "desc")
  );

  const snap = await getDocs(q);

  return snap.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
    timestampCreate: doc.data().timestampCreate?.seconds ?? null,
  }));
}

/* =====================================================
   🔹 SERVER: TRENDING PROPERTIES
===================================================== */
export async function getTrendingProperties() {
  const q = query(
    collection(db, "properties"),
    where("isActive", "==", true),
    where("isTrending", "==", true),
    orderBy("timestampCreate", "desc")
  );

  const snap = await getDocs(q);

  return snap.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
    timestampCreate: doc.data().timestampCreate?.seconds ?? null,
  }));
}
