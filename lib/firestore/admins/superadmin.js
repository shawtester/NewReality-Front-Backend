import { db } from "@/lib/firebase_admin";
import { Timestamp } from "firebase-admin/firestore";

// Initialize super admins in the database
export const initializeSuperAdmins = async () => {
  const superAdmins = [
    {
      email: "vivek.malik@neevrealty.com",
      name: "Vivek Malik",
    },
    {
      email: "shubhamsamchaudhary143@gmail.com",
      name: "Shubham Samchaudhary",
    },
  ];

  const results = [];

  for (const superAdmin of superAdmins) {
    try {
      const adminDoc = await db
        .collection("admins")
        .doc(superAdmin.email)
        .get();

      if (adminDoc.exists) {
        // Update existing admin to ensure they're super admin
        await db
          .collection("admins")
          .doc(superAdmin.email)
          .update({
            role: "superadmin",
            timestampUpdate: Timestamp.now(),
          });

        results.push({
          email: superAdmin.email,
          status: "updated",
        });
      } else {
        // Create new super admin
        await db
          .collection("admins")
          .doc(superAdmin.email)
          .set({
            email: superAdmin.email,
            name: superAdmin.name,
            role: "superadmin",
            imageURL:
              "https://via.placeholder.com/150?text=" +
              encodeURIComponent(superAdmin.name),
            id: superAdmin.email,
            timestampCreate: Timestamp.now(),
          });

        results.push({
          email: superAdmin.email,
          status: "created",
        });
      }
    } catch (error) {
      results.push({
        email: superAdmin.email,
        status: "error",
        error: error.message,
      });
    }
  }

  return results;
};

// Get all super admins
export const getSuperAdmins = async () => {
  try {
    const snapshot = await db
      .collection("admins")
      .where("role", "==", "superadmin")
      .get();

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    throw new Error(`Failed to fetch super admins: ${error.message}`);
  }
};

// Check if email is super admin
export const isSuperAdmin = async (email) => {
  try {
    const adminDoc = await db
      .collection("admins")
      .doc(email.toLowerCase())
      .get();

    if (adminDoc.exists) {
      const data = adminDoc.data();
      return data.role === "superadmin";
    }

    return false;
  } catch (error) {
    throw new Error(`Failed to check super admin status: ${error.message}`);
  }
};
