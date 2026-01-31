// lib/algoliaClient.js

const algoliasearch = require("algoliasearch");

const appId = process.env.NEXT_PUBLIC_ALGOLIA_APP_ID;
const searchKey = process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_KEY;

if (!appId || !searchKey) {
  throw new Error("❌ Algolia env variables missing");
}

const searchClient = algoliasearch(appId, searchKey);

module.exports = { searchClient };
