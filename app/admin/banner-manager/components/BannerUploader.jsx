"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css";
import { uploadToCloudinary } from "@/lib/cloudinary/uploadBanner";
import { updateBanner, deleteBannerImage } from "@/lib/firestore/banners/write";
import { getBanner } from "@/lib/firestore/banners/read";

const ReactQuill = dynamic(() => import("react-quill"), {
    ssr: false,
});

// ✅ COMPLETE INTRO TEXTS (PLAIN TEXT)
const INTRO_TEXTS = {
    default: "Booming Micro Residential Apartments Market in Gurgaon – luxury apartments offering massive long-term capital gains. Explore premium projects with world-class amenities, strategic locations along Dwarka Expressway, Golf Course Road, and Southern Peripheral Road. Perfect for both end-users and investors seeking high ROI in Gurgaon's thriving real estate market.",
    residential: "Booming residential market in Gurgaon – luxury apartments, builder floors and villas offering massive long-term capital gains. Explore premium projects with world-class amenities along Dwarka Expressway, Golf Course Road, and SPR.",
    apartment: "Premium residential apartments in Gurgaon featuring modern architecture and world-class amenities. Perfect blend of luxury and convenience in strategic locations.",
    "builder-floor": "Independent builder floors offering privacy and customization. Ideal for families seeking personal space in gated communities.",
    commercial: "Prime commercial properties in Gurgaon – offices, retail shops and SCO plots in high-footfall locations. Excellent rental yields and capital appreciation.",
    retail: "High-street retail shops in Gurgaon's busiest commercial hubs. Perfect for brands seeking maximum visibility and customer traffic.",
    sco: "SCO plots in premium commercial locations – build your dream commercial space with assured returns."
};

export default function BannerUploader({ category }) {
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentBanner, setCurrentBanner] = useState(null);
    const [currentIntroText, setCurrentIntroText] = useState("");
    const [currentPageTitle, setCurrentPageTitle] = useState("");
    const [editedIntroText, setEditedIntroText] = useState("");
    const [editedPageTitle, setEditedPageTitle] = useState("");
    const [savingIntro, setSavingIntro] = useState(false);
    const [error, setError] = useState("");
    const [editMode, setEditMode] = useState(false);
    const [imageLinks, setImageLinks] = useState({});

    const quillModules = {
        toolbar: [
            [{ font: [] }],
            [{ size: ["small", false, "large", "huge"] }],
            [{ header: [1, 2, 3, 4, 5, 6, false] }],
            ["bold", "italic", "underline", "strike"],
            [{ script: "sub" }, { script: "super" }],
            [{ color: [] }, { background: [] }],
            [{ align: [] }],
            [{ list: "ordered" }, { list: "bullet" }],
            [{ indent: "-1" }, { indent: "+1" }],
            ["blockquote", "code-block"],
            ["link", "image", "video"],
            ["clean"],
        ],
    };

    const quillFormats = [
        "font",
        "size",
        "header",
        "bold",
        "italic",
        "underline",
        "strike",
        "script",
        "color",
        "background",
        "align",
        "list",
        "bullet",
        "indent",
        "blockquote",
        "code-block",
        "link",
        "image",
        "video",
    ];




    // 🔥 DELETE BANNER IMAGE
    const handleDeleteImage = async (imageUrl) => {
        if (!window.confirm(`Delete this banner image?\n${imageUrl}`)) return;

        try {
            setLoading(true);
            // Remove from local state first
            const updatedImages = currentBanner.images.filter(img => img !== imageUrl);
            const updatedLinks = { ...imageLinks };
            delete updatedLinks[imageUrl];

            // Update Firestore
            await updateBanner({
                category,
                images: updatedImages,
                imageLinks: updatedLinks,
                introText: currentIntroText,
                pageTitle: currentPageTitle
            });

            // Refresh data
            const updatedBanner = await getBanner(category);
            setCurrentBanner(updatedBanner);
            setImageLinks(updatedBanner?.imageLinks || {});

            alert("🗑️ Banner image deleted successfully!");
        } catch (err) {
            console.error("Delete error:", err);
            setError(`Delete failed: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const fetchCurrentBanner = async () => {
            try {
                const banner = await getBanner(category);
                setCurrentBanner(banner);

                if (banner?.imageLinks) {
                    setImageLinks(banner.imageLinks);
                }

                const savedIntro =
                    banner?.introText || INTRO_TEXTS[category] || INTRO_TEXTS.default;
                setCurrentIntroText(savedIntro);
                setEditedIntroText(savedIntro);

                const savedPageTitle = banner?.pageTitle || generateDynamicPageTitle(category);
                setCurrentPageTitle(savedPageTitle);
                setEditedPageTitle(savedPageTitle);
                setError("");
            } catch (err) {
                console.error("No existing banner:", err);
                const fallbackIntro = INTRO_TEXTS[category] || INTRO_TEXTS.default;
                const fallbackTitle = generateDynamicPageTitle(category);
                setCurrentIntroText(fallbackIntro);
                setEditedIntroText(fallbackIntro);
                setCurrentPageTitle(fallbackTitle);
                setEditedPageTitle(fallbackTitle);
            }
        };

        if (category) fetchCurrentBanner();
    }, [category]);

    useEffect(() => {
        if (files.length > 0) {
            const newLinks = { ...imageLinks };
            files.forEach((file) => {
                const previewKey = URL.createObjectURL(file);
                if (!newLinks[previewKey]) {
                    newLinks[previewKey] = "";
                }
            });
            setImageLinks(newLinks);
        }
    }, [files]);

    const generateDynamicPageTitle = (cat) => {
        const bhkMap = {
            "1-bhk": "1 BHK", "1.5-bhk": "1.5 BHK", "2-bhk": "2 BHK", "2.5-bhk": "2.5 BHK",
            "3-bhk": "3 BHK", "3.5-bhk": "3.5 BHK", "4-bhk": "4 BHK", "4.5-bhk": "4.5 BHK",
            "5-bhk": "5 BHK", "above-5-bhk": "5+ BHK"
        };
        const formatName = (v) => v?.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) || '';
        if (cat.includes('-bhk')) return `${bhkMap[cat] || 'Properties'} Properties for Sale in Gurgaon`;
        if (['new-launch', 'ready-to-move', 'under-construction', 'pre-launch'].includes(cat)) return `${formatName(cat)} Projects in Gurgaon`;
        return "Residential Apartments Property for Sale in Gurgaon";
    };

    const updateImageLink = (imageKey, linkUrl) => {
        setImageLinks(prev => ({
            ...prev,
            [imageKey]: linkUrl
        }));
    };

    const handleSave = async () => {
        setError("");

        if (files.length === 0 && editedIntroText === currentIntroText && editedPageTitle === currentPageTitle) {
            alert("No changes detected!");
            return;
        }

        setLoading(true);

        try {
            let imageUrls = currentBanner?.images || [];
            let updatedLinks = { ...imageLinks };

            if (files.length > 0) {
                const uploadedUrls = await Promise.all(
                    files.map(file => uploadToCloudinary(file, "banners"))
                );
                imageUrls = [...imageUrls, ...uploadedUrls];

                files.forEach((file, idx) => {
                    const previewUrl = URL.createObjectURL(file);
                    if (updatedLinks[previewUrl]) {
                        updatedLinks[uploadedUrls[idx]] = updatedLinks[previewUrl];
                        delete updatedLinks[previewUrl];
                    }
                });
            }

            const introText = (editedIntroText || currentIntroText || "").trim();
            const pageTitle = (editedPageTitle || currentPageTitle || "").trim();

            if (!pageTitle) {
                setError("Page title cannot be empty");
                return;
            }
            if (!introText) {
                setError("Intro text cannot be empty");
                return;
            }

            await updateBanner({
                category,
                images: imageUrls,
                imageLinks: updatedLinks,
                introText,
                pageTitle
            });

            alert("✅ Banner Images, Links & Plain Intro Text Updated!");
            setFiles([]);
            setEditMode(false);

            const updatedBanner = await getBanner(category);
            setCurrentBanner(updatedBanner);
            setImageLinks(updatedBanner?.imageLinks || {});
            setCurrentIntroText(extractPlainText(introText));
            setCurrentPageTitle(pageTitle);

        } catch (err) {
            console.error("Save error:", err);
            setError(`Save failed: ${err.message || 'Unknown error'}`);
        }
        setLoading(false);
    };

    const handleSaveTextOnly = async () => {
        setError("");

        const introText = extractPlainText(editedIntroText || "").trim();
        const pageTitle = editedPageTitle.trim();

        if (!introText) {
            setError("Intro text cannot be empty");
            return;
        }
        if (!pageTitle) {
            setError("Page title cannot be empty");
            return;
        }

        setSavingIntro(true);
        try {
            await updateBanner({
                category,
                images: currentBanner?.images || [],
                imageLinks: imageLinks,
                introText,
                pageTitle
            });

            alert("✅ Plain Intro Text & Page Title Updated!");
            setCurrentIntroText(introText);
            setCurrentPageTitle(pageTitle);
            setEditMode(false);
        } catch (err) {
            console.error("Text save error:", err);
            setError(`Text save failed: ${err.message || 'Unknown error'}`);
        }
        setSavingIntro(false);
    };

    return (
        <div className="space-y-6 p-6 bg-white rounded-xl shadow-lg max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold text-center text-gray-900 capitalize">
                {category.replace(/-/g, ' ')} Banner & Content
            </h1>

            {/* 🔥 ERROR DISPLAY */}
            {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                    <p className="text-sm text-red-800">{error}</p>
                    <button
                        onClick={() => setError("")}
                        className="text-red-600 text-xs hover:underline mt-1"
                    >
                        Dismiss
                    </button>
                </div>
            )}

            {/* 🔥 EDIT MODE TOGGLE */}
            <button
                onClick={() => setEditMode(!editMode)}
                className="px-4 py-2 bg-[#F5A300] text-white rounded-lg text-sm hover:bg-yellow-500 transition-all w-fit"
            >
                {editMode ? 'Cancel Edit' : '✏️ Edit Mode'}
            </button>

            {/* 🔥 CURRENT BANNERS WITH DELETE */}
            {currentBanner?.images?.length > 0 && (
                <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Current Banners:</h3>
                    <div className="space-y-3">
                        {currentBanner.images.map((img, idx) => {
                            const imageLink = imageLinks[img] || '#';
                            const hasValidLink = imageLink !== '' && imageLink !== '#';

                            return (
                                <div key={`${img}-${idx}`} className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl group">
                                    <div className="relative w-32 h-20 flex-shrink-0 rounded-lg border cursor-pointer overflow-visible">
                                        <Link
                                            href={hasValidLink ? imageLink : '#'}
                                            target="_blank"
                                            rel="noopener"
                                            className="block w-full h-full rounded-lg overflow-hidden relative group-hover:shadow-lg transition-all duration-200"
                                        >
                                            <Image
                                                src={img}
                                                alt={`Banner ${idx + 1}`}
                                                fill
                                                className="object-cover rounded-lg transition-transform duration-200 group-hover:scale-105 pointer-events-none"
                                                sizes="(max-width: 768px) 128px, 128px"
                                            />
                                            {hasValidLink && (
                                                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-all duration-200 flex items-center justify-center">
                                                    <span className="text-white text-xs font-medium px-2 py-1 bg-black/50 rounded-full">
                                                        🔗 GO
                                                    </span>
                                                </div>
                                            )}
                                        </Link>
                                    </div>

                                    {/* 🔥 DELETE BUTTON */}
                                    <button
                                        onClick={() => handleDeleteImage(img)}
                                        className="ml-2 p-1.5 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-medium shadow-sm hover:shadow-md transition-all flex-shrink-0 opacity-0 group-hover:opacity-100 ml-auto"
                                        title="Delete this image"
                                        disabled={loading}
                                    >
                                        🗑️
                                    </button>

                                    {editMode && (
                                        <div className="flex-1 min-w-0">
                                            <label className="block text-xs font-medium text-gray-600 mb-1">
                                                Link for this image:
                                            </label>
                                            <input
                                                type="url"
                                                value={imageLinks[img] || ''}
                                                onChange={(e) => updateImageLink(img, e.target.value)}
                                                placeholder="https://your-site.com/project-page"
                                                className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#F5A300] focus:border-transparent"
                                            />
                                            <p className="text-xs text-gray-500 mt-1">
                                                {hasValidLink
                                                    ? `✅ Click image above to test: ${imageLink.slice(0, 40)}...`
                                                    : '💡 Add URL to make image clickable'
                                                }
                                            </p>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* 🔥 NEW BANNER PREVIEW */}
            {files.length > 0 && (
                <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-2">New Images Preview:</h3>
                    <div className="space-y-3">
                        {files.map((file, idx) => {
                            const previewUrl = URL.createObjectURL(file);
                            const imageLink = imageLinks[previewUrl] || '#';
                            const hasValidLink = imageLink !== '' && imageLink !== '#';

                            return (
                                <div key={`${previewUrl}-${idx}`} className="flex items-center gap-3 p-3 bg-green-50/50 rounded-xl border border-green-200">
                                    <div className="relative w-32 h-20 flex-shrink-0 rounded-lg border-green-300 cursor-pointer group overflow-visible">
                                        <Link
                                            href={hasValidLink ? imageLink : '#'}
                                            target="_blank"
                                            rel="noopener"
                                            className="block w-full h-full rounded-lg overflow-hidden relative group-hover:shadow-lg transition-all duration-200"
                                        >
                                            <Image
                                                src={previewUrl}
                                                alt={`Preview ${idx + 1}`}
                                                fill
                                                className="object-cover rounded-lg transition-transform duration-200 group-hover:scale-105 pointer-events-none"
                                                sizes="(max-width: 768px) 128px, 128px"
                                            />
                                            {hasValidLink && (
                                                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-all duration-200 flex items-center justify-center">
                                                    <span className="text-white text-xs font-medium px-2 py-1 bg-black/50 rounded-full">
                                                        🔗 GO
                                                    </span>
                                                </div>
                                            )}
                                        </Link>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <label className="block text-xs font-medium text-gray-600 mb-1">Link for this image:</label>
                                        <input
                                            type="url"
                                            value={imageLinks[previewUrl] || ''}
                                            onChange={(e) => updateImageLink(previewUrl, e.target.value)}
                                            placeholder="https://your-site.com/project-page"
                                            className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#F5A300] focus:border-transparent"
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* 🔥 PAGE TITLE & EDITOR */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Page Title</label>
                <input
                    type="text"
                    value={editedPageTitle}
                    onChange={e => setEditedPageTitle(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#F5A300] focus:border-transparent text-sm"
                    maxLength={80}
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                    Intro Text (Saved as Plain Text)
                </label>
                <div className="border border-gray-300 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-[#F5A300]">
                    <ReactQuill
                        theme="snow"
                        value={editedIntroText}
                        onChange={setEditedIntroText}
                        modules={quillModules}
                        formats={quillFormats}
                        placeholder="Write full formatted page intro..."
                        className="h-[250px]"
                    />
                </div>
                <p className="text-xs text-gray-500 mt-2">
                    💡 You can use rich formatting in editor, but it will be saved/rendered as plain text
                </p>
            </div>

            <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-gray-400 transition-colors">
                <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={e => setFiles(Array.from(e.target.files))}
                    className="hidden"
                    id={`banner-upload-${category}`}
                />
                <label htmlFor={`banner-upload-${category}`} className="cursor-pointer flex flex-col items-center gap-2">
                    <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                        <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                    </div>
                    <p className="font-medium text-gray-900">{files.length > 0 ? `${files.length} files selected` : "Click to upload new banners"}</p>
                    <p className="text-sm text-gray-500">JPG, PNG (Max 5MB each)</p>
                </label>
            </div>

            <button
                onClick={handleSave}
                disabled={loading}
                className="w-full py-3 px-6 rounded-xl font-semibold text-white bg-gradient-to-r from-[#F5A300] to-yellow-500 hover:from-yellow-500 hover:to-[#F5A300] transition-all duration-200 shadow-lg disabled:bg-gray-400"
            >
                {loading ? "Saving..." : "💾 Save All (Images + Plain Text)"}
            </button>

            <button
                onClick={handleSaveTextOnly}
                disabled={savingIntro}
                className="w-full py-3 px-6 rounded-xl font-semibold text-[#F5A300] bg-gray-100 hover:bg-gray-200 transition-all duration-200"
            >
                {savingIntro ? "Saving..." : "✏️ Save Plain Text Only"}
            </button>
        </div>
    );
}
