"use client";

import { db } from "@/lib/firebase";
import {
  average,
  collection,
  count,
  getAggregateFromServer,
  getCountFromServer,
  getDocs,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import useSWR from "swr";
import useSWRSubscription from "swr/subscription";

export const getProductsCount = async () => {
  const ref = collection(db, `products`);
  const data = await getCountFromServer(ref);
  return data.data().count;
};

export const getBuilderProjectsCount = async (builderId) => {
  if (!builderId) return 0;
  const ref = collection(db, "properties");
  const q = query(ref, where("builderId", "==", builderId));
  const snap = await getDocs(q);
  return snap.docs.filter((doc) => doc.data()?.isActive !== false).length;
};

export function useActiveBuilderProjectCounts() {
  const { data, error } = useSWRSubscription(
    ["active_builder_project_counts"],
    (_, { next }) => {
      const unsub = onSnapshot(
        collection(db, "properties"),
        (snap) => {
          const counts = {};

          snap.docs.forEach((doc) => {
            const property = doc.data();
            if (!property?.builderId || property.isActive === false) return;
            counts[property.builderId] = (counts[property.builderId] || 0) + 1;
          });

          next(null, counts);
        },
        (err) => next(err, null)
      );

      return () => unsub();
    }
  );

  if (error) {
    console.log(error?.message);
  }

  return {
    counts: data || {},
    error,
    isLoading: data === undefined,
  };
}

export function useProductCount() {
  const { data, error, isLoading } = useSWR("products_count", (key) =>
    getProductsCount()
  );
  if (error) {
    console.log(error?.message);
  }
  return { data, error, isLoading };
}

export function useBuilderProjectCount(builderId) {
  const { data, error, isLoading } = useSWR(["builder_projects_count", builderId], () =>
    getBuilderProjectsCount(builderId)
  );
  if (error) {
    console.log(error?.message);
  }
  return { data, error, isLoading };
}
