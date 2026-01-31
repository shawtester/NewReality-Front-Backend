require("dotenv").config();

const algoliasearch = require("algoliasearch").default;
const { collection, getDocs } = require("firebase/firestore");
const { db } = require("./firebase.node");

const client = algoliasearch(
  process.env.NEXT_PUBLIC_ALGOLIA_APP_ID,
  process.env.ALGOLIA_ADMIN_KEY
);

const index = client.initIndex("properties");

async function pushData() {
  const snapshot = await getDocs(collection(db, "properties"));

  const records = snapshot.docs.map(doc => ({
    objectID: doc.id,
    ...doc.data(),
  }));

  await index.saveObjects(records);
  console.log("✅ Firestore data pushed to Algolia");
}

pushData().catch(console.error);


console.log(
  "ALGOLIA ENV:",
  process.env.NEXT_PUBLIC_ALGOLIA_APP_ID,
  process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_KEY
);

