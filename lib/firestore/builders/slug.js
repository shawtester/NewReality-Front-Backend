import slugify from "slugify";

export function buildBuilderSlug(value = "") {
  const normalized = slugify(String(value || "").trim(), {
    lower: true,
    strict: true,
    trim: true,
  });

  return normalized || "builder";
}
