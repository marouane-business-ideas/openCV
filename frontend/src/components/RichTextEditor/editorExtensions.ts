import StarterKit from "@tiptap/starter-kit";
import { Placeholder } from "@tiptap/extensions";

// What the editor can produce. Only what a resume needs: anything else typed or pasted is dropped, and typed HTML
// is just text. Shared with the template lab, which saves the test resumes through the same editor
export const editorExtensions = (placeholder = "") => [
    StarterKit.configure({
        heading: false,
        blockquote: false,
        codeBlock: false,
        code: false,
        horizontalRule: false,
        strike: false,
        // Would add an empty line after a list ending the text
        trailingNode: false,
        link: { openOnClick: false, defaultProtocol: "https" },
    }),
    Placeholder.configure({ placeholder }),
];
