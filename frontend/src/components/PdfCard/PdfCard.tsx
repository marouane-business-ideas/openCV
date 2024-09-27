import { Suspense, lazy } from "react";
import { format } from "date-fns";
import Link from "next/link";
import { resumeInfoType } from "../../context/ResumeContext";
import { IPdf } from "../../Types/CommonTypes";
import ClassicalTemplate from "../ResumeModels/ClassicalTemplate";
import Spinner from "../Spinner/Spinner";


const ProfessionalTemplate = lazy(() => import("../ResumeModels/ProfessionalTemplate"));

const PdfCard = ({ pdf }: { pdf: IPdf }) => {
    const resumeData = JSON.parse(pdf.content) as resumeInfoType;
    const ResumeTemplate = pdf.template === "professional" ? ProfessionalTemplate : ClassicalTemplate;
    return (
        <div key={pdf.createdAt} className="flex flex-col items-center bg-white m-8 shadow-md relative overflow-hidden"
            style={{ minWidth: "320px", maxWidth: "320px", minHeight: "450px", maxHeight: "450px" }} >
            <Suspense fallback={<Spinner className="w-10 h-10" />}>
                <div className="flex relative overflow-x-hidden overflow-y-scroll">
                    <ResumeTemplate
                        customStyle={{ minWidth: "840px", transform: "scale(0.4)", transformOrigin: "top" }}
                        resume={resumeData} />
                </div>
            </Suspense>
            <p className="mt-2 text-gray-500">Last updated: {format(new Date(pdf.createdAt), "MMM d, yyyy hh:mm a")}</p>
            <Link href={`/resume/${pdf.id}`} className="flex items-center justify-center mt-4 w-full bg-blue-500 text-white py-2
                    px-4 rounded-lg shadow-md hover:bg-blue-600 transition duration-200">
                View/Edit
            </Link>
        </div>
    )
}

export default PdfCard;