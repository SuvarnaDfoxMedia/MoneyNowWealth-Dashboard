


// import React, { useRef, useMemo, useCallback } from "react";
// import JoditEditor from "jodit-react";

// interface RichTextFieldProps {
//   value: string;
//   onChange: (val: string) => void;
//   height?: number; // editor height in px
//   readOnly?: boolean; // optional read-only mode
// }

// export const RichTextField: React.FC<RichTextFieldProps> = ({
//   value,
//   onChange,
//   height = 600, // default height improved
//   readOnly = false,
// }) => {
//   const editor = useRef<JoditEditor | null>(null);

//   // Memoize config for performance
//   const config = useMemo(
//     () => ({
//       readonly: readOnly,
//       height,
//       toolbarSticky: true,
//       toolbarStickyOffset: 0,
//       uploader: {
//         insertImageAsBase64URI: true, // allow base64 images
//       },
//       filebrowser: {
//         browseUrl: "",
//         height: 400,
//       },
//       enter: "P", // make Enter create paragraph instead of <div>
//       askBeforePasteHTML: false,
//       askBeforePasteFromWord: false,
//     }),
//     [height, readOnly]
//   );

//   // Handle content change
//   const handleChange = useCallback(
//     (content: string) => {
//       onChange(content);
//     },
//     [onChange]
//   );

//   return (
//     <JoditEditor
//       ref={editor}
//       value={value}
//       config={config}
//       onBlur={handleChange} // triggers on blur
//       onChange={handleChange} // triggers while typing
//     />
//   );
// };



// import React, { useRef, useMemo, useCallback } from "react";
// import JoditEditor from "jodit-react";

// interface RichTextFieldProps {
//   value: string;
//   onChange: (val: string) => void;
//   height?: number;      
//   readOnly?: boolean;   
// }

// export const RichTextField: React.FC<RichTextFieldProps> = ({
//   value,
//   onChange,
//   height = 600,
//   readOnly = false,
// }) => {
//   const editorRef = useRef<any>(null);

//   const config = useMemo(
//     () => ({
//       readonly: readOnly,
//       height,
//       toolbarSticky: true,
//       toolbarStickyOffset: 0,
//       uploader: { insertImageAsBase64URI: true },
//       filebrowser: { browseUrl: "", height: 400 },
//       enter: "p" as "p" | "div" | "br", // satisfies type
//       askBeforePasteHTML: false,
//       askBeforePasteFromWord: false,
//     }),
//     [height, readOnly]
//   );

//   const handleChange = useCallback(
//     (content: string) => {
//       onChange(content);
//     },
//     [onChange]
//   );

//   return (
//     <JoditEditor
//       ref={editorRef} 
//       value={value}
//       config={config}
//       onBlur={handleChange}   
//       onChange={handleChange} 
//     />
//   );
// };


import React, { useRef, useMemo, useCallback } from "react";
import JoditEditor from "jodit-react";

interface RichTextFieldProps {
  value: string;
  onChange: (val: string) => void;
  height?: number;      // editor height in pixels
  readOnly?: boolean;   // optional read-only mode
}

export const RichTextField: React.FC<RichTextFieldProps> = ({
  value,
  onChange,
  height = 600,
  readOnly = false,
}) => {
  const editorRef = useRef<any>(null);

  const config = useMemo(
    () => ({
      readonly: readOnly,
      height,
      toolbarSticky: true,
      toolbarStickyOffset: 0,
      
      // << FIX: do NOT insert images as Base64 >>
      uploader: { insertImageAsBase64URI: false },

      // Optional file browser config if you want to handle image uploads
      filebrowser: { browseUrl: "", height: 400 },

      enter: "p" as "p" | "div" | "br",
      askBeforePasteHTML: false,
      askBeforePasteFromWord: false,
    }),
    [height, readOnly]
  );

  const handleChange = useCallback(
    (content: string) => {
      onChange(content);
    },
    [onChange]
  );

  return (
    <JoditEditor
      ref={editorRef}
      value={value}
      config={config}
      onBlur={handleChange}   // triggers on blur
      onChange={handleChange} // triggers while typing
    />
  );
};
