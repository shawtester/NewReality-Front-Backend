import { db } from "@/lib/firebase";
import {
  collection,
  onSnapshot,
  query,
  orderBy,
} from "firebase/firestore";
import useSWRSubscription from "swr/subscription";

export function useAmenities() {
  const { data, error } = useSWRSubscription(
    ["amenities"],
    ([path], { next }) => {
      const q = query(
        collection(db, path),
        orderBy("name", "asc")
      );

      const unsub = onSnapshot(
        q,
        (snap) =>
          next(
            null,
            snap.docs.map((d) => ({
              id: d.id,
              ...d.data(),
            }))
          ),
        (err) => next(err, null)
      );

      return () => unsub();
    }
  );

  return {
    amenities: data || [],
    isLoading: data === undefined,
    error,
  };
}
