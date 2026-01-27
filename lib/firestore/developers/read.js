"use client";

import { db } from "@/lib/firebase";
import { collection, doc, onSnapshot, query } from "firebase/firestore";
import useSWRSubscription from "swr/subscription";
import GlobalLoader from "@/lib/firestore/components/GlobalLoader";

/* ================= LIST ALL DEVELOPERS ================= */
export function useDevelopers() {
  const { data, error } = useSWRSubscription(
    ["developers"],
    ([path], { next }) => {
      const q = query(collection(db, path));

      const unsub = onSnapshot(
        q,
        (snap) => {
          const developers = snap.docs.map((d) => ({
            id: d.id,
            ...d.data(),
          }));

          next(null, developers);
        },
        (err) => next(err, null)
      );

      return () => unsub();
    }
  );

  return {
    data,
    error: error?.message || null,
    element: data === undefined ? <GlobalLoader /> : null, // 👈 loader inside hook
  };
}

/* ================= SINGLE DEVELOPER ================= */
export function useDeveloper({ id }) {
  const { data, error } = useSWRSubscription(
    id ? ["developers", id] : null,
    ([path, id], { next }) => {
      const ref = doc(db, path, id);

      const unsub = onSnapshot(
        ref,
        (snap) => {
          next(
            null,
            snap.exists()
              ? { id: snap.id, ...snap.data() }
              : null
          );
        },
        (err) => next(err, null)
      );

      return () => unsub();
    }
  );

  return {
    data,
    error: error?.message || null,
    element: data === undefined ? <GlobalLoader /> : null, // 👈 loader inside hook
  };
}

