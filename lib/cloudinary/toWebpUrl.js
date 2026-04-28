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
