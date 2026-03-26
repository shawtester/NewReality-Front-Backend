export const uploadPropertyImage = async (file) => {
  const cloudName = "dzcocqhut";
  const uploadPreset = "property_images";

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", uploadPreset);

  // ❌ REMOVE THIS (no custom public_id)
  // formData.append("public_id", ...);

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    {
      method: "POST",
      body: formData,
    }
  );

  const data = await res.json();

  // 🔒 Safety check
  if (!data.secure_url) {
    throw new Error("Upload failed");
  }

  return {
    url: data.secure_url,
    publicId: data.public_id, // ✅ Cloudinary auto-generated
  };
};