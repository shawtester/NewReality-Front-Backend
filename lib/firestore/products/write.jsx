import { db } from "@/lib/firebase";
import { collection, deleteDoc, doc, setDoc, Timestamp } from "firebase/firestore";

export const createNewProperty = async ({ data }) => {
  if (!data?.title) throw new Error("Project name is required");
  if (!data?.location) throw new Error("Location is required");

  const newId = doc(collection(db, "ids")).id;

  await setDoc(doc(db, "properties", newId), {
    id: newId,
    title: data.title,
    slug: data.slug || newId,

    location: data.location,
    developer: data.developer || "",
    areaRange: data.areaRange || "",
    reraNumber: data.reraNumber || "",
    lastUpdated: data.lastUpdated || "",

    configurations: data.configurations || [],
    priceRange: data.priceRange || "",

    // ✅ CLOUDINARY STRUCTURE
    image: data.image || null,          // {url, publicId}
    mainImage: data.mainImage || null,  // {url, publicId}
    gallery: data.gallery || [],        // [{url, publicId}]

    overview: {
      title: data.overview?.title || "",
      subtitle: data.overview?.subtitle || "",
      description: data.overview?.description || "",
    },

    floorPlans: data.floorPlans || [],
    amenities: data.amenities || [],
    locationPoints: data.locationPoints || [],
    faq: data.faq || [],
    disclaimer: data.disclaimer || "",

    isNewLaunch: !!data.isNewLaunch,
    isTrending: !!data.isTrending,
    isActive: true,

    timestampCreate: Timestamp.now(),
  });
};

export const updateProperty = async ({ data }) => {
  await setDoc(
    doc(db, "properties", data.id),
    { ...data, timestampUpdate: Timestamp.now() },
    { merge: true }
  );
};

export const deleteProperty = async ({ id }) => {
  await deleteDoc(doc(db, "properties", id));
};
