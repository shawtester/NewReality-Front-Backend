import { Timestamp } from "firebase/firestore";

export const defaultProperty = {
    // 🔹 BASIC
    title: "",
    slug: "",
    location: "",
    developer: "",
    areaRange: "",
    priceRange: "",

    isRera: false,
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
    isReadyToMove: false,
    isUnderConstruction: false,
    isPreLaunch: false,

    isActive: true,

    // 🔹 MEDIA
    mainImage: {
        url: "",
        publicId: "",
    },
    gallery: [],

    video: {
        url: "",
        publicId: "",
    },

    brochure: {
        url: "",
        name: "",
    },


    // 🔹 CONTENT
    overview: {
        title: "",
        subtitle: "",
        description: "",
    },
    description: "",
    disclaimer: "",

    // ✅ NEW QUICK FACT FIELDS
    projectArea: "",
    projectType: "",
    projectStatus: "",
    projectElevation: "",
    possession: "",


    // 🔹 ARRAYS
    configurations: [],
    floorPlans: [],
    amenities: [],
    locationPoints: [],
    faq: [],

    //Payment PLan
    paymentPlan: [
        { title: "", percent: "", note: "" }
    ],


    // 🔹 LOCATION IMAGE (NEW)
    locationImage: {
        url: "",
        publicId: "",
    },


    // 🔹 META
    timestampCreate: Timestamp.now(),
    timestampUpdate: null,
};
