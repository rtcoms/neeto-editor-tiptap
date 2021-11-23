import React, { useState } from "react";
import classNames from "classnames";
import { useEditor, EditorContent } from "@tiptap/react";

import BubbleMenu from "./CustomExtensions/BubbleMenu";
import FixedMenu from "./CustomExtensions/FixedMenu";
import ImageUploader from "./CustomExtensions/Image/Uploader";
import useCustomExtensions from "./CustomExtensions/useCustomExtensions";

const Tiptap = (
  {
    forceTitle = false,
    hideSlashCommands = false,
    formatterOptions = [
      "bold",
      "italic",
      "code",
      "highlight",
      "strike",
      "link",
    ],
    className,
    uploadEndpoint,
    initialValue = "",
    onChange = () => {},
    menuType = "fixed",
    variables,
    mentions,
    showImageInMention = false,
    placeholder,
    extensions,
    ...otherProps
  },
  ref
) => {
  const [isImageUploadVisible, setImageUploadVisible] = useState(false);

  const isFixedMenuActive = menuType === "fixed";
  const isBubbleMenuActive = menuType === "bubble";
  const isSlashCommandsActive = !hideSlashCommands;
  const showSlashCommandPlaceholder = !placeholder && isSlashCommandsActive;

  const customExtensions = useCustomExtensions({
    forceTitle,
    placeholder,
    extensions,
    mentions,
    variables,
    isSlashCommandsActive,
    showImageInMention,
    setImageUploadVisible,
  });

  const editor = useEditor({
    extensions: customExtensions,
    content: initialValue,
    injectCSS: false,
    editorProps: {
      attributes: {
        class:
          className ||
          classNames(
            "prose focus:outline-none whitespace-pre-wrap border p-3",
            {
              "slash-active": showSlashCommandPlaceholder,
              "fixed-menu-active": isFixedMenuActive,
              "bubble-menu-active": isBubbleMenuActive,
            }
          ),
      },
    },
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
  });

  /* Make editor object available to the parent */
  React.useImperativeHandle(ref, () => ({
    editor: editor,
  }));

  return (
    <div>
      {isFixedMenuActive ? (
        <FixedMenu
          editor={editor}
          variables={variables}
          setImageUploadVisible={setImageUploadVisible}
        />
      ) : null}
      {isBubbleMenuActive ? (
        <BubbleMenu editor={editor} formatterOptions={formatterOptions} />
      ) : null}
      <ImageUploader
        isVisible={isImageUploadVisible}
        setIsVisible={setImageUploadVisible}
        editor={editor}
        imageUploadUrl={uploadEndpoint}
      />
      <EditorContent editor={editor} {...otherProps} />
    </div>
  );
};

export default React.forwardRef(Tiptap);