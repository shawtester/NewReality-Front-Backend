import { toWebpUrl } from "./toWebpUrl";

export const uploadToCloudinary = async (file, folder = "property_images") => {
  if (!file) throw new Error("No file selected");

  const cloudName = "dzcocqhut";
  const uploadPreset = "property_images";

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", uploadPreset);
  formData.append("folder", folder);

  try {
    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data?.error?.message || "Upload failed");
    }

    return toWebpUrl(data.secure_url);
  } catch (error) {
    console.error("Cloudinary Upload Error:", error);
    throw error;
  }
};
