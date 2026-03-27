import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";

export const getMonthlyEnquiries = async () => {
  try {
    const [contactsSnap, brochureSnap] = await Promise.all([
      getDocs(collection(db, "contacts")),
      getDocs(collection(db, "brochureLeads")),
    ]);

    const allDocs = [
      ...contactsSnap.docs,
      ...brochureSnap.docs,
    ];

    const monthMap = {
      Jan: 0,
      Feb: 0,
      Mar: 0,
      Apr: 0,
      May: 0,
      Jun: 0,
      Jul: 0,
      Aug: 0,
      Sep: 0,
      Oct: 0,
      Nov: 0,
      Dec: 0,
    };

    allDocs.forEach((doc) => {
      const data = doc.data();

      if (data.createdAt) {
        const date = data.createdAt.toDate();
        const month = date.toLocaleString("default", { month: "short" });

        if (monthMap[month] !== undefined) {
          monthMap[month]++;
        }
      }
    });

    return {
      labels: Object.keys(monthMap),
      data: Object.values(monthMap),
    };
  } catch (error) {
    console.error("Monthly Enquiries Error:", error);
    return {
      labels: [],
      data: [],
    };
  }
};