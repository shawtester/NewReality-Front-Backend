export const uploadToCloudinary = async (
  file,
  folder = "blogs"
) => {
  const cloudName = "dzcocqhut";
  const uploadPreset = "property_images";

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", uploadPreset);
  formData.append("folder", folder);

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    {
      method: "POST",
      body: formData,
    }
  );

  const data = await res.json();

  if (!res.ok) {
    console.error("Cloudinary Error:", data);
    throw new Error(data.error?.message || "Upload failed");
  }

  // 🔥 VERY IMPORTANT
  return {
    url: data.secure_url,
    publicId: data.public_id,
  };
};
