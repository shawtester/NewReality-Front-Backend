import { db } from "@/lib/firebase";
import { toWebpUrl } from "@/lib/cloudinary/toWebpUrl";
import { doc, getDoc } from "firebase/firestore";

export async function getBuilderById(id) {
  if (!id) return null;

  const snap = await getDoc(doc(db, "builders", id));
  if (!snap.exists()) return null;

  const data = snap.data();

  return {
    id: snap.id,
    ...data,
    logo: data?.logo?.url
      ? { ...data.logo, url: toWebpUrl(data.logo.url) }
      : data?.logo,
  };
}
