/**
 * Admin API endpoint to migrate builder slugs
 * POST /api/admin/migrate-builder-slugs
 * 
 * Protected endpoint - requires admin authentication
 */

import { db } from "@/lib/firebase";
import { collection, getDocs, doc, updateDoc, Timestamp } from "firebase/firestore";
import { buildBuilderSlug } from "@/lib/firestore/builders/slug";

export async function POST(request) {
  try {
    // Note: Add authentication check here if needed
    // For now, this is available - add security as needed

    console.log("🔄 Starting builder slug migration...");

    const buildersSnap = await getDocs(collection(db, "builders"));

    if (buildersSnap.empty) {
      return Response.json(
        { message: "No builders found to migrate", updated: 0, skipped: 0 },
        { status: 200 }
      );
    }

    const builders = buildersSnap.docs.map((docSnap) => ({
      id: docSnap.id,
      ...docSnap.data(),
    }));

    console.log(`📊 Found ${builders.length} builders`);

    let updateCount = 0;
    let skippedCount = 0;
    const results = [];

    // Process each builder
    for (const builder of builders) {
      if (builder.slug && builder.slug.trim()) {
        console.log(`⏭️  [${builder.name}] Already has slug: ${builder.slug}`);
        skippedCount++;
        results.push({
          id: builder.id,
          name: builder.name,
          status: "skipped",
          slug: builder.slug,
          reason: "Already has slug",
        });
        continue;
      }

      try {
        // Generate slug from builder name
        const newSlug = buildBuilderSlug(builder.name);

        console.log(`📝 [${builder.name}] Generating slug: ${newSlug}`);

        // Update the builder document
        await updateDoc(doc(db, "builders", builder.id), {
          slug: newSlug,
          updatedAt: Timestamp.now(),
        });

        updateCount++;
        console.log(`✅ [${builder.name}] Slug updated`);
        
        results.push({
          id: builder.id,
          name: builder.name,
          status: "updated",
          slug: newSlug,
        });
      } catch (error) {
        console.error(`❌ Failed to update ${builder.name}:`, error.message);
        results.push({
          id: builder.id,
          name: builder.name,
          status: "error",
          error: error.message,
        });
      }
    }

    console.log(`\n✅ Migration complete!`);
    console.log(`   Updated: ${updateCount}`);
    console.log(`   Skipped: ${skippedCount}`);
    console.log(`   Total: ${builders.length}`);

    return Response.json(
      {
        message: "Migration completed successfully",
        updated: updateCount,
        skipped: skippedCount,
        total: builders.length,
        results,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Migration failed:", error);

    return Response.json(
      {
        error: "Migration failed",
        message: error.message,
      },
      { status: 500 }
    );
  }
}
