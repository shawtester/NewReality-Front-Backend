"use client";

import { useState, useEffect, useRef } from "react";
import { Editor } from "@tinymce/tinymce-react";
import { uploadToCloudinary } from "@/lib/cloudinary/uploadBlogImage";

export default function TinyEditor({
  value,
  onChange,
  imageUploadFolder = "blogs/content",
}) {
  const editorRef = useRef(null);
  const [localValue, setLocalValue] = useState(value || "");

  const uploadEditorImage = async (file) => {
    const result = await uploadToCloudinary(file, imageUploadFolder);
    if (!result?.url) {
      throw new Error("Image upload failed");
    }

    return result.url;
  };

  // Sync only when external value changes (not on every keystroke)
  useEffect(() => {
    if (value !== localValue) {
      setLocalValue(value || "");
    }
  }, [value]);

  return (
    <Editor
      apiKey="3tmqwwyrz0eveysl8cqygv8v5v3qu9v10ao1b2n6hviq2uza"
      onInit={(evt, editor) => (editorRef.current = editor)}
      value={localValue}
      init={{
        height: 500,
        menubar: true,

        directionality: "ltr",

        // ✅ ADD THIS
        block_formats:
          "Paragraph=p; Heading 1=h1; Heading 2=h2; Heading 3=h3",

        plugins:
          "advlist autolink lists link image charmap preview anchor " +
          "searchreplace visualblocks code fullscreen " +
          "insertdatetime media table paste help wordcount directionality",

        toolbar:
          "undo redo | formatselect | " +
          "bold italic underline strikethrough | fontselect fontsizeselect | " +
          "forecolor backcolor | alignleft aligncenter alignright alignjustify | " +
          "bullist numlist outdent indent | blockquote | " +
          "link image media | table | code | removeformat | ltr rtl",

        toolbar_mode: "wrap",
        automatic_uploads: true,
        image_title: true,
        image_advtab: true,
        file_picker_types: "image",

        images_upload_handler: (blobInfo) =>
          new Promise((resolve, reject) => {
            uploadEditorImage(blobInfo.blob())
              .then(resolve)
              .catch((error) => {
                console.error("TinyMCE image upload failed:", error);
                reject(error.message || "Image upload failed");
              });
          }),

        file_picker_callback: (callback, value, meta) => {
          if (meta.filetype !== "image") return;

          const input = document.createElement("input");
          input.setAttribute("type", "file");
          input.setAttribute("accept", "image/*");

          input.onchange = async () => {
            const file = input.files?.[0];
            if (!file) return;

            try {
              const url = await uploadEditorImage(file);
              callback(url, { title: file.name });
            } catch (error) {
              console.error("TinyMCE image upload failed:", error);
              alert("Image upload failed");
            }
          };

          input.click();
        },

        content_style: `
          body {
            direction: ltr;
            text-align: left;
          }
        `,
      }}

      // 🔥 Local update only (no parent re-render per letter)
      onEditorChange={(content) => {
        setLocalValue(content);
      }}

      // 🔥 Parent sync only when user leaves editor
      onBlur={() => {
        onChange(localValue);
      }}
    />
  );
}
