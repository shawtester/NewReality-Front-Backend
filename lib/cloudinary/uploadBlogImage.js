import { toWebpUrl } from "./toWebpUrl";

export const uploadToCloudinary = async (file, folder = "blogs") => {
  const cloudName = "dzcocqhut";
  const uploadPreset = "property_images";

  const upload = async (targetFolder) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", uploadPreset);

    if (targetFolder) {
      formData.append("folder", targetFolder);
    }

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await res.json();

    if (!res.ok || !data.secure_url) {
      console.error("Cloudinary Error:", data);
      throw new Error(data.error?.message || "Upload failed");
    }

    return {
      url: toWebpUrl(data.secure_url),
      publicId: data.public_id,
    };
  };

  try {
    return await upload(folder);
  } catch (error) {
    console.warn("Blog image folder upload failed, retrying without folder:", error);
    return upload("");
  }
};
