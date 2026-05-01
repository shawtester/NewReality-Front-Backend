import { db } from "@/lib/firebase";
import { toWebpUrl } from "@/lib/cloudinary/toWebpUrl";
import { doc, getDoc } from "firebase/firestore";

export const getBanner = async (category) => {
  const ref = doc(db, "banners", category);
  const snap = await getDoc(ref);

  if (snap.exists()) {
    const data = snap.data();
    const images = Array.isArray(data.images)
      ? data.images.map((image) => toWebpUrl(image))
      : [];
    const imageLinks = {};

    Object.entries(data.imageLinks || {}).forEach(([imageUrl, link]) => {
      imageLinks[toWebpUrl(imageUrl)] = link;
    });

    return {
      ...data,
      image: toWebpUrl(data.image),
      images,
      imageLinks,
    };
  }

  return null;
};
