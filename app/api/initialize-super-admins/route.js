import { NextResponse } from "next/server";
import { db, auth } from "@/lib/firebase_admin";
import { Timestamp } from "firebase-admin/firestore";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const SUPER_ADMIN_EMAILS = [
  {
    email: "vivek.malik@neevrealty.com",
    name: "Vivek Malik",
  },
  {
    email: "shubhamsamchaudhary143@gmail.com",
    name: "Shubham Samchaudhary",
  },
];

const ADMIN_ACCESS_KEY = process.env.ADMIN_DATA_ACCESS_KEY || "Neev@2026";

export async function POST(request) {
  try {
    // Verify access key
    const authHeader = request.headers.get("authorization") || "";
    const token = authHeader.startsWith("Bearer ")
      ? authHeader.slice("Bearer ".length)
      : "";

    // Get the API key from body
    const body = await request.json().catch(() => ({}));
    const key = body?.key || "";

    if (key !== ADMIN_ACCESS_KEY) {
      return NextResponse.json(
        { success: false, message: "Invalid access key" },
        { status: 401 }
      );
    }

    const results = [];

    // Initialize super admins
    for (const superAdmin of SUPER_ADMIN_EMAILS) {
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
            message: "Super admin role updated",
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
            message: "Super admin created",
          });
        }
      } catch (error) {
        results.push({
          email: superAdmin.email,
          status: "error",
          message: error.message,
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: "Super admins initialization completed",
      results,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: error.message,
      },
      { status: 500 }
    );
  }
}
