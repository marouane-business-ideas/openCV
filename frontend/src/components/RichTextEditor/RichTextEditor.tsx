import { useEffect, useRef } from "react";
import classNames from "classnames";
import { useTranslation } from "react-i18next";
import { Editor, EditorContent, useEditor, useEditorState } from "@tiptap/react";
import { BoldIcon, ItalicIcon, LinkIcon, ListBulletIcon, NumberedListIcon, UnderlineIcon } from "@heroicons/react/16/solid";

import { editorExtensions } from "./editorExtensions";
import { fromEditorHtml, toEditorHtml } from "./richText";
import "./RichTextEditor.css";

export interface RichTextEditorProps {
    // Of the editable element
    id?: string;
    value: string;
    onChange: (html: string) => void;
    ariaLabel: string;
    placeholder?: string;
}

const ToolbarButton = ({ label, active, onClick, children }: {
    label: string,
    active: boolean,
    onClick: () => void,
    children: React.ReactNode,
}) => (
    // Keeps the focus (and the selection) in the text: what is typed next goes there
    <button type="button" aria-label={label} title={label} aria-pressed={active} onClick={onClick}
        onMouseDown={(e) => e.preventDefault()}
        className={classNames("rounded p-1.5 text-gray-700 hover:bg-gray-200", active && "bg-gray-200 text-gray-900")}>
        {children}
    </button>
);

const Toolbar = ({ editor }: { editor: Editor }) => {
    const { t } = useTranslation();
    const state = useEditorState({
        editor,
        selector: ({ editor }) => ({
            bold: editor.isActive("bold"),
            italic: editor.isActive("italic"),
            underline: editor.isActive("underline"),
            bulletList: editor.isActive("bulletList"),
            orderedList: editor.isActive("orderedList"),
            link: editor.isActive("link"),
        }),
    });

    const toggleLink = () => {
        if (state.link) {
            editor.chain().focus().extendMarkRange("link").unsetLink().run();
            return;
        }
        const href = window.prompt(t("form.editor.link_prompt"), "https://")?.trim();
        if (!href) return;
        if (editor.state.selection.empty) {
            editor.chain().focus().insertContent({ type: "text", text: href, marks: [{ type: "link", attrs: { href } }] }).run();
        } else {
            editor.chain().focus().setLink({ href }).run();
        }
    };

    return (
        <div className="flex flex-wrap gap-0.5 border-b border-gray-300 bg-gray-50 px-1 py-0.5" role="toolbar">
            <ToolbarButton label={t("form.editor.bold")} active={state.bold} onClick={() => editor.chain().focus().toggleBold().run()}>
                <BoldIcon className="size-4" />
            </ToolbarButton>
            <ToolbarButton label={t("form.editor.italic")} active={state.italic}
                onClick={() => editor.chain().focus().toggleItalic().run()}>
                <ItalicIcon className="size-4" />
            </ToolbarButton>
            <ToolbarButton label={t("form.editor.underline")} active={state.underline}
                onClick={() => editor.chain().focus().toggleUnderline().run()}>
                <UnderlineIcon className="size-4" />
            </ToolbarButton>
            <span className="mx-1 w-px self-stretch bg-gray-300" />
            <ToolbarButton label={t("form.editor.bullet_list")} active={state.bulletList}
                onClick={() => editor.chain().focus().toggleBulletList().run()}>
                <ListBulletIcon className="size-4" />
            </ToolbarButton>
            <ToolbarButton label={t("form.editor.numbered_list")} active={state.orderedList}
                onClick={() => editor.chain().focus().toggleOrderedList().run()}>
                <NumberedListIcon className="size-4" />
            </ToolbarButton>
            <span className="mx-1 w-px self-stretch bg-gray-300" />
            <ToolbarButton label={t("form.editor.link")} active={state.link} onClick={toggleLink}>
                <LinkIcon className="size-4" />
            </ToolbarButton>
        </div>
    );
};

/**
 * Text with formatting (bold, italic, underline, lists, links), edited with buttons and keyboard shortcuts.
 * The value is HTML, in the format the resume templates print.
 */
const RichTextEditor = ({ id, value, onChange, ariaLabel, placeholder = "" }: RichTextEditorProps) => {
    // The editor is created once: it calls the latest onChange, and only takes a new value that it didn't produce
    const onChangeRef = useRef(onChange);
    const emittedValue = useRef(value);

    useEffect(() => {
        onChangeRef.current = onChange;
    }, [onChange]);

    const editor = useEditor({
        extensions: editorExtensions(placeholder),
        content: toEditorHtml(value),
        editorProps: {
            attributes: { ...(id && { id }), "role": "textbox", "aria-multiline": "true", "aria-label": ariaLabel },
        },
        onUpdate: ({ editor }) => {
            emittedValue.current = fromEditorHtml(editor.getHTML());
            onChangeRef.current(emittedValue.current);
        },
    });

    useEffect(() => {
        if (!editor || value === emittedValue.current) return;
        emittedValue.current = value;
        editor.commands.setContent(toEditorHtml(value), { emitUpdate: false });
    }, [editor, value]);

    return (
        <div className="rich-text-editor rounded-md border border-gray-300 bg-white">
            {editor && <Toolbar editor={editor} />}
            <EditorContent editor={editor} className="px-2 py-1 text-base text-gray-900" />
        </div>
    );
};

export default RichTextEditor;
