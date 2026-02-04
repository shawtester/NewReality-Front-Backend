/* ======================================================
   🔥 CLOUDINARY IMAGE UPLOAD (DEVELOPER LOGO)
====================================================== */

export async function uploadToCloudinary(file) {
  if (!file) throw new Error("No file selected");

  // ⭐ APNA CLOUDINARY DETAILS
  const cloudName = "dzcocqhut";          // dashboard se
  const uploadPreset = "developers_logos"; // unsigned preset

  // API URL
  const url = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

  // FORM DATA
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", uploadPreset);

  try {
    const res = await fetch(url, {
      method: "POST",
      body: formData,
    });

    const data = await res.json();

    // ❌ ERROR HANDLE
    if (!res.ok) {
      console.error("Cloudinary error:", data);
      throw new Error(data.error?.message || "Upload failed");
    }

    // ✅ IMPORTANT RETURN FORMAT
    return {
      secure_url: data.secure_url,
      public_id: data.public_id,
      original_filename: data.original_filename,
      width: data.width,
      height: data.height,
    };
  } catch (err) {
    console.error(err);
    throw new Error("Cloudinary upload failed");
  }
}
