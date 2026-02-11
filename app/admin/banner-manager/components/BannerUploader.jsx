"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { uploadToCloudinary } from "@/lib/cloudinary/uploadBanner";
import { updateBanner } from "@/lib/firestore/banners/write";
import { getBanner } from "@/lib/firestore/banners/read";

// ✅ DYNAMIC INTRO TEXT MAPPING (FALLBACK - SAME AS MAIN PAGE)
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
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [currentBanner, setCurrentBanner] = useState(null);
    const [currentIntroText, setCurrentIntroText] = useState("");
    const [currentPageTitle, setCurrentPageTitle] = useState("");
    
    // ✅ NEW: EDITABLE INTRO TEXT STATES
    const [editMode, setEditMode] = useState(false);
    const [editedIntroText, setEditedIntroText] = useState("");
    const [editedPageTitle, setEditedPageTitle] = useState("");
    const [savingIntro, setSavingIntro] = useState(false);

    // ✅ FETCH CURRENT BANNER + INTRO + PAGE TITLE ON LOAD
    useEffect(() => {
        const fetchCurrentBanner = async () => {
            try {
                const banner = await getBanner(category);
                setCurrentBanner(banner);
                
                // ✅ Use saved intro text OR fallback
                const savedIntro = banner?.introText || INTRO_TEXTS[category] || INTRO_TEXTS.default;
                setCurrentIntroText(savedIntro);
                setEditedIntroText(savedIntro);
                
                // 🔥 NEW: Use saved page title OR dynamic fallback
                const savedPageTitle = banner?.pageTitle || generateDynamicPageTitle(category);
                setCurrentPageTitle(savedPageTitle);
                setEditedPageTitle(savedPageTitle);
                
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

        if (category) {
            fetchCurrentBanner();
        }
    }, [category]);

    // 🔥 NEW: DYNAMIC PAGE TITLE GENERATOR (same logic as main page)
    const generateDynamicPageTitle = (cat) => {
        const bhkMap = {
            "1-bhk": "1 BHK", "1.5-bhk": "1.5 BHK", "2-bhk": "2 BHK", "2.5-bhk": "2.5 BHK",
            "3-bhk": "3 BHK", "3.5-bhk": "3.5 BHK", "4-bhk": "4 BHK", "4.5-bhk": "4.5 BHK",
            "5-bhk": "5 BHK", "above-5-bhk": "5+ BHK"
        };
        
        const formatName = (value) => value?.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) || '';
        
        if (cat.includes('-bhk')) return `${bhkMap[cat] || 'Properties'} Properties for Sale in Gurgaon`;
        if (cat === 'new-launch' || cat === 'ready-to-move' || cat === 'under-construction' || cat === 'pre-launch') {
            return `${formatName(cat)} Projects in Gurgaon`;
        }
        if (['dwarka-expressway', 'golf-course-road', 'golf-course-extension-road', 'sohna-road', 'new-gurgaon', 'old-gurgaon', 'spr', 'nh8'].includes(cat)) {
            return `${formatName(cat)} Properties in Gurgaon`;
        }
        
        return "Residential Apartments Property for Sale in Gurgaon";
    };

    // ✅ SAVE BANNER + INTRO + PAGE TITLE TOGETHER
    const handleSave = async () => {
        if (!file && !editMode) return alert("Select banner or edit intro/page title");

        setLoading(true);

        try {
            let imageUrl = currentBanner?.image;

            // Upload image if new file selected
            if (file) {
                imageUrl = await uploadToCloudinary(file, "banners");
            }

            // 🔥 SAVE BANNER + INTRO TEXT + PAGE TITLE TO FIRESTORE
            await updateBanner({
                category,
                image: imageUrl,
                introText: editedIntroText || currentIntroText,
                pageTitle: editedPageTitle || currentPageTitle, // ✅ NEW: Save page title
            });

            alert("✅ Banner, Intro & Page Title Updated Successfully!");
            setFile(null);
            
            // ✅ REFETCH TO UPDATE PREVIEW
            const updatedBanner = await getBanner(category);
            setCurrentBanner(updatedBanner);
            setCurrentIntroText(updatedBanner?.introText || editedIntroText);
            setCurrentPageTitle(updatedBanner?.pageTitle || editedPageTitle);
            
        } catch (err) {
            console.error(err);
            alert("❌ Update Failed");
        }

        setLoading(false);
    };

    // ✅ SAVE INTRO + PAGE TITLE ONLY
    const handleSaveTextOnly = async () => {
        if (!editedIntroText.trim() || !editedPageTitle.trim()) {
            return alert("Intro text and page title cannot be empty");
        }

        setSavingIntro(true);

        try {
            await updateBanner({
                category,
                image: currentBanner?.image, // Keep existing image
                introText: editedIntroText.trim(),
                pageTitle: editedPageTitle.trim(), // ✅ NEW: Save page title
            });

            alert("✅ Intro Text & Page Title Updated!");
            setCurrentIntroText(editedIntroText);
            setCurrentPageTitle(editedPageTitle);
            setEditMode(false);
            
        } catch (err) {
            console.error(err);
            alert("❌ Text Update Failed");
        }

        setSavingIntro(false);
    };

    return (
        <div className="space-y-6 p-6 bg-white rounded-xl shadow-lg max-w-2xl mx-auto">
            {/* ✅ PAGE TITLE */}
            <div className="text-center">
                <h1 className="text-2xl font-bold text-gray-900 capitalize">
                    {category.replace(/-/g, ' ')} Banner & Content
                </h1>
                <p className="text-sm text-gray-500 mt-1">
                    Current: {currentBanner ? "✅ Live" : "No banner yet"}
                </p>
            </div>

            {/* ✅ CURRENT BANNER PREVIEW */}
            {currentBanner?.image && (
                <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Current Live Banner:</h3>
                    <div className="relative w-full h-48 md:h-64 rounded-xl overflow-hidden shadow-md border-2 border-dashed border-blue-200">
                        <Image
                            src={currentBanner.image}
                            alt={`${category} banner`}
                            fill
                            className="object-cover hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-black/20 hover:bg-black/0 transition-all duration-300" />
                    </div>
                </div>
            )}

            {/* ✅ NEW BANNER PREVIEW */}
            {file && (
                <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-2">New Banner Preview:</h3>
                    <div className="relative w-full h-48 md:h-64 rounded-xl overflow-hidden shadow-md border-2 border-dashed border-green-200">
                        <Image
                            src={URL.createObjectURL(file)}
                            alt="new banner preview"
                            fill
                            className="object-cover hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-black/10" />
                    </div>
                </div>
            )}

            {/* 🔥 NEW: PAGE TITLE EDITOR */}
            <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    Page Title 
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        currentBanner?.pageTitle ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                        {currentBanner?.pageTitle ? 'Custom Live' : 'Dynamic Fallback'}
                    </span>
                </h3>
                {editMode ? (
                    <input
                        type="text"
                        value={editedPageTitle}
                        onChange={(e) => setEditedPageTitle(e.target.value)}
                        placeholder="Enter page title (e.g. '3 BHK Properties in Gurgaon')"
                        className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#F5A300] focus:border-transparent text-sm"
                        maxLength={80}
                    />
                ) : (
                    <div className="p-3 bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl border-l-4 border-emerald-400 shadow-sm">
                        <p className="text-sm font-semibold text-gray-900">{currentPageTitle} </p>
                        <p className="text-xs text-gray-600 mt-1">This appears as H1 on the page</p>
                    </div>
                )}
            </div>

            {/* ✅ EDITABLE INTRO TEXT */}
            <div>
                <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-medium text-gray-700 flex items-center gap-2">
                        Intro Text Preview:
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            currentBanner?.introText ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                            {currentBanner?.introText ? 'Live' : 'Editable'}
                        </span>
                    </h3>
                    <button
                        onClick={() => setEditMode(!editMode)}
                        className="text-xs px-3 py-1 bg-[#F5A300]/20 hover:bg-[#F5A300]/30 text-[#F5A300] rounded-full font-medium transition-all duration-200"
                    >
                        {editMode ? 'Preview' : 'Edit'}
                    </button>
                </div>

                {editMode ? (
                    // ✅ EDIT MODE - TEXTAREA
                    <div className="space-y-3">
                        <textarea
                            value={editedIntroText}
                            onChange={(e) => setEditedIntroText(e.target.value)}
                            placeholder="Write compelling intro text (max 2 lines recommended)..."
                            className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#F5A300] focus:border-transparent resize-vertical min-h-[100px] text-sm leading-relaxed"
                            rows={4}
                        />
                        <div className="flex gap-2 pt-2">
                            <button
                                onClick={handleSaveTextOnly}
                                disabled={!editedIntroText.trim() || !editedPageTitle.trim() || savingIntro}
                                className="flex-1 bg-[#F5A300] text-white px-4 py-2 rounded-xl font-medium hover:shadow-md transition-all duration-200 disabled:bg-gray-400"
                            >
                                {savingIntro ? "Saving..." : "Save Text Only"}
                            </button>
                            <button
                                onClick={() => setEditMode(false)}
                                className="px-4 py-2 text-gray-600 hover:text-gray-900 font-medium transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                        <div className="text-xs text-gray-500 text-center pt-2">
                            Intro: {editedIntroText.length}/300 | Title: {editedPageTitle.length}/80
                        </div>
                    </div>
                ) : (
                    // ✅ PREVIEW MODE
                    <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border-l-4 border-[#F5A300] shadow-sm max-h-28 overflow-hidden hover:max-h-none transition-all duration-300">
                        <p className="text-sm text-gray-700 leading-relaxed">
                            {currentIntroText}
                        </p>
                        {currentIntroText.length > 150 && (
                            <span className="text-xs text-gray-500 block mt-2">✨ Exactly what users see (2-line preview)</span>
                        )}
                    </div>
                )}
            </div>

            {/* 🔥 FILE INPUT */}
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-gray-400 transition-colors">
                <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setFile(e.target.files[0])}
                    className="hidden"
                    id={`banner-upload-${category}`}
                />
                <label
                    htmlFor={`banner-upload-${category}`}
                    className="cursor-pointer flex flex-col items-center gap-2 p-4"
                >
                    <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                        <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                    </div>
                    <div>
                        <p className="font-medium text-gray-900">{file ? "New banner selected" : "Click to upload new banner"}</p>
                        <p className="text-sm text-gray-500">JPG, PNG (Max 5MB recommended)</p>
                    </div>
                </label>
            </div>

            {/* ✅ MAIN SAVE BUTTON - BANNER + INTRO + PAGE TITLE */}
            <button
                onClick={handleSave}
                disabled={(!file && !editMode) || loading}
                className={`w-full py-3 px-6 rounded-xl font-semibold text-white transition-all duration-200 flex items-center justify-center gap-2 shadow-lg ${
                    (!file && !editMode) || loading
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-gradient-to-r from-[#F5A300] to-yellow-500 hover:from-yellow-500 hover:to-[#F5A300] hover:shadow-xl hover:scale-[1.02]'
                }`}
            >
                {loading ? (
                    <>
                        <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Saving...
                    </>
                ) : (
                    <>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        {file && editMode ? "Save Banner + Content" : file ? "Save Banner" : "Save Content Changes"}
                    </>
                )}
            </button>

          
        </div>
    );
}
