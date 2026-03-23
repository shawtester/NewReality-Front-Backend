export const uploadPropertyImage = async (file, slug, suffix) => {
  const cloudName = "dzcocqhut";
  const uploadPreset = "property_images";

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", uploadPreset);

  // 🔥 MAIN CHANGE
  formData.append("public_id", `properties/${slug}-${suffix}`);

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    {
      method: "POST",
      body: formData,
    }
  );

  const data = await res.json();

  return {
    url: data.secure_url,
    publicId: data.public_id,
  };
};