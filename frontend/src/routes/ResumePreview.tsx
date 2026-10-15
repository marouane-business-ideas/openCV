import { useParams } from "react-router";

import PdfViewer from "../features/PdfViewer/PdfViewer";

// The resume being created ("/resume/preview"), or a saved one being edited ("/resume/:resumeId/preview")
const ResumePreview = () => {
    const { resumeId } = useParams();
    return <PdfViewer edited={resumeId !== undefined} />;
};

export default ResumePreview;
