export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin",
          "/login",
          "/dashboard",
        ],
      },
    ],
    sitemap: "https://www.neevrealty.com/sitemap.xml",
  };
}