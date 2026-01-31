"use client";

import { db } from "@/lib/firebase";
import {
  collection,
  doc,
  limit,
  onSnapshot,
  query,
  startAfter,
} from "firebase/firestore";
import useSWRSubscription from "swr/subscription";

/* ================= LIST ================= */
export function useProperties({ pageLimit = 10, lastSnapDoc }) {
  const { data, error } = useSWRSubscription(
    ["properties", pageLimit, lastSnapDoc],
    ([path, pageLimit, lastSnapDoc], { next }) => {
      let q = query(collection(db, path), limit(pageLimit));

      if (lastSnapDoc) {
        q = query(q, startAfter(lastSnapDoc));
      }

      const unsub = onSnapshot(
        q,
        (snap) =>
          next(null, {
            list: snap.docs.map((d) => d.data()),
            lastSnapDoc: snap.docs[snap.docs.length - 1] ?? null,
          }),
        (err) => next(err, null)
      );

      return () => unsub();
    }
  );

  return {
    data: data?.list,
    lastSnapDoc: data?.lastSnapDoc,
    error: error?.message,
    isLoading: data === undefined,
  };
}

/* ================= SINGLE ================= */
export function useProperty({ propertyId }) {
  const { data, error } = useSWRSubscription(
    propertyId ? ["properties", propertyId] : null,
    ([path, id], { next }) => {
      const ref = doc(db, `${path}/${id}`);

      const unsub = onSnapshot(
        ref,
        (snap) => next(null, snap.exists() ? snap.data() : null),
        (err) => next(err, null)
      );

      return () => unsub();
    }
  );

  return {
    data,
    error: error?.message,
    isLoading: data === undefined,
  };
}
