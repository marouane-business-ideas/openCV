import { ArrowDownTrayIcon } from "@heroicons/react/24/outline";
import { resumeInfoType } from "../../context/ResumeContext";

const BACKEND_PORT = import.meta.env.VITE_BACKEND_PORT;

const DownloadPdf = ({ resume }: { resume: resumeInfoType }) => {

    const handleDownload = () => {
        fetch(`http://localhost:${BACKEND_PORT}/print-pdf`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(resume),
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                return response.json();
            })
            .then(data => {
                console.log("Success:", data);
            })
            .catch(error => {
                console.error("Error:", error);
            });
    }

    return (
        <button
            onClick={handleDownload}
            className="flex items-center justify-center gap-2 text-white w-5/6 rounded-md px-3 py-2 hover:bg-blue-500 bg-blue-400"
        >
            <ArrowDownTrayIcon className="size-5" aria-hidden="true" />
            <span className="whitespace-nowrap text-xl">Download Resume</span>
        </button>
    );
}

export default DownloadPdf;