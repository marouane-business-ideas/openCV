import { useState } from "react";
import { ArrowDownTrayIcon } from "@heroicons/react/24/outline";
import { ArrowPathIcon } from "@heroicons/react/24/outline";
import { resumeInfoType } from "../../context/ResumeContext";

const BACKEND_PORT = import.meta.env.VITE_BACKEND_PORT;

const DownloadPdf = ({ resume }: { resume: resumeInfoType }) => {
    const [isDownloading, setIsDownloading] = useState(false);
    const [downloadError, setDownloadError] = useState<string | null>(null);

    const handleDownload = () => {
        setDownloadError(null);
        setIsDownloading(true);
        fetch(`http://localhost:${BACKEND_PORT}/print-pdf`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(resume),
        })
            .then(response => {
                setIsDownloading(false);
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                return response.blob();
            })
            .then(blob => {
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = "CV.pdf";
                document.body.appendChild(a);
                a.click();
                a.remove();
            })

            .catch(error => {
                setIsDownloading(false);
                setDownloadError("An error occurred while downloading the PDF. Please try again.");
                console.error("Error downloading the PDF:", error);
            });
    }

    return (
        <>
            <button
                onClick={handleDownload}
                className="flex items-center justify-center gap-2 text-white w-5/6 rounded-md px-3 py-2 hover:bg-blue-500 bg-blue-400"
            >
                <ArrowDownTrayIcon className="size-5" aria-hidden="true" />
                <span className="whitespace-nowrap text-xl">Download Resume</span>
            </button>
            {isDownloading && <ArrowPathIcon className="animate-spin size-7 text-blue-400" aria-hidden="true" />}
            {downloadError && <p className="text-sm text-red-500">{downloadError}</p>}
        </>
    );
}

export default DownloadPdf;