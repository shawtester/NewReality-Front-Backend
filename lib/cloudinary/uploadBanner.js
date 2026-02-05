// 🔥 UNIVERSAL CLOUDINARY UPLOAD FUNCTION
// property images + banners dono ke liye same function

export const uploadToCloudinary = async (
  file,
  folder = "property_images" // default property images
) => {
  if (!file) throw new Error("No file selected");

  // ✅ Cloudinary Config
  const cloudName = "dzcocqhut";
  const uploadPreset = "property_images"; 
  // 🔥 IMPORTANT:
  // agar tu alag preset banana chahta hai banners ke liye
  // toh yaha "banners_preset" kar sakta hai

  // ✅ Form Data
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", uploadPreset);
  formData.append("folder", folder); // 🔥 dynamic folder

  try {
    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await res.json();

    // ❌ Error handling
    if (!res.ok) {
      throw new Error(data?.error?.message || "Upload failed");
    }

    // ✅ Return only secure URL
    return data.secure_url;
  } catch (error) {
    console.error("Cloudinary Upload Error:", error);
    throw error;
  }
};
