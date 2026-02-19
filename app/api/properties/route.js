import { getAllProperties } from "@/lib/firestore/products/count/read_client";

export async function GET(req) {
  try {
    const allProperties = await getAllProperties(); // fetch both residential & commercial

    // Ensure we always get an array
    const properties = (allProperties || []).map((p) => ({
      title: p.title || "",
      type: p.type || "unknown", // default type if missing
      slug: p.slug || "",
    }));

    // Optional: log if no residential or commercial found
    const types = properties.map(p => p.type.toLowerCase());
    if (!types.includes("residential")) console.warn("No residential properties found");
    if (!types.includes("commercial")) console.warn("No commercial properties found");

    return new Response(JSON.stringify(properties), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Error fetching properties:", err);
    return new Response(JSON.stringify([]), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
