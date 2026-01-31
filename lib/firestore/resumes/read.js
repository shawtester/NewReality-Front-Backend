"use server";

import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import { cache } from "react";

export const getResumes = cache(async () => {
  try {
    console.log("🔍 Server fetching resumes...");
    const snapshot = await getDocs(collection(db, "send_resume"));
    console.log(`📊 Server found ${snapshot.docs.length} resumes`);
    
    const data = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    
    return { data };
  } catch (error) {
    console.error("💥 Server error:", error);
    return { error: error.message };
  }
});
