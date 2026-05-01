import { db } from "@/lib/firebase";
import { toWebpUrl } from "@/lib/cloudinary/toWebpUrl";
import { doc, getDoc } from "firebase/firestore";

/* =====================================================
   🔥 SERVER – GET HERO DATA (FOR SSR)
===================================================== */
export const getHeroServer = async () => {
  try {
    const ref = doc(db, "hero", "home");
    const snap = await getDoc(ref);

    if (!snap.exists()) return null;

    const data = snap.data();
    const normalizeImages = (images = []) =>
      images.map((image) => ({
        ...image,
        url: toWebpUrl(image?.url),
      }));

    return {
      mobileImages: normalizeImages(data.mobileImages || []),
      desktopImages: normalizeImages(data.desktopImages || []),
      videoUrl: data.videoUrl || "",
      mediaType: data.mediaType || "youtube",
    };
  } catch (error) {
    console.error("Error fetching hero server-side:", error);
    return null;
  }
};
