const SITE_URL = "https://www.neevrealty.com";
const DEFAULT_OG_IMAGE = "/images/neevlogo.png";

const getImageUrl = (image) => {
  if (!image) return null;
  if (typeof image === "string") return image.trim() || null;
  if (typeof image.url === "string") return image.url.trim() || null;
  if (typeof image.src === "string") return image.src.trim() || null;
  return null;
};

const toAbsoluteUrl = (url) => {
  const fallbackUrl = new URL(DEFAULT_OG_IMAGE, SITE_URL).toString();
  if (!url) return fallbackUrl;

  try {
    return new URL(url, SITE_URL).toString();
  } catch {
    return fallbackUrl;
  }
};

const toSocialImageUrl = (url) => {
  if (!url.includes("res.cloudinary.com") || !url.includes("/upload/")) {
    return url;
  }

  const [urlWithoutQuery, queryString] = url.split("?");
  const uploadMarker = "/upload/";
  const uploadIndex = urlWithoutQuery.indexOf(uploadMarker);
  const beforeUpload = urlWithoutQuery.slice(0, uploadIndex + uploadMarker.length);
  const afterUpload = urlWithoutQuery.slice(uploadIndex + uploadMarker.length);
  const parts = afterUpload.split("/");
  const firstPart = parts[0] || "";
  const hasTransform =
    firstPart.includes(",") ||
    /^(f|q|w|h|c|dpr|g|e|fl|r|ar|x|y|z|o|b|bo|co|cs|t)_/.test(firstPart);
  const imagePath = hasTransform ? parts.slice(1).join("/") : afterUpload;
  const jpgPath = imagePath.replace(/\.(webp|avif|png|jpe?g)(?=$|\/)/i, ".jpg");
  const transformed = `${beforeUpload}f_jpg,q_auto:good,w_1200,h_630,c_fill/${jpgPath}`;

  return `${transformed}${queryString ? `?${queryString}` : ""}`;
};

export const getPropertyOgImageUrl = (property) => {
  const candidates = [
    property?.ogImage,
    property?.mainImage,
    property?.featuredImage,
    property?.image,
    ...(Array.isArray(property?.gallery) ? property.gallery : []),
    ...(Array.isArray(property?.images) ? property.images : []),
    ...(Array.isArray(property?.imageList) ? property.imageList : []),
  ];

  return toSocialImageUrl(toAbsoluteUrl(candidates.map(getImageUrl).find(Boolean)));
};

const hasPropertyOgImage = (property) =>
  getPropertyOgImageUrl(property) !== toAbsoluteUrl(DEFAULT_OG_IMAGE);

export const getPropertyOgImage = (property) => {
  const url = getPropertyOgImageUrl(property);
  const isDefaultImage = url === toAbsoluteUrl(DEFAULT_OG_IMAGE);

  return {
    url,
    width: 1200,
    height: 630,
    alt: isDefaultImage ? "Neev Realty" : property?.title || "Property image",
  };
};

export const getListingOgImage = (properties = [], fallbackAlt = "Neev Realty") => {
  const propertyWithImage = properties.find(hasPropertyOgImage);
  const image = getPropertyOgImage(propertyWithImage);

  return image.url === toAbsoluteUrl(DEFAULT_OG_IMAGE)
    ? { ...image, alt: fallbackAlt }
    : image;
};
