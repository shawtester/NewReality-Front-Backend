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
    isActive: true,

    // 🔹 MEDIA
    mainImage: {
        url: "",
        publicId: "",
    },
    gallery: [],

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

    

    // 🔹 ARRAYS
    configurations: [],
    floorPlans: [],
    amenities: [],
    locationPoints: [],
    faq: [],

    // 🔹 PAYMENT PLAN
    paymentPlan: {
        installment1: "",
        installment2: "",
        installment3: "",
    },

    // 🔹 META
    timestampCreate: Timestamp.now(),
    timestampUpdate: null,
};
