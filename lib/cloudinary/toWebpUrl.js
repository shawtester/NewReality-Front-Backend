export function toWebpUrl(url) {
  if (!url || typeof url !== "string") return url;
  if (!url.includes("res.cloudinary.com") || !url.includes("/upload/")) {
    return url;
  }

  const [urlWithoutQuery, queryString] = url.split("?");
  const webpPath = urlWithoutQuery.replace(
    /\.(jpe?g|png|avif)(?=$|\/)/i,
    ".webp"
  );
  const webpUrl = `${webpPath}${queryString ? `?${queryString}` : ""}`;

  if (webpUrl.includes("/upload/f_webp")) return webpUrl;

  return webpUrl.replace("/upload/", "/upload/f_webp,q_auto/");
}

/**
 * ✅ OPTIMIZED — Cloudinary responsive image with width + quality control
 * Serves properly sized WebP images instead of full-resolution originals
 */
export function toOptimizedUrl(url, width = 800) {
  if (!url || typeof url !== "string") return url;
  if (!url.includes("res.cloudinary.com") || !url.includes("/upload/")) {
    return url;
  }

  const [urlWithoutQuery, queryString] = url.split("?");

  // Remove any existing Cloudinary transforms
  const cleanUrl = urlWithoutQuery.replace(
    /\/upload\/[^/]+\//,
    "/upload/"
  );

  // Apply optimized transforms: WebP + good quality + width limit
  const optimized = cleanUrl.replace(
    "/upload/",
    `/upload/f_webp,q_auto:good,w_${width},c_limit/`
  );

  return `${optimized}${queryString ? `?${queryString}` : ""}`;
}

/**
 * ✅ HIGH QUALITY — For Hero Banners to avoid blur
 */
export function toHighQualityUrl(url) {
  if (!url || typeof url !== "string") return url;
  if (!url.includes("res.cloudinary.com") || !url.includes("/upload/")) {
    return url;
  }
  const [urlWithoutQuery, queryString] = url.split("?");
  const cleanUrl = urlWithoutQuery.replace(/\/upload\/[^/]+\//, "/upload/");
  const highQuality = cleanUrl.replace("/upload/", "/upload/f_webp,q_100/");
  return `${highQuality}${queryString ? `?${queryString}` : ""}`;
}
