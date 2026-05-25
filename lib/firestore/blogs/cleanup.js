import { db } from "@/lib/firebase";
import { collection, getDocs, deleteDoc, doc, query, where } from "firebase/firestore";

/**
 * Find and delete blogs with no title or empty title
 */
export const cleanupInvalidBlogs = async () => {
  try {
    console.log("Starting blog cleanup...");
    
    // Get all active blogs
    const snap = await getDocs(
      query(collection(db, "blogs"), where("isActive", "==", true))
    );

    const invalidBlogs = snap.docs.filter((doc) => {
      const data = doc.data();
      return !data.title || data.title.trim() === "" || data.title === "No title";
    });

    console.log(`Found ${invalidBlogs.length} invalid blogs to delete`);

    // Delete each invalid blog
    for (const blogDoc of invalidBlogs) {
      console.log(`Deleting blog: ${blogDoc.id} - "${blogDoc.data().title}"`);
      await deleteDoc(doc(db, "blogs", blogDoc.id));
    }

    console.log(`✅ Cleanup complete - Deleted ${invalidBlogs.length} invalid blogs`);
    return { deleted: invalidBlogs.length, ids: invalidBlogs.map(d => d.id) };
  } catch (error) {
    console.error("Cleanup error:", error);
    throw error;
  }
};
