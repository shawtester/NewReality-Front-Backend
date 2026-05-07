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
          "Paragraph=p; Heading 1=h1; Heading 2=h2; Heading 3=h3; Heading 4=h4; Heading 5=h5; Heading 6=h6; Preformatted=pre",

        font_family_formats:
          "Arial=arial,helvetica,sans-serif;" +
          "Arial Black=arial black,avant garde;" +
          "Calibri=calibri,sans-serif;" +
          "Cambria=cambria,serif;" +
          "Candara=candara,sans-serif;" +
          "Comic Sans MS=comic sans ms,sans-serif;" +
          "Consolas=consolas,monaco,monospace;" +
          "Courier New=courier new,courier,monospace;" +
          "Georgia=georgia,palatino,serif;" +
          "Helvetica=helvetica,arial,sans-serif;" +
          "Impact=impact,chicago;" +
          "Lucida Console=lucida console,monaco,monospace;" +
          "Palatino=palatino linotype,book antiqua,palatino,serif;" +
          "Tahoma=tahoma,arial,helvetica,sans-serif;" +
          "Times New Roman=times new roman,times,serif;" +
          "Trebuchet MS=trebuchet ms,geneva,sans-serif;" +
          "Verdana=verdana,geneva,sans-serif",

        font_size_formats:
          "8px 9px 10px 11px 12px 13px 14px 16px 18px 20px 22px 24px 26px 28px 30px 32px 36px 40px 44px 48px 54px 60px 66px 72px",

        line_height_formats: "1 1.15 1.25 1.5 1.75 2 2.5 3",

        style_formats: [
          { title: "Title", block: "h1" },
          { title: "Subtitle", block: "h2" },
          { title: "Section Heading", block: "h3" },
          { title: "Normal Text", block: "p" },
          { title: "Quote", block: "blockquote" },
          { title: "Code", block: "pre" },
        ],

        plugins:
          "advlist autolink lists link image charmap preview anchor " +
          "searchreplace visualblocks code fullscreen " +
          "insertdatetime media table paste help wordcount directionality",

        toolbar:
          "undo redo | styleselect formatselect | " +
          "bold italic underline strikethrough superscript subscript | fontselect fontfamily fontsizeselect fontsize lineheight | " +
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
