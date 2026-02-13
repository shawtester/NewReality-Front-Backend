export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import algoliasearch from "algoliasearch";

const client = algoliasearch(
  process.env.ALGOLIA_APP_ID,
  process.env.ALGOLIA_ADMIN_KEY
);

const index = client.initIndex("properties");

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q");

    console.log("SEARCH QUERY 👉", q); // DEBUG

    if (!q) return NextResponse.json([]);

    const { hits } = await index.search(q, {
      hitsPerPage: 5,
    });

    console.log("HITS 👉", hits.length); // DEBUG

    return NextResponse.json(hits);
  } catch (err) {
    console.error("ALGOLIA SEARCH ERROR ❌", err);
    return NextResponse.json([], { status: 500 });
  }
}
