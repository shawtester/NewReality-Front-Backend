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

function applyCloudinaryTransform(url, transform) {
  const [urlWithoutQuery, queryString] = url.split("?");
  const uploadMarker = "/upload/";
  const uploadIndex = urlWithoutQuery.indexOf(uploadMarker);

  if (uploadIndex === -1) return url;

  const beforeUpload = urlWithoutQuery.slice(
    0,
    uploadIndex + uploadMarker.length
  );
  const afterUpload = urlWithoutQuery.slice(uploadIndex + uploadMarker.length);
  const parts = afterUpload.split("/");
  const firstPart = parts[0] || "";
  const hasTransform =
    firstPart.includes(",") ||
    /^(f|q|w|h|c|dpr|g|e|fl|r|ar|x|y|z|o|b|bo|co|cs|t)_/.test(firstPart);

  const imagePath = hasTransform ? parts.slice(1).join("/") : afterUpload;
  const transformed = `${beforeUpload}${transform}/${imagePath}`;

  return `${transformed}${queryString ? `?${queryString}` : ""}`;
}

/**
 * Optimized Cloudinary image with width and quality control.
 */
export function toOptimizedUrl(url, width = 800) {
  if (!url || typeof url !== "string") return url;
  if (!url.includes("res.cloudinary.com") || !url.includes("/upload/")) {
    return url;
  }

  return applyCloudinaryTransform(url, `f_auto,q_auto:good,w_${width},c_limit`);
}

/**
 * HD hero banner delivery without sending the full original file.
 */
export function toHighQualityUrl(url, width = 1920) {
  if (!url || typeof url !== "string") return url;
  if (!url.includes("res.cloudinary.com") || !url.includes("/upload/")) {
    return url;
  }

  return applyCloudinaryTransform(url, `f_auto,q_100,w_${width},c_limit`);
}
