import { db } from "@/lib/firebase";
import { collection, getDocs, query, where, deleteDoc, doc } from "firebase/firestore";

export const getDashboardStats = async () => {
  try {
    // First, clean up any invalid blogs (no title)
    const allActiveBlogs = await getDocs(
      query(collection(db, "blogs"), where("isActive", "==", true))
    );

    const invalidBlogs = allActiveBlogs.docs.filter((doc) => {
      const data = doc.data();
      return !data.title || data.title.trim() === "" || data.title === "No title";
    });

    // Delete invalid blogs
    for (const blogDoc of invalidBlogs) {
      console.log(`🗑️ Deleting invalid blog: ${blogDoc.id}`);
      await deleteDoc(doc(db, "blogs", blogDoc.id));
    }

    if (invalidBlogs.length > 0) {
      console.log(`✅ Cleaned up ${invalidBlogs.length} invalid blogs`);
    }

    // Now fetch valid data
    const [propertiesSnap, blogsSnap, contactsSnap, brochureLeadsSnap] =
      await Promise.all([
        getDocs(collection(db, "properties")),
        getDocs(query(collection(db, "blogs"), where("isActive", "==", true))),
        getDocs(collection(db, "contacts")),
        getDocs(collection(db, "brochureLeads")),
      ]);

    console.log("=== BLOG COUNT ===");
    console.log("Total active blogs:", blogsSnap.size);
    console.log("=================");

    return {
      properties: propertiesSnap.size,
      blogs: blogsSnap.size,
      enquiries: contactsSnap.size + brochureLeadsSnap.size,
    };
  } catch (error) {
    console.error("Dashboard Stats Error:", error);
    return {
      properties: 0,
      blogs: 0,
      enquiries: 0,
    };
  }
};
