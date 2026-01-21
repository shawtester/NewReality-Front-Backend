"use client";

import { db } from "@/lib/firebase";
import { collection, doc, onSnapshot } from "firebase/firestore";
import useSWRSubscription from "swr/subscription";

export function useAdmins() {
  const { data, error } = useSWRSubscription(
    ["admins"],
    ([path], { next }) => {
      const ref = collection(db, path);

      const unsub = onSnapshot(
        ref,
        (snapshot) =>
          next(
            null,
            snapshot.empty
              ? null
              : snapshot.docs.map((doc) => ({
                  id: doc.id,
                  ...doc.data(),
                }))
          ),
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

export function useAdmin({ email }) {
  const { data, error } = useSWRSubscription(
    email ? ["admins", email] : null,
    ([, email], { next }) => {
      const ref = doc(db, "admins", email);

      const unsub = onSnapshot(
        ref,
        (snapshot) =>
          next(null, snapshot.exists() ? snapshot.data() : null),
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
