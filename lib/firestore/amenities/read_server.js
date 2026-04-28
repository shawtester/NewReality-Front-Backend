import { db } from "@/lib/firebase";
import { toWebpUrl } from "@/lib/cloudinary/toWebpUrl";
import { doc, getDoc } from "firebase/firestore";

export async function getAmenitiesByIds(ids = []) {
  if (!Array.isArray(ids) || ids.length === 0) return [];

  const results = await Promise.all(
    ids.map(async (item) => {
      // ✅ normalize ID
      const id =
        typeof item === "string"
          ? item
          : item?.id || item?.value || item?.amenityId;

      if (!id || typeof id !== "string") return null;

      const snap = await getDoc(doc(db, "amenities", id));

      if (!snap.exists()) return null;

      const data = snap.data();

      return {
        id: snap.id,
        ...data,
        image: data?.image?.url
          ? { ...data.image, url: toWebpUrl(data.image.url) }
          : data?.image,
      };
    })
  );

  return results.filter(Boolean);
}
