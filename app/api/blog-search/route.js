export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q")?.toLowerCase();

    if (!q) return NextResponse.json([]);

    const snapshot = await getDocs(collection(db, "blogs"));

    const results = snapshot.docs
      .map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
      .filter((blog) =>
        blog.title?.toLowerCase().includes(q) ||
        blog.category?.toLowerCase().includes(q) ||
        blog.metaKeywords?.toLowerCase().includes(q) ||
        blog.excerpt?.toLowerCase().includes(q)
      )
      .slice(0, 10);

    return NextResponse.json(results);

  } catch (err) {
    console.error("BLOG SEARCH ERROR ❌", err);
    return NextResponse.json([], { status: 500 });
  }
}


