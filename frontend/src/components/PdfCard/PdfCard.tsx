import { Link } from "react-router";
import { format } from "date-fns";
import { useTranslation } from "react-i18next";
import { resumeInfoType } from "../../context/ResumeContext";
import { IPdf } from "../../Types/CommonTypes";
import { getResumeTemplate } from "../ResumeModels/templates";

const PdfCard = ({ pdf }: { pdf: IPdf }) => {
    const { t } = useTranslation();
    const resume = JSON.parse(pdf.jsonContent) as resumeInfoType;
    const { Component: ResumeTemplate } = getResumeTemplate(pdf.template);
    return (
        <div key={pdf.createdAt} className="flex flex-col items-center bg-white m-8 shadow-md relative overflow-hidden"
            style={{ minWidth: "320px", maxWidth: "320px", minHeight: "450px", maxHeight: "450px" }} >
            <div className="flex relative overflow-x-hidden overflow-y-scroll">
                <ResumeTemplate
                    customStyle={{ minWidth: "840px", transform: "scale(0.4)", transformOrigin: "top" }}
                    resume={resume} />
            </div>
            <p className="mt-2 text-gray-500">Last updated: {format(new Date(pdf.createdAt), "MMM d, yyyy hh:mm a")}</p>
            <Link to={`/resume/${pdf.id}`} className="flex items-center justify-center mt-4 w-full bg-blue-500 text-white py-2
                    px-4 rounded-lg shadow-md hover:bg-blue-600 transition duration-200">
                {t("dashboard.view_edit")}
            </Link>
        </div>
    );
};

export default PdfCard;