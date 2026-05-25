import { db } from "@/lib/firebase";
import { toOptimizedUrl, toHighQualityUrl } from "@/lib/cloudinary/toWebpUrl";
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

    const normalizeImages = (images = [], width = 1920, isHero = false) =>
      images.map((image) => ({
        ...image,
        url: isHero ? toHighQualityUrl(image?.url, width) : toOptimizedUrl(image?.url, width),
      }));

    return {
      mobileImages: normalizeImages(data.mobileImages || [], 1200, true),
      desktopImages: normalizeImages(data.desktopImages || [], 2560, true),
      videoUrl: data.videoUrl || "",
      mediaType: data.mediaType || "youtube",
    };
  } catch (error) {
    console.error("Error fetching hero server-side:", error);
    return null;
  }
};
