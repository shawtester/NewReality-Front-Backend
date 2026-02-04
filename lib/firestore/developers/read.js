"use client";

import { db } from "@/lib/firebase";
import {
  collection,
  doc,
  onSnapshot,
  query,
  limit,
  getDocsFromCache,
  getDocFromCache, // ⭐ IMPORTANT ADD
} from "firebase/firestore";
import useSWRSubscription from "swr/subscription";

/* =====================================================
   🔹 LIST ALL DEVELOPERS (FAST + SAFE)
===================================================== */
export function useDevelopers({ pageLimit = 20 } = {}) {
  const { data, error } = useSWRSubscription(
    ["developers", pageLimit],
    ([path, pageLimit], { next }) => {
      const q = query(collection(db, path), limit(pageLimit));

      // ⚡ CACHE FIRST
      getDocsFromCache(q)
        .then((snap) => {
          next(
            null,
            snap.docs.map((d) => ({ id: d.id, ...d.data() }))
          );
        })
        .catch(() => {});

      // 🔁 REALTIME
      const unsub = onSnapshot(
        q,
        (snap) =>
          next(
            null,
            snap.docs.map((d) => ({ id: d.id, ...d.data() }))
          ),
        (err) => next(err, null)
      );

      return () => unsub();
    }
  );

  return {
    data: data || [],
    error: error?.message || null,
    isLoading: data === undefined,
  };
}

/* =====================================================
   🔹 SINGLE DEVELOPER (EDIT PAGE)  ⭐ FIXED VERSION
===================================================== */
export function useDeveloper({ id }) {
  const { data, error } = useSWRSubscription(
    id ? ["developers", id] : null,
    ([path, id], { next }) => {
      const ref = doc(db, path, id);

      // ⭐ FIXED: single doc cache
      getDocFromCache(ref)
        .then((snap) => {
          if (snap.exists()) {
            next(null, { id: snap.id, ...snap.data() });
          }
        })
        .catch(() => {});

      // 🔁 REALTIME LISTENER
      const unsub = onSnapshot(
        ref,
        (snap) =>
          next(
            null,
            snap.exists()
              ? { id: snap.id, ...snap.data() }
              : null
          ),
        (err) => next(err, null)
      );

      return () => unsub();
    }
  );

  return {
    data,
    error: error?.message || null,
    isLoading: data === undefined,
  };
}
