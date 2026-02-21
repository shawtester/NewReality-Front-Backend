"use client";

import { useState, useEffect } from "react";
import { getSEO } from "@/lib/firestore/seo/read";
import { saveSEO } from "@/lib/firestore/seo/write";

const defaultPages = [
  // Static Pages
  { label: "Home", slug: "home", path: "/" },
  { label: "Blog", slug: "blog", path: "/blog" },
  { label: "About", slug: "about", path: "/about" },
  { label: "Contact", slug: "contact", path: "/contact" },

  // Newly Added Static Pages
  { label: "Disclaimer", slug: "disclaimer", path: "/disclaimer" },
  { label: "Contact Us", slug: "contact-us", path: "/contact-us" },
  { label: "Careers", slug: "careers", path: "/careers" },
  { label: "Services", slug: "services", path: "/services" },

  // Commercial
  { label: "Commercial Main", slug: "commercial", path: "/commercial" },
  { label: "Commercial Retail", slug: "commercial-retail-shops", path: "/commercial?type=retail-shops" },
  { label: "Commercial SCO", slug: "commercial-sco-plots", path: "/commercial?type=sco-plots" },

  // Residential
  { label: "Residential Main", slug: "residential", path: "/residential" },
  { label: "Residential Apartments", slug: "residential-apartments", path: "/residential?type=apartments" },
  { label: "Residential Builder Floor", slug: "residential-builder-floor", path: "/residential?type=builder-floor" },
];

export default function SEOAdminPage() {
  const BASE_URL = "https://www.neevrealty.com";

  const [pages] = useState(defaultPages);
  const [propertyOptions, setPropertyOptions] = useState([]);
  const [pageSlug, setPageSlug] = useState("home");

  const [seoData, setSeoData] = useState({
    title: "",
    description: "",
    keywords: "",
    canonical: "",
  });

  // Fetch Properties for dynamic property SEO
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const res = await fetch("/api/properties");
        const data = await res.json();

        const options = (data || []).map((p) => ({
          label: `${p.title} (${p.type})`,
          slug: p.slug,
          path: `/${p.type}/${p.slug}`,
        }));

        setPropertyOptions(options);
      } catch (err) {
        console.error("Error fetching properties:", err);
      }
    };

    fetchProperties();
  }, []);

  // Fetch SEO data
  useEffect(() => {
    const fetchSEO = async () => {
      try {
        const data = await getSEO(pageSlug);

        setSeoData({
          title: data?.title || "",
          description: data?.description || "",
          keywords: Array.isArray(data?.keywords)
            ? data.keywords.join(", ")
            : data?.keywords || "",
          canonical: data?.canonical || getFullURL(pageSlug),
        });
      } catch {
        setSeoData({
          title: "",
          description: "",
          keywords: "",
          canonical: getFullURL(pageSlug),
        });
      }
    };

    fetchSEO();
  }, [pageSlug]);

  const handleChange = (e) => {
    setSeoData({ ...seoData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      await saveSEO(pageSlug, {
        ...seoData,
        keywords: seoData.keywords
          .split(",")
          .map((k) => k.trim())
          .filter(Boolean),
      });

      alert("SEO saved successfully!");
    } catch (err) {
      console.error("Error saving SEO:", err);
      alert("Error saving SEO");
    }
  };

  const getFullURL = (slug) => {
    const staticPage = pages.find((p) => p.slug === slug);
    if (staticPage) return BASE_URL + staticPage.path;

    const propertyPage = propertyOptions.find((p) => p.slug === slug);
    if (propertyPage) return BASE_URL + propertyPage.path;

    return BASE_URL;
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">SEO Admin Panel</h1>

      {/* Page Selector */}
      <label className="block mb-4">
        Select Page:
        <select
          value={pageSlug}
          onChange={(e) => setPageSlug(e.target.value)}
          className="border p-2 w-full mt-2"
        >
          {pages.map((p) => (
            <option key={p.slug} value={p.slug}>
              {p.label}
            </option>
          ))}

          {propertyOptions.length > 0 && (
            <>
              <option disabled>──────────</option>
              {propertyOptions.map((p) => (
                <option key={p.slug} value={p.slug}>
                  {p.label}
                </option>
              ))}
            </>
          )}
        </select>
      </label>

      {/* Canonical Preview */}
      <p className="text-sm mb-6">
        Full URL:
        <span className="text-blue-600 break-all ml-2">
          {getFullURL(pageSlug)}
        </span>
      </p>

      {/* Title */}
      <label className="block mb-4">
        Title:
        <input
          type="text"
          name="title"
          value={seoData.title}
          onChange={handleChange}
          className="border p-2 w-full mt-1"
        />
      </label>

      {/* Description */}
      <label className="block mb-4">
        Description:
        <textarea
          name="description"
          value={seoData.description}
          onChange={handleChange}
          className="border p-2 w-full mt-1"
          rows="4"
        />
      </label>

      {/* Keywords */}
      <label className="block mb-4">
        Keywords (comma separated):
        <input
          type="text"
          name="keywords"
          value={seoData.keywords}
          onChange={handleChange}
          className="border p-2 w-full mt-1"
        />
      </label>

      {/* Canonical */}
      <label className="block mb-6">
        Canonical URL:
        <input
          type="text"
          name="canonical"
          value={seoData.canonical}
          onChange={handleChange}
          className="border p-2 w-full mt-1"
        />
      </label>  

      <button
        onClick={handleSave}
        className="bg-blue-600 text-white px-6 py-2 rounded"
      >
        Save SEO
      </button>
    </div>
  );
}
