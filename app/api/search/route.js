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

    const result = await client.search([
      {
        indexName: "properties",
        query: q,
        params: {
          hitsPerPage: 5,
        },
      },
    ]);

    // 👇 Algolia response structure
    const hits = result.results[0].hits;

    return NextResponse.json(hits);
  } catch (err) {
    console.error("ALGOLIA SEARCH ERROR ❌", err);

    return NextResponse.json(
      {
        message: "Search failed",
        algoliaError: err?.message || err,
      },
      { status: 500 }
    );
  }
}
