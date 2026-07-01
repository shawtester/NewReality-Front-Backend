/**
 * Migration script to generate and save slugs for existing builders
 * Run with: node scripts/migrate-builder-slugs.mjs
 */

import admin from 'firebase-admin';
import fs from 'fs';
import path from 'path';

// Load Firebase service account key
const serviceAccountPath = path.resolve('./serviceAccountKey.json');
if (!fs.existsSync(serviceAccountPath)) {
  console.error('❌ serviceAccountKey.json not found');
  process.exit(1);
}

const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

/**
 * Slugify helper (same as in slug.js)
 */
function slugify(text, options = {}) {
  const { lower = true, strict = true, trim = true } = options;
  
  let str = String(text || '').trim();
  if (trim) str = str.trim();
  
  str = str
    .toLowerCase()
    .replace(/\s+/g, '-')           // spaces to dashes
    .replace(/[^\w\-]/g, '')         // remove special chars
    .replace(/\-+/g, '-')            // collapse multiple dashes
    .replace(/^\-+|\-+$/g, '');      // trim dashes from ends
  
  return str || 'builder';
}

/**
 * Generate slug from builder name
 */
function buildBuilderSlug(value = '') {
  const normalized = slugify(String(value || '').trim(), {
    lower: true,
    strict: true,
    trim: true,
  });
  
  return normalized || 'builder';
}

/**
 * Main migration function
 */
async function migrateBuilderSlugs() {
  console.log('🔄 Starting builder slug migration...\n');

  try {
    const buildersSnap = await db.collection('builders').get();
    
    if (buildersSnap.empty) {
      console.log('✅ No builders found to migrate');
      process.exit(0);
    }

    const builders = buildersSnap.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    console.log(`📊 Found ${builders.length} builders\n`);

    let updateCount = 0;
    let skippedCount = 0;

    // Process each builder
    for (const builder of builders) {
      if (builder.slug && builder.slug.trim()) {
        console.log(`⏭️  [${builder.name}] Already has slug: ${builder.slug}`);
        skippedCount++;
        continue;
      }

      // Generate slug from builder name
      const newSlug = buildBuilderSlug(builder.name);
      
      console.log(`📝 [${builder.name}] Generating slug: ${newSlug}`);
      
      // Update the builder document
      await db.collection('builders').doc(builder.id).update({
        slug: newSlug,
        updatedAt: admin.firestore.Timestamp.now(),
      });

      updateCount++;
      console.log(`✅ [${builder.name}] Slug updated\n`);
    }

    console.log('\n' + '='.repeat(50));
    console.log(`🎉 Migration complete!`);
    console.log(`   Updated: ${updateCount}`);
    console.log(`   Skipped: ${skippedCount}`);
    console.log(`   Total: ${builders.length}`);
    console.log('='.repeat(50));

    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    process.exit(1);
  }
}

// Run migration
migrateBuilderSlugs();
