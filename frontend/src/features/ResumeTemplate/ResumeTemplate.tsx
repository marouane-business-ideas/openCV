import { useContext } from "react";
import { useTranslation } from "react-i18next";
import Card from "../../components/Card/Card";
import { resumeTemplates } from "../../components/ResumeModels/templates";
import { ResumeContext, ResumeDispatchContext, resumeInfoType, TemplateType } from "../../context/ResumeContext";

const ResumeTemplate = ({ edited }: { edited: boolean }) => {
    const { onGoingResume, resumeBeingEdited } = useContext(ResumeContext);
    const dispatch = useContext(ResumeDispatchContext);
    const { t } = useTranslation();

    const resumeTemplate = edited ? (resumeBeingEdited as resumeInfoType).resumeTemplate : onGoingResume.resumeTemplate;

    const handleTemplateClick = (template: TemplateType) => {
        if (dispatch)
            dispatch({ type: `SET_TEMPLATE${edited ? "_EDITED" : ""}`, payload: template });
    };
    return (
        <Card>
            <div className="flex flex-col gap-2 pb-12">
                <h2 className="text-lg font-bold text-gray-900 mb-2">{t("form.template.select_template")}</h2>
                <div className="flex flex-wrap gap-4">
                    {(Object.keys(resumeTemplates) as TemplateType[]).map((template) => (
                        <button
                            key={template}
                            onClick={() => handleTemplateClick(template)}
                            className={`flex-1 p-3  border rounded-lg cursor-pointer transition-transform transform
                                hover:scale-105 text-lg font-semibold ${resumeTemplate === template ?
                                    "bg-blue-200" : ""}`} >
                            {t(resumeTemplates[template].labelKey)}
                        </button>
                    ))}
                </div>
            </div>
        </Card>
    );
};

export default ResumeTemplate;