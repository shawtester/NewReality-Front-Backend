import { Timestamp } from "firebase/firestore";

export const defaultProperty = {
    // 🔹 BASIC
    title: "",
    slug: "",
    location: "",
    developer: "",
    areaRange: "",
    priceRange: "",
    reraNumber: "",
    lastUpdated: "",

    // 🔹 TYPE / FLAGS
    propertyType: "residential", // residential | commercial
    isApartment: false,
    isBuilderFloor: false,
    isRetail: false,
    isSCO: false,

    isNewLaunch: false,
    isTrending: false,
    isActive: true,

    // 🔹 MEDIA
    mainImage: {
        url: "",
        publicId: "",
    },
    gallery: [],

    // 🔹 CONTENT
    overview: {
        title: "",
        subtitle: "",
        description: "",
    },
    description: "",
    disclaimer: "",

    // 🔹 ARRAYS
    configurations: [],
    floorPlans: [],
    amenities: [],
    locationPoints: [],
    faq: [],

    // 🔹 META
    timestampCreate: Timestamp.now(),
    timestampUpdate: null,
};
