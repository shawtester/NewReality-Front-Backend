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
        url: isHero ? toHighQualityUrl(image?.url) : toOptimizedUrl(image?.url, width),
      }));

    return {
      mobileImages: normalizeImages(data.mobileImages || [], 828, true),
      desktopImages: normalizeImages(data.desktopImages || [], 1920, true),
      videoUrl: data.videoUrl || "",
      mediaType: data.mediaType || "youtube",
    };
  } catch (error) {
    console.error("Error fetching hero server-side:", error);
    return null;
  }
};
