import { useContext } from "react";
import { TrashIcon } from "@heroicons/react/24/solid";
import { useTranslation } from "react-i18next";
import classNames from "classnames";

import { resumeInfoType, ResumeContext, ResumeDispatchContext } from "../../context/ResumeContext";
import Card from "../../components/Card/Card";
import Description from "../../components/Description/Description";
import { ContentEditableEvent } from "react-simple-wysiwyg";
import MoveArrows from "../../components/MoveArrows/MoveArrows";

const Education = ({ edited }: { edited: boolean }) => {
    const { onGoingResume, resumeBeingEdited } = useContext(ResumeContext);
    const dispatch = useContext(ResumeDispatchContext);
    const { t } = useTranslation();

    const educations = edited ? (resumeBeingEdited as resumeInfoType).education : onGoingResume.education;

    const handleAddSchool = () => {
        if (dispatch)
            dispatch({ type: `ADD_SCHOOL${edited ? "_EDITED" : ""}` });
    };

    const handleDeleteSchool = (index: number) => {
        if (dispatch)
            dispatch({ type: `DELETE_SCHOOL${edited ? "_EDITED" : ""}`, payload: index });
    };

    const handleSchoolChange = (e: React.ChangeEvent<HTMLInputElement> |
        ContentEditableEvent, property: keyof resumeInfoType["education"][0], index: number) => {
        if (dispatch)
            dispatch({ type: `SET_SCHOOL${edited ? "_EDITED" : ""}`, payload: { [property]: e.target.value, index } });
    };

    const movingAroundSchool = (index: number, direction: "up" | "down") => {
        if (dispatch)
            dispatch({ type: `MOVE_SCHOOL${edited ? "_EDITED" : ""}`, payload: { index, direction } });
    };

    return (
        <Card>
            <h2 className="text-lg font-bold text-gray-900 mb-2">{t("form.education.education")}</h2>
            <>
                {educations.map((education, index) => (
                    <EducationItem
                        key={education.id}
                        education={education}
                        index={index}
                        handleSchoolChange={handleSchoolChange}
                        handleDeleteSchool={handleDeleteSchool}
                        movingAroundSchool={movingAroundSchool}
                        educations={educations}
                    />
                ))}
            </>
            <div className="w-full flex justify-end">
                <button aria-label="Add school" disabled={!educations[educations.length - 1].schoolName} onClick={handleAddSchool}
                    className={classNames(
                        "text-lg font-bold text-gray-900 rounded-lg border-solid border-gray-300 border p-2",
                        { "cursor-not-allowed": !educations[educations.length - 1].schoolName },
                        { "hover:bg-gray-400": educations[educations.length - 1].schoolName }
                    )}>+ {t("form.education.add_school")}</button>
            </div>
        </Card>
    );
};

interface EducationItemProps {
    education: resumeInfoType["education"][0];
    index: number;
    handleSchoolChange: (e: React.ChangeEvent<HTMLInputElement>
        | ContentEditableEvent, property: keyof resumeInfoType["education"][0], index: number) => void;
    handleDeleteSchool: (index: number) => void;
    movingAroundSchool: (index: number, direction: "up" | "down") => void;
    educations: resumeInfoType["education"];
}

const EducationItem = ({ education, index, handleSchoolChange, handleDeleteSchool, movingAroundSchool, educations }: EducationItemProps) => {
    const { t } = useTranslation();

    return (
        <div className="flex flex-col gap-2 pb-12">
            <div className="flex gap-2 justify-between">
                <div className="flex flex-col gap-2 w-3/5">
                    <label className="text-base font-medium text-gray-700" htmlFor={`school-${index}`}>
                        {t("form.education.school")}
                    </label>
                    <input onChange={(e) => handleSchoolChange(e, "schoolName", index)}
                        className="border p-1 rounded-md focus:outline-hidden border-gray-300" type="text"
                        id={`school-${index}`} name="school" required placeholder="Escp Europe" value={education.schoolName} />
                </div>
                <div className="flex flex-col gap-2 w-2/5">
                    <div className="flex justify-between">
                        <label className="text-base font-medium text-gray-700" htmlFor={`education-date-${index}`}>
                            {t("form.education.date")}
                        </label>
                        <div className="flex gap-4">
                            <MoveArrows handleMovingArround={movingAroundSchool} items={educations} index={index} />
                            <button onClick={() => handleDeleteSchool(index)} aria-label="Delete school">
                                {educations.length > 1 && <TrashIcon className="size-4 text-gray-400" />}
                            </button>
                        </div>
                    </div>
                    <input onChange={(e) => handleSchoolChange(e, "date", index)}
                        className="border p-1 rounded-md focus:outline-hidden border-gray-300" type="text"
                        id={`education-date-${index}`} name="date" required placeholder="August 2020" value={education.date} />
                </div>
            </div>
            <div className="flex gap-2 justify-between">
                <div className="flex flex-col gap-2 w-3/5">
                    <label className="text-base font-medium text-gray-700" htmlFor={`degree-${index}`}>
                        {t("form.education.degree")}
                    </label>
                    <input onChange={(e) => handleSchoolChange(e, "degree", index)}
                        className="border p-1 rounded-md focus:outline-hidden border-gray-300" type="text"
                        id={`degree-${index}`} name="degree" required placeholder="Masters in Computer Science" value={education.degree} />
                </div>
            </div>
            <div className="flex flex-col gap-2">
                <label className="text-base font-medium text-gray-700" htmlFor={`description-${index}`}>
                    {t("form.education.description")}
                </label>
                <Description onChange={handleSchoolChange} index={index} html={education.description} />
            </div>
        </div>
    );
};

export default Education;