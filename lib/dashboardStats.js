import { db } from "@/lib/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";

export const getDashboardStats = async () => {
  try {
    const [propertiesSnap, blogsSnap, contactsSnap, brochureLeadsSnap] =
      await Promise.all([
        getDocs(collection(db, "properties")),
        getDocs(query(collection(db, "blogs"), where("isActive", "==", true))),
        getDocs(collection(db, "contacts")),
        getDocs(collection(db, "brochureLeads")),
      ]);

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
