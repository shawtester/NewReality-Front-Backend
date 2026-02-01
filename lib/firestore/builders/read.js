"use client";

import { db } from "@/lib/firebase";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import useSWRSubscription from "swr/subscription";

export function useBuilders() {
  const { data, error } = useSWRSubscription(
    ["builders"],
    ([path], { next }) => {
      const q = query(
        collection(db, path),
        orderBy("createdAt", "desc")
      );

      const unsub = onSnapshot(
        q,
        (snap) =>
          next(null, snap.docs.map((d) => ({ id: d.id, ...d.data() }))),
        (err) => next(err, null)
      );

      return () => unsub();
    }
  );

  return {
    builders: data || [],
    isLoading: data === undefined,
    error,
  };
}
