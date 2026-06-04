const DEFAULT_OG_IMAGE = "/images/neevlogo.png";

const getImageUrl = (image) => {
  if (!image) return null;
  if (typeof image === "string") return image.trim() || null;
  if (typeof image.url === "string") return image.url.trim() || null;
  if (typeof image.src === "string") return image.src.trim() || null;
  return null;
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

  return candidates.map(getImageUrl).find(Boolean) || DEFAULT_OG_IMAGE;
};

const hasPropertyOgImage = (property) =>
  getPropertyOgImageUrl(property) !== DEFAULT_OG_IMAGE;

export const getPropertyOgImage = (property) => {
  const url = getPropertyOgImageUrl(property);
  const isDefaultImage = url === DEFAULT_OG_IMAGE;

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

  return image.url === DEFAULT_OG_IMAGE
    ? { ...image, alt: fallbackAlt }
    : image;
};
