require("dotenv").config({ path: ".env.local" });

const algoliasearch = require("algoliasearch"); // ✅ v4 syntax
const { db } = require("../lib/firebase_admin");

console.log("ENV CHECK 👉", {
  APP_ID: process.env.NEXT_PUBLIC_ALGOLIA_APP_ID,
  ADMIN_KEY: process.env.ALGOLIA_ADMIN_KEY,
});

const client = algoliasearch(
  process.env.NEXT_PUBLIC_ALGOLIA_APP_ID,
  process.env.ALGOLIA_ADMIN_KEY
);

const index = client.initIndex("properties"); // ✅ works in v4

async function sync() {
  try {
    const snapshot = await db.collection("properties").get();
    console.log("📦 Total properties:", snapshot.size);

    const records = snapshot.docs.map((doc) => ({
      objectID: doc.id,
      ...doc.data(),
    }));

    if (!records.length) {
      console.log("⚠️ No records found");
      return;
    }

    await index.saveObjects(records);
    console.log("✅ SYNC DONE");
  } catch (err) {
    console.error("❌ SYNC FAILED", err);
  }
}

sync();
