import { CodeBlockIcon } from "@/assets/Icons/CodeBlockIcon";
import "./TextEditor.scss";
import { Color } from "@tiptap/extension-color";
import ListItem from "@tiptap/extension-list-item";
import TextStyle, { TextStyleOptions } from "@tiptap/extension-text-style";
import { EditorProvider, useCurrentEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { NumberedListIcon } from "@/assets/Icons/NumberedListIcon";
import { ListIcon } from "@/assets/Icons/ListIcon";
import { ParagraphIcon } from "@/assets/Icons/ParagraphIcon";
import { ItalicIcon } from "@/assets/Icons/ItalicIcon";
import { BoldIcon } from "@/assets/Icons/BoldIcon";
import { UndoIcon } from "@/assets/Icons/UndoIcon";
import { CodeIcon } from "@/assets/Icons/CodeIcon";
import {
  Heading1Icon,
  Heading2Icon,
  Heading3Icon,
} from "@/assets/Icons/HeadingIcons";
import { RedoIcon } from "@/assets/Icons/RedoIcon";
import { Button } from "./ui/button";

const MenuBar = () => {
  const { editor } = useCurrentEditor();

  if (!editor) {
    return null;
  }

  return (
    <div className="menu-bar">
      <Button
        variant={"ghost"}
        onClick={() => editor.chain().focus().toggleBold().run()}
        disabled={!editor.can().chain().focus().toggleBold().run()}
        className={editor.isActive("bold") ? "is-active" : ""}
      >
        <BoldIcon />
      </Button>
      <Button
        variant={"ghost"}
        onClick={() => editor.chain().focus().toggleItalic().run()}
        disabled={!editor.can().chain().focus().toggleItalic().run()}
        className={editor.isActive("italic") ? "is-active" : ""}
      >
        <ItalicIcon />
      </Button>
      {/* <Button
      variant={'ghost'}
        onClick={() => editor.chain().focus().toggleStrike().run()}
        disabled={!editor.can().chain().focus().toggleStrike().run()}
        className={editor.isActive("strike") ? "is-active" : ""}
      >
        Strike
      </Button> */}
      <Button
        variant={"ghost"}
        onClick={() => editor.chain().focus().toggleCode().run()}
        disabled={!editor.can().chain().focus().toggleCode().run()}
        className={editor.isActive("code") ? "is-active" : ""}
      >
        <CodeIcon />
      </Button>
      {/* <Button
      variant={'ghost'} onClick={() => editor.chain().focus().unsetAllMarks().run()}>
        Clear marks
      </Button>
      <Button
      variant={'ghost'} onClick={() => editor.chain().focus().clearNodes().run()}>
        Clear nodes
      </Button> */}
      <Button
        variant={"ghost"}
        onClick={() => editor.chain().focus().setParagraph().run()}
        className={editor.isActive("paragraph") ? "is-active" : ""}
      >
        <ParagraphIcon />
      </Button>
      <Button
        variant={"ghost"}
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={editor.isActive("heading", { level: 1 }) ? "is-active" : ""}
      >
        <Heading1Icon />
      </Button>
      <Button
        variant={"ghost"}
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={editor.isActive("heading", { level: 2 }) ? "is-active" : ""}
      >
        <Heading2Icon />
      </Button>
      <Button
        variant={"ghost"}
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        className={editor.isActive("heading", { level: 3 }) ? "is-active" : ""}
      >
        <Heading3Icon />
      </Button>
      {/* <Button
      variant={'ghost'}
        onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}
        className={editor.isActive("heading", { level: 4 }) ? "is-active" : ""}
      >
        <Heading4Icon className="h-4 w-4" />
      </Button>
      <Button
      variant={'ghost'}
        onClick={() => editor.chain().focus().toggleHeading({ level: 5 }).run()}
        className={editor.isActive("heading", { level: 5 }) ? "is-active" : ""}
      >
        <Heading5Icon className="h-4 w-4" />
      </Button>
      <Button
      variant={'ghost'}
        onClick={() => editor.chain().focus().toggleHeading({ level: 6 }).run()}
        className={editor.isActive("heading", { level: 6 }) ? "is-active" : ""}
      >
        <Heading6Icon className="h-4 w-4" />
      </Button> */}
      <Button
        variant={"ghost"}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={editor.isActive("bulletList") ? "is-active" : ""}
      >
        <ListIcon />
      </Button>
      <Button
        variant={"ghost"}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={editor.isActive("orderedList") ? "is-active" : ""}
      >
        <NumberedListIcon />
      </Button>
      <Button
        variant={"ghost"}
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        className={editor.isActive("codeBlock") ? "is-active" : ""}
      >
        <CodeBlockIcon />
      </Button>
      {/* <Button
      variant={'ghost'}
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={editor.isActive("blockquote") ? "is-active" : ""}
      >
        Blockquote
      </Button> */}
      {/* <Button
      variant={'ghost'} onClick={() => editor.chain().focus().setHorizontalRule().run()}>
        Horizontal rule
      </Button>
      <Button
      variant={'ghost'} onClick={() => editor.chain().focus().setHardBreak().run()}>
        Hard break
      </Button> */}
      <Button
        variant={"ghost"}
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().chain().focus().undo().run()}
      >
        <UndoIcon />
      </Button>
      <Button
        variant={"ghost"}
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().chain().focus().redo().run()}
      >
        <RedoIcon />
      </Button>
      {/* <Button
      variant={'ghost'}
        onClick={() => editor.chain().focus().setColor("#958DF1").run()}
        className={
          editor.isActive("textStyle", { color: "#958DF1" }) ? "is-active" : ""
        }
      >
        Purple
      </Button> */}
    </div>
  );
};

const extensions = [
  Color.configure({ types: [TextStyle.name, ListItem.name] }),
  TextStyle.configure({ types: [ListItem.name] } as TextStyleOptions & {
    types: string[];
  }),
  StarterKit.configure({
    bulletList: {
      keepMarks: true,
      keepAttributes: false, // TODO : Making this as `false` becase marks are not preserved when I try to preserve attrs, awaiting a bit of help
    },
    orderedList: {
      keepMarks: true,
      keepAttributes: false, // TODO : Making this as `false` becase marks are not preserved when I try to preserve attrs, awaiting a bit of help
    },
  }),
];

type Props = {
  content: string;
  getContent: (html: string) => void;
};

const TextEditor = ({ content, getContent }: Props) => {
  return (
    <EditorProvider
      slotBefore={<MenuBar />}
      extensions={extensions}
      content={content}
      onUpdate={({ editor }) => {
        const html = editor.getHTML();
        getContent(html);
      }}
    />
  );
};

export default TextEditor;
