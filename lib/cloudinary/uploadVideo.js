export const uploadVideoToCloudinary = async (file) => {
  if (!file) throw new Error("No video selected");

  const cloudName = "dzcocqhut";
  const uploadPreset = "property_videos";

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", uploadPreset);

  let res;
  try {
    res = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/video/upload`,
      {
        method: "POST",
        body: formData,
      }
    );
  } catch (e) {
    console.error("Network error:", e);
    throw new Error("Network error while uploading video");
  }

  const data = await res.json();

  if (!res.ok) {
    console.error("Cloudinary error:", data);
    throw new Error(data.error?.message || "Video upload failed");
  }

  return {
    url: data.secure_url,
    publicId: data.public_id,
  };
};
