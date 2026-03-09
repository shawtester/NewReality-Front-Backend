export async function getSEOServer(pageSlug) {
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const apiKey = process.env.FIREBASE_API_KEY; // client-side API key

  const url = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/seo/${pageSlug}?key=${apiKey}`;

  try {
    // ✅ IMPORTANT: no-store add kiya hai taaki Next.js metadata cache na kare
    const res = await fetch(url, { cache: "no-store" });

    if (!res.ok) {
      if (pageSlug === "residential" || pageSlug === "commercial") {
        console.warn(`SEO data not found for ${pageSlug}`);
      }
      return null;
    }

    const data = await res.json();

    // Firestore REST returns fields with type wrappers
    if (!data.fields) {
      if (pageSlug === "residential" || pageSlug === "commercial") {
        console.warn(`SEO fields missing for ${pageSlug}`);
      }
      return null;
    }

    const seo = {};

    for (const key in data.fields) {
      const field = data.fields[key];

      // ✅ handle normal string fields
      if (field.stringValue) {
        seo[key] = field.stringValue;
      }

      // ✅ handle array fields (like keywords)
      else if (field.arrayValue && field.arrayValue.values) {
        seo[key] = field.arrayValue.values.map((v) => v.stringValue);
      }

      else {
        seo[key] = null;
      }
    }

    return seo;

  } catch (err) {
    if (pageSlug === "residential" || pageSlug === "commercial") {
      console.warn(`Error fetching SEO for ${pageSlug}:`, err.message);
    } else {
      console.error("Error fetching SEO:", err);
    }
    return null;
  }
}