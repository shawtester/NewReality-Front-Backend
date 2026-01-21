"use client";

import { db } from "@/lib/firebase";
import { collection, onSnapshot } from "firebase/firestore";
import useSWRSubscription from "swr/subscription";

export function useCategories() {
  const { data, error } = useSWRSubscription(
    ["categories"],
    ([path], { next }) => {
      const ref = collection(db, path);

      const unsub = onSnapshot(
        ref,
        (snapshot) => {
          const categories = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          next(null, categories);
        },
        (err) => {
          next(err.message, null);
        }
      );

      return () => unsub();
    }
  );

  return {
    data: data ?? [],
    error,
    isLoading: data === undefined,
  };
}
