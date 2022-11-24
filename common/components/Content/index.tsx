import React, { useEffect, useState } from "react";
import { v1 as uuidv1 } from "uuid";
import dynamic from "next/dynamic";
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

// import EditorToolbar, { modules, formats } from './EditorToolbar'
import "react-quill/dist/quill.snow.css";

function getRandomArbitrary(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

const modules = {
  toolbar: [
    [{ header: "1" }, { header: "2" }, { font: [] }],
    [{ size: [] }],
    ["bold", "italic", "underline", "strike", "blockquote"],
    [{ list: "ordered" }, { list: "bullet" }, { indent: "-1" }, { indent: "+1" }],
    ["link", "image", "video"],
    ["clean"],
  ],
  clipboard: {
    // toggle to add extra line breaks when pasting HTML:
    matchVisual: false,
  },
} as any;

const formats = [
  "header",
  "font",
  "size",
  "bold",
  "italic",
  "underline",
  "strike",
  "blockquote",
  "list",
  "bullet",
  "indent",
  "link",
  "image",
  "video",
];

interface EditorProps {
  value?: any;
  onChange?: (content: string) => void;
}

export const Editor: React.FC<EditorProps> = (props) => {
  const { value, onChange } = props;
  // const [uniqueId, setUniqueId] = useState("");

  // useEffect(() => {
  //   if (!uniqueId) {
  //     const uid = uuidv1();
  //     setTimeout(() => {
  //       setUniqueId(uid);
  //     }, getRandomArbitrary(200, 600));
  //   }
  // }, [uniqueId]);

  return (
    <div className="text-editor">
      <ReactQuill
        theme="snow"
        defaultValue={value}
        onChange={onChange}
        placeholder={"Write something awesome..."}
        modules={modules}
        formats={formats}
      />
    </div>
  );
};

export default Editor;
