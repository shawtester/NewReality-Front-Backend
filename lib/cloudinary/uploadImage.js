export const uploadToCloudinary = async (file) => {
  const cloudName = "dzcocqhut";
  const uploadPreset = "property_images";

  if (!cloudName || !uploadPreset) {
    throw new Error("Cloudinary config missing");
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", uploadPreset);
  formData.append("folder", "categories");

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    {
      method: "POST",
      body: formData,
    }
  );

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error?.message || "Upload failed");
  }

  return await res.json();
};
