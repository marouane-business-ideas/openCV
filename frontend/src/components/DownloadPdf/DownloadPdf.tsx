import { useState } from "react";
import { ArrowDownTrayIcon } from "@heroicons/react/24/outline";
import { ArrowPathIcon } from "@heroicons/react/24/outline";
import { resumeInfoType } from "../../context/ResumeContext";
import classNames from "classnames";
import { useParams } from "react-router-dom";
import { useAuth, useUser } from "@clerk/clerk-react";

const BACKEND_PORT = import.meta.env.VITE_BACKEND_PORT;

const DownloadPdf = ({ resume, isEditing }: { resume: resumeInfoType; isEditing: boolean }) => {
    const { resumeId } = useParams();
    const { user, isSignedIn } = useUser();
    const [isDownloading, setIsDownloading] = useState(false);
    const [downloadError, setDownloadError] = useState<string | null>(null);
    const { getToken } = useAuth();


    const handleDownload = async () => {
        if (!isSignedIn) {
            return;
        }
        setDownloadError(null);
        setIsDownloading(true);

        const token = await getToken();

        if (isEditing) {
            fetch(`http://localhost:${BACKEND_PORT}/users/${user.id}/pdfs/${resumeId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify({
                    resume
                }),
            }).then(response => {
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
                    setIsDownloading(false);
                    a.remove();
                })

                .catch(error => {
                    setIsDownloading(false);
                    setDownloadError("An error occurred while downloading the PDF. Please try again.");
                    console.error("Error downloading the PDF:", error);
                });
            return;
        }

        fetch(`http://localhost:${BACKEND_PORT}/users/${user.id}/pdfs`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                resume
            }),
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
                disabled={!isSignedIn}
                onClick={handleDownload}
                title={isSignedIn ? "Download your resume as a PDF" : "Sign in to download your resume as a PDF"}
                className={classNames(
                    "flex items-center justify-center gap-2 text-white w-5/6 rounded-md px-3 py-2",
                    { "bg-blue-500": isSignedIn },
                    { "hover:bg-blue-600": isSignedIn },
                    { "bg-gray-300": !isSignedIn },
                    { "cursor-not-allowed": !isSignedIn }
                )}
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