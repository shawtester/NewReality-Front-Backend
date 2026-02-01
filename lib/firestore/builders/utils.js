import { db } from "@/lib/firebase";
import {
  collection,
  getDocs,
  query,
  where
} from "firebase/firestore";

export const calculateTotalProjects = async (builderId) => {
  const q = query(
    collection(db, "properties"),
    where("builderId", "==", builderId)
  );

  const snap = await getDocs(q);
  return snap.size; // 🔥 total count
};
