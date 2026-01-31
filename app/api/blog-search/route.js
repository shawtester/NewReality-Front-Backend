export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import algoliasearch from "algoliasearch";

const client = algoliasearch(
  process.env.NEXT_PUBLIC_ALGOLIA_APP_ID,
  process.env.ALGOLIA_ADMIN_KEY
);

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q");

    if (!q) return NextResponse.json([]);

    const { hits } = await client.searchSingleIndex({
      indexName: "blogs",
      searchParams: {
        query: q,
        hitsPerPage: 10,
      },
    });

    const formatted = hits.map((b) => ({
      ...b,
      id: b.objectID,
    }));

    return NextResponse.json(formatted);
  } catch (err) {
    console.error("BLOG SEARCH API ERROR ❌", err);
    return NextResponse.json([], { status: 500 });
  }
}


