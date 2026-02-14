import { algoliasearch } from "algoliasearch";

const client = algoliasearch(
  "2C573T6YDH",          // APP ID
  "3797eb60513b545aa62e909fc7a56266" // SEARCH KEY (public safe)
);

export const index = client.initIndex("properties");
