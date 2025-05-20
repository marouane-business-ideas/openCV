import { createElement, useState } from "react";
import ReactDOMServer from "react-dom/server";
import classNames from "classnames";
import { useParams } from "react-router-dom";
import { useAuth, useUser } from "@clerk/clerk-react";
import { ArrowDownTrayIcon, ArrowPathIcon } from "@heroicons/react/24/outline";
import { useTranslation } from "react-i18next";

import { resumeInfoType, TemplateType } from "../../context/ResumeContext";
import DownloadError from "../../utils/DownloadError";
import ClassicalTemplate from "../../components/ResumeModels/ClassicalTemplate";
import ProfessionalTemplate from "../../components/ResumeModels/ProfessionalTemplate";

const DownloadPdf = ({ resume, isEditing, resumeTemplate }: { resume: resumeInfoType; isEditing: boolean, resumeTemplate: TemplateType }) => {
    const { resumeId } = useParams();
    const { user, isSignedIn } = useUser();
    const [isDownloading, setIsDownloading] = useState(false);
    const [downloadError, setDownloadError] = useState<string | null>(null);
    const { getToken } = useAuth();
    const { t } = useTranslation();

    const handleError = (error: unknown) => {
        console.error("Error downloading the PDF:", error);
        if (error instanceof DownloadError && error.code === "LIMIT_REACHED") {
            setDownloadError(t("common.errors.limit_reached_download_error"));
        } else {
            setDownloadError(t("common.errors.unkown_download_error"));
        }
        setIsDownloading(false);
    };

    const downloadPdf = async (url: string, method: "PUT" | "POST") => {
        const token = await getToken();

        const Preview = resumeTemplate === "professional" ? ProfessionalTemplate : ClassicalTemplate;
        const htmlContent = ReactDOMServer.renderToStaticMarkup(createElement(Preview, { resume }));

        const response = await fetch(url, {
            method,
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify({ resumeHtml: htmlContent, resumeData: resume, template: resumeTemplate }),
        });

        if (!response.ok) {
            const errorResponse = await response.json();
            if (errorResponse?.message === "You reached the limit of pdfs you can generate on the free plan") {
                throw new DownloadError(errorResponse.message, "LIMIT_REACHED");
            }
            throw new DownloadError("Network response was not ok", "NETWORK_ERROR");
        }

        return response.blob();
    };

    const handleDownload = async () => {
        if (!isSignedIn) return;
        setDownloadError(null);
        setIsDownloading(true);

        try {
            const url = isEditing
                ? `/api/users/${user.id}/pdfs/${resumeId}`
                : `/api/users/${user.id}/pdfs`;
            const method = isEditing ? "PUT" : "POST";

            const blob = await downloadPdf(url, method);

            const downloadUrl = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = downloadUrl;
            a.download = "CV.pdf";
            document.body.appendChild(a);
            a.click();
            a.remove();
            setIsDownloading(false);
        } catch (error) {
            handleError(error);
        }
    };

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
                <span className="whitespace-nowrap text-xl">{t("common.buttons.download_resume")}</span>
            </button>
            {!isSignedIn && <p className="md:text-sm text-xs text-gray-500">{t("common.buttons.sign_in_to_download")}</p>}
            {isDownloading && <ArrowPathIcon className="animate-spin size-7 text-blue-400" aria-hidden="true" />}
            {downloadError && <p className="text-sm text-red-500">{downloadError}</p>}
        </>
    );
};

export default DownloadPdf;