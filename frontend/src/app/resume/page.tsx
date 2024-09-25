"use client";
import Form from "../../features/Form/Form"
import PdfViewer from "../../features/PdfViewer/PdfViewer";

const ResumeBuilder = () => {
    return (
        <div className="flex flex-col 2xl:flex-row relative overflow-y-hidden items-center w-full h-screen 2xl:h-[calc(100vh-var(--header-height))]">
            <Form edited={false} />
            <PdfViewer edited={false} />
        </div>
    );
}

export default ResumeBuilder;