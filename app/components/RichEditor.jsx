"use client";

import { useState, useEffect, useRef } from "react";
import { Editor } from "@tinymce/tinymce-react";

export default function TinyEditor({ value, onChange }) {
  const editorRef = useRef(null);
  const [localValue, setLocalValue] = useState(value || "");

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