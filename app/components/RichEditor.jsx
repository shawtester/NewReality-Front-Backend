"use client";

import { Editor } from "@tinymce/tinymce-react";

export default function TinyEditor({ value, onChange }) {
  return (
    <Editor
      apiKey="3tmqwwyrz0eveysl8cqygv8v5v3qu9v10ao1b2n6hviq2uza"
      value={value || ""}   // ❗ initialValue hata ke value use karo
      init={{
        height: 500,
        menubar: true,

        // 🔥 FORCE LTR
        directionality: "ltr",

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

        // 🔥 Extra safety
        content_style: `
          body {
            direction: ltr;
            text-align: left;
          }
        `,
      }}
      onEditorChange={(content) => onChange(content)}
    />
  );
}