import { Link } from "react-router";
import { useTranslation } from "react-i18next";
import { useContext, useState } from "react";
import Profile from "../Profile/Profile";
import WorkExperience from "../WorkExperience/WorkExperience";
import Education from "../Education/Education";
import Skills from "../Skills/Skills";
import Languages from "../Languages/Languages";
import PersonnalLinks from "../PersonnalLinks/PersonnalLinks";
import Theme from "../ResumeTheme/ResumeTheme";
import ResumeTemplate from "../ResumeTemplate/ResumeTemplate";
import useIsSmallScreen from "../../lib/hooks/useIsSmallScreen";
import { ResumeContext, resumeInfoType } from "../../context/ResumeContext";
import ProfessionalTemplate from "../../components/ResumeModels/ProfessionalTemplate";
import ClassicalTemplate from "../../components/ResumeModels/ClassicalTemplate";
import MiniResumePreview from "../../components/MiniResumePreview/MiniResumePreview";


const Form = ({ edited }: { edited: boolean }) => {
    const isSmallScreen = useIsSmallScreen();
    const { t } = useTranslation();
    const { onGoingResume, resumeBeingEdited } = useContext(ResumeContext);
    const [prewiewButtonHovered, setPreviewButtonHovered] = useState(false);

    const resume = edited ? (resumeBeingEdited as resumeInfoType) : onGoingResume;
    const resumeTemplate = resume.resumeTemplate;


    const TemplateToUse = resumeTemplate === "professional" ? ProfessionalTemplate : ClassicalTemplate;

    return (
        <div className="h-full w-full lg:w-1/2 pt-0 pr-0 pb-5 pl-0 sm:p-5 flex 
        flex-col gap-5 overflow-y-scroll shadow-xl shadow-blue-500/60 items-center">
            <ResumeTemplate edited={edited} />
            <Profile edited={edited} />
            <WorkExperience edited={edited} />
            <Education edited={edited} />
            <Skills edited={edited} />
            <Languages edited={edited} />
            <PersonnalLinks edited={edited} />
            <Theme edited={edited} />
            {isSmallScreen &&
                <div
                    className="fixed bottom-4 w-fit"
                    onTouchStart={() => setPreviewButtonHovered(true)}
                    onTouchEnd={() => setPreviewButtonHovered(false)}
                    onMouseEnter={() => setPreviewButtonHovered(true)}
                    onMouseLeave={() => setPreviewButtonHovered(false)}
                >
                    {
                        prewiewButtonHovered &&
                        <MiniResumePreview>
                            <TemplateToUse customStyle={{ minWidth: "840px", transform: "scale(0.4)", transformOrigin: "top" }}
                                resume={resume} />
                        </MiniResumePreview>
                    }
                    <Link
                        className={
                            `shadow-lg p-3 border rounded-lg cursor-pointer
                             transition-transform transform hover:scale-105
                              text-sm md:text-xl font-semibold flex items-center justify-center bg-blue-200`
                        }
                        to="preview"
                    >
                        <svg
                            className="w-5 h-5 md:w-8 md:h-8 text-gray-80 mr-6"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            fill="none"
                            viewBox="0 0 24 24">
                            <path stroke="currentColor" strokeWidth="2" d="M21 12c0 1.2-4.03 6-9 6s-9-4.8-9-6c0-1.2 4.03-6 9-6s9 4.8 9 6Z" />
                            <path stroke="currentColor" strokeWidth="2" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                        </svg>

                        {t("form.preview.preview_resume")}
                    </Link>
                </div>
            }
        </div>
    );
};

export default Form;