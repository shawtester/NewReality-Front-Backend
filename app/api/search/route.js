export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { db } from "@/lib/firebase"; // tumhara firebase config
import { collection, getDocs } from "firebase/firestore";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q")?.toLowerCase();

    if (!q) return NextResponse.json([]);

    const snapshot = await getDocs(collection(db, "properties"));

    const results = snapshot.docs
      .map(doc => ({ id: doc.id, ...doc.data() }))
      .filter(item =>
        item.title?.toLowerCase().includes(q) ||
        item.location?.toLowerCase().includes(q)
      )
      .slice(0, 5);

    return NextResponse.json(results);

  } catch (err) {
    console.error("SEARCH ERROR ❌", err);
    return NextResponse.json([], { status: 500 });
  }
}
