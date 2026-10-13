import { lazy, Suspense } from "react";
import type { RichTextEditorProps } from "./RichTextEditor";

// The editor (Tiptap, ProseMirror) is as big as the rest of the app: it's only loaded with the form
const RichTextEditor = lazy(() => import("./RichTextEditor"));

const LazyRichTextEditor = (props: RichTextEditorProps) => (
    // Same frame as the editor, so that the form doesn't move when it appears
    <Suspense fallback={<div className="min-h-[7.25rem] rounded-md border border-gray-300 bg-white" />}>
        <RichTextEditor {...props} />
    </Suspense>
);

export default LazyRichTextEditor;
