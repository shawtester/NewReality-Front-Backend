export async function getSEOServer(pageSlug) {
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const apiKey = process.env.FIREBASE_API_KEY; // client-side API key
  const url = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/seo/${pageSlug}?key=${apiKey}`;

  try {
    const res = await fetch(url);
    if (!res.ok) {
      if (pageSlug === "residential" || pageSlug === "commercial") {
        console.warn(`SEO data not found for ${pageSlug}`);
      }
      return null;
    }

    const data = await res.json();

    // Firestore REST returns fields with type wrappers, e.g., stringValue
    if (!data.fields) {
      if (pageSlug === "residential" || pageSlug === "commercial") {
        console.warn(`SEO fields missing for ${pageSlug}`);
      }
      return null;
    }

    const seo = {};
    for (const key in data.fields) {
      seo[key] = data.fields[key].stringValue;
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
