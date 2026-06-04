export const getSimilarProjectCards = ({
  projects = [],
  currentSlug,
  currentDeveloper,
  limit = 12,
}) => {
  if (!currentDeveloper) return [];

  return (projects || [])
    .filter(
      (p) =>
        p.slug !== currentSlug &&
        p.developer?.toLowerCase() === currentDeveloper.toLowerCase()
    )
    .slice(0, limit)
    .map((p) => ({
      title: p.title || "",
      builder: p.developer || "",
      locationName: p.location || "",
      sector: p.sector || "",
      bhk: p.configurations?.join(", ") || "",
      size: p.areaRange || "",
      price: p.priceRange || "",
      img: p.mainImage?.url || p.gallery?.[0]?.url || "/placeholder.png",
      slug: p.slug || p.id || "",
      propertyType: p.propertyType || "residential",
      isRera: Boolean(p.isRera),
    }));
};
