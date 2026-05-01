import { toWebpUrl } from "./toWebpUrl";

export const uploadPropertyImage = async (file, options = {}) => {
  const cloudName = "dzcocqhut";
  const uploadPreset = "property_images";

  const upload = async (uploadOptions = {}) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", uploadPreset);

    if (uploadOptions.folder) {
      formData.append("folder", uploadOptions.folder);
    }

    if (uploadOptions.publicId) {
      formData.append("public_id", uploadOptions.publicId);
      formData.append("unique_filename", "false");
    }

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await res.json();

    if (!data.secure_url) {
      throw new Error(data.error?.message || "Upload failed");
    }

    return {
      url: toWebpUrl(data.secure_url),
      publicId: data.public_id,
    };
  };

  try {
    return await upload(options);
  } catch (error) {
    console.warn("Named Cloudinary upload failed:", error);

    if (options.publicId) {
      try {
        return await upload({
          ...options,
          publicId: `${options.publicId}-${Date.now()}`,
        });
      } catch (retryError) {
        console.warn("Timestamp Cloudinary upload retry failed:", retryError);
      }
    }

    return upload(options.folder ? { folder: options.folder } : {});
  }
};
