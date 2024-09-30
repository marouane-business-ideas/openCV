"use client";
import dynamic from "next/dynamic";

// Prevent SSR for components that rely on localStorage
const Form = dynamic(() => import("../../features/Form/Form"), { ssr: false });
const PdfViewer = dynamic(() => import("../../features/PdfViewer/PdfViewer"), { ssr: false });;

const ResumeBuilder = () => {
    return (
        <div className="flex flex-col 2xl:flex-row relative overflow-y-hidden items-center w-full h-screen 2xl:h-[calc(100vh-var(--header-height))]">
            <Form edited={false} />
            <PdfViewer edited={false} />
        </div>
    );
};

export default ResumeBuilder;