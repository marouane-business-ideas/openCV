import { Editor } from "@tiptap/core";

import { resumeInfoType } from "../../context/ResumeContext";
import { editorExtensions } from "../../components/RichTextEditor/editorExtensions";
import { fromEditorHtml, toEditorHtml } from "../../components/RichTextEditor/richText";

// A field saved through the form's editor: opened (toEditorHtml), then saved (fromEditorHtml), like RichTextEditor does
const throughEditor = (html: string) => {
    const editor = new Editor({ extensions: editorExtensions(), content: toEditorHtml(html) });
    const saved = fromEditorHtml(editor.getHTML());
    editor.destroy();
    return saved;
};

// The resume as if a user had saved its summary and descriptions in the form
export const resumeThroughEditor = (resume: resumeInfoType): resumeInfoType => ({
    ...resume,
    personalInfo: { ...resume.personalInfo, summary: throughEditor(resume.personalInfo.summary) },
    workExperience: resume.workExperience.map((job) => ({ ...job, description: throughEditor(job.description) })),
    education: resume.education.map((school) => ({ ...school, description: throughEditor(school.description) })),
});
