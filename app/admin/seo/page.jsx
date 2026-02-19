"use client";
import { useState, useEffect } from "react";
import { getSEO } from "@/lib/firestore/seo/read";
import { saveSEO } from "@/lib/firestore/seo/write";

// Static pages including new pages
const defaultStaticPages = [
  { label: "Home", slug: "home", path: "/" },
  { label: "Blog", slug: "blog", path: "/blog" },
  { label: "About", slug: "about", path: "/about" },
  { label: "Contact", slug: "contact", path: "/contact" },
  { label: "Careers", slug: "careers", path: "/careers" },
  { label: "Our Services", slug: "our-services", path: "/our-services" },
  { label: "Privacy Policy", slug: "privacy", path: "/privacy" },
  { label: "Terms & Conditions", slug: "terms", path: "/terms" },
];

export default function SEOAdminPage({ BASE_URL = "https://www.neevrealty.com/ " }) {
  const [staticPages, setStaticPages] = useState(defaultStaticPages);
  const [propertyOptions, setPropertyOptions] = useState([]);
  const [pageSlug, setPageSlug] = useState("home");
  const [seoData, setSeoData] = useState({
    title: "",
    description: "",
    keywords: "",
    canonical: "",
  });

  // Fetch all properties dynamically
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const res = await fetch("/api/properties");
        const data = await res.json();
        const options = (data || []).map(p => ({
          label: `${p.title} (${p.type})`,
          slug: p.slug,
          path: `/${p.type.toLowerCase()}/${p.slug}`,
        }));
        setPropertyOptions(options);
      } catch (err) {
        console.error("Error fetching properties:", err);
      }
    };
    fetchProperties();
  }, []);

  // Fetch SEO data for selected page/property
  useEffect(() => {
    const fetchSEOData = async () => {
      try {
        const data = await getSEO(pageSlug);
        setSeoData({
          title: data?.title || "",
          description: data?.description || "",
          keywords: data?.keywords || "",
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
    if (pageSlug) fetchSEOData();
  }, [pageSlug, propertyOptions]);

  const handleChange = e => setSeoData({ ...seoData, [e.target.name]: e.target.value });

  // Save SEO data for any page/property
  const handleSave = async () => {
    try {
      await saveSEO(pageSlug, seoData);
      alert("SEO saved successfully!");
    } catch (err) {
      console.error("Error saving SEO:", err);
      alert("Error saving SEO");
    }
  };

  const getFullURL = slug => {
    const staticPage = staticPages.find(p => p.slug === slug);
    if (staticPage) return BASE_URL + staticPage.path;

    const propertyPage = propertyOptions.find(p => p.slug === slug);
    if (propertyPage) return BASE_URL + propertyPage.path;

    return BASE_URL + "/";
  };

  return (
    <div className="p-5 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">SEO Admin Panel</h1>

      {/* Dropdown */}
      <label className="block mb-2">
        Select Page / Property:
        <select
          value={pageSlug}
          onChange={e => setPageSlug(e.target.value)}
          className="border p-2 w-full mt-1"
        >
          {staticPages.map(p => (
            <option key={p.slug} value={p.slug}>{p.label}</option>
          ))}
          {propertyOptions.map(p => (
            <option key={p.slug} value={p.slug}>{p.label}</option>
          ))}
        </select>
      </label>

      {/* Canonical URL */}
      <p className="text-sm mb-4">
        Full URL: <span className="text-blue-600 break-all">{getFullURL(pageSlug)}</span>
      </p>

      {/* SEO Fields */}
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

      <label className="block mb-4">
        Description:
        <textarea
          name="description"
          value={seoData.description}
          onChange={handleChange}
          className="border p-2 w-full mt-1"
        />
      </label>

      <label className="block mb-4">
        Keywords:
        <input
          type="text"
          name="keywords"
          value={seoData.keywords}
          onChange={handleChange}
          className="border p-2 w-full mt-1"
        />
      </label>

      <label className="block mb-4">
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
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Save SEO
      </button>
    </div>
  );
}
