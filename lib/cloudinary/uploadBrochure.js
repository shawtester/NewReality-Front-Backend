export const uploadBrochureToCloudinary = async (file) => {
  if (!file) return;

  const formData = new FormData();
  formData.append("file", file);

  // ✅ Direct Cloudinary preset (ENV remove)
  formData.append("upload_preset", "brochure_upload");

  const response = await fetch(
    "https://api.cloudinary.com/v1_1/dzcocqhut/auto/upload",
    {
      method: "POST",
      body: formData,
    }
  );

  const data = await response.json();

  if (!response.ok) {
    console.error("Cloudinary error:", data);
    throw new Error(data?.error?.message || "Brochure upload failed");
  }

  // ✅ Return object
  return {
    url: data.secure_url,
    publicId: data.public_id,
    originalName: data.original_filename,
  };
};
