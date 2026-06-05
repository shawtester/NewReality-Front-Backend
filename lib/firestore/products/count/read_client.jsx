"use client";

import { db } from "@/lib/firebase";
import {
  average,
  collection,
  count,
  getAggregateFromServer,
  getCountFromServer,
  query,
  where,
} from "firebase/firestore";
import useSWR from "swr";

export const getProductsCount = async () => {
  const ref = collection(db, `products`);
  const data = await getCountFromServer(ref);
  return data.data().count;
};

export const getBuilderProjectsCount = async (builderId) => {
  if (!builderId) return 0;
  const ref = collection(db, "properties");
  const q = query(ref, where("builderId", "==", builderId));
  const data = await getCountFromServer(q);
  return data.data().count;
};

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
