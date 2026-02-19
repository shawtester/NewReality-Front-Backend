"use client";

import { Editor } from "@tinymce/tinymce-react";

export default function TinyEditor({ value, onChange }) {
  return (
    <Editor
      apiKey="3tmqwwyrz0eveysl8cqygv8v5v3qu9v10ao1b2n6hviq2uza"  // free version works even without key
      initialValue={value || ""}
      init={{
        height: 500,
        menubar: true,
        toolbar:
          "undo redo | formatselect | " +
          "bold italic underline strikethrough | fontselect fontsizeselect | " +
          "forecolor backcolor | alignleft aligncenter alignright alignjustify | " +
          "bullist numlist outdent indent | blockquote | " +
          "link image media | table | code | removeformat",
        plugins:
          "advlist autolink lists link image charmap preview anchor " +
          "searchreplace visualblocks code fullscreen " +
          "insertdatetime media table paste help wordcount",
        toolbar_mode: "wrap",
      }}
      onEditorChange={(content) => onChange(content)}
    />
  );
}
