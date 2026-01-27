"use client";

import { useEffect, useState } from "react";
import { onSnapshot } from "firebase/firestore";

export function useCollectionSnapshot(queryRef) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onSnapshot(queryRef, (snapshot) => {
      const docs = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setData(docs);
      setLoading(false);
    });

    return () => unsub();
  }, [queryRef]);

  return { data, loading };
}
