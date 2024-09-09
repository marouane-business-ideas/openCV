import { useState, useContext } from "react";
import { TrashIcon } from "@heroicons/react/24/solid";
import classNames from "classnames";
import { ContentEditableEvent } from "react-simple-wysiwyg";

import { resumeInfoType, ResumeContext, ResumeDispatchContext } from "../../context/ResumeContext";
import Card from "../../components/Card/Card";
import Description from "../../components/Description/Description";
import MoveArrows from "../../components/MoveArrows/MoveArrows";

const Education = ({ edited }: { edited: boolean }) => {
    const { onGoingResume, resumeBeingEdited } = useContext(ResumeContext);
    const dispatch = useContext(ResumeDispatchContext);

    const educations = edited ? (resumeBeingEdited as resumeInfoType).education : onGoingResume.education;

    const [errors, setErrors] = useState<{ [key: number]: { [key: string]: string } }>({});
    const [touchedFields, setTouchedFields] = useState<{ [key: number]: { [key: string]: boolean } }>({});

    const validateField = (property: string, value: string) => {
        if (property !== "description" && value.trim() === "") {
            return `${property} is required`;
        }
        return "";
    };

    const handleSchoolChange = (e: React.ChangeEvent<HTMLInputElement> | ContentEditableEvent,
        property: keyof resumeInfoType["education"][0], index: number) => {
        const value = e.target.value;
        if (dispatch) {
            dispatch({
                type: `SET_SCHOOL${edited ? "_EDITED" : ""}`,
                payload: { [property]: value, index }
            });
        }

        if (touchedFields[index] && touchedFields[index][property]) {
            const error = validateField(property, value);
            setErrors(prev => ({
                ...prev,
                [index]: { ...prev[index], [property]: error }
            }));
        }

        // Check validity of the current education entry
        const currentEducation = { ...educations[index], [property]: value };
        const isEducationValid = validateEducation(currentEducation);

        // Update education validity
        if (dispatch) {
            dispatch({
                type: `SET_EDUCATION_VALIDITY${edited ? "_EDITED" : ""}`,
                payload: { index, isValid: isEducationValid }
            });
        }
    };

    const handleBlur = (property: string, index: number) => {
        setTouchedFields(prev => ({
            ...prev,
            [index]: { ...prev[index], [property]: true }
        }));
        const value = educations[index][property as keyof resumeInfoType["education"][0]];
        const error = validateField(property, value as string);
        setErrors(prev => ({
            ...prev,
            [index]: { ...prev[index], [property]: error }
        }));

        // Check validity of the current education entry
        const currentEducation = educations[index];
        const isEducationValid = validateEducation(currentEducation);

        // Update education validity
        if (dispatch) {
            dispatch({
                type: `SET_EDUCATION_VALIDITY${edited ? "_EDITED" : ""}`,
                payload: { index, isValid: isEducationValid }
            });
        }
    };

    const inputClassName = (value: string, index: number, fieldName: string) => `
        border p-1 rounded-md focus:outline-none
        ${touchedFields[index] && touchedFields[index][fieldName] && value.trim() === ""
            ? "border-red-500 border-2"
            : "border-gray-300"
        }
    `;

    const handleAddSchool = () => {
        if (dispatch)
            dispatch({ type: `ADD_SCHOOL${edited ? "_EDITED" : ""}` });
    };

    const handleDeleteSchool = (index: number) => {
        if (dispatch)
            dispatch({ type: `DELETE_SCHOOL${edited ? "_EDITED" : ""}`, payload: index });

        // Clean up errors and touchedFields for the deleted education entry
        setErrors(prev => {
            const newErrors = { ...prev };
            delete newErrors[index];
            return newErrors;
        });
        setTouchedFields(prev => {
            const newTouchedFields = { ...prev };
            delete newTouchedFields[index];
            return newTouchedFields;
        });
    };

    const movingAroundSchool = (index: number, direction: "up" | "down") => {
        if (dispatch)
            dispatch({ type: `MOVE_SCHOOL${edited ? "_EDITED" : ""}`, payload: { index, direction } });

        // Swap errors and touchedFields for the moved education entries
        const newIndex = direction === "up" ? index - 1 : index + 1;
        setErrors(prev => {
            const newErrors = { ...prev };
            [newErrors[index], newErrors[newIndex]] = [newErrors[newIndex], newErrors[index]];
            return newErrors;
        });
        setTouchedFields(prev => {
            const newTouchedFields = { ...prev };
            [newTouchedFields[index], newTouchedFields[newIndex]] = [newTouchedFields[newIndex], newTouchedFields[index]];
            return newTouchedFields;
        });
    };

    const validateEducation = (education: resumeInfoType["education"][0]) => {
        return (
            education.schoolName.trim() !== "" &&
            education.date.trim() !== "" &&
            education.degree.trim() !== ""
        );
    };

    return (
        <Card>
            <h2 className="text-lg font-bold text-gray-900 mb-2">EDUCATION</h2>
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
                        errors={errors[index] || {}}
                        touchedFields={touchedFields[index] || {}}
                        handleBlur={handleBlur}
                        inputClassName={inputClassName}
                    />
                ))}
            </>
            <div className="w-full flex justify-end">
                <button
                    aria-label="Add school"
                    disabled={!educations[educations.length - 1].isValid}
                    onClick={handleAddSchool}
                    className={classNames(
                        "text-lg font-bold text-gray-900 rounded-lg border-solid border-gray-300 border p-2",
                        { "cursor-not-allowed": !educations[educations.length - 1].isValid },
                        { "hover:bg-gray-400": educations[educations.length - 1].isValid }
                    )}
                >
                    + Add School
                </button>
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
    errors: { [key: string]: string };
    touchedFields: { [key: string]: boolean };
    handleBlur: (property: string, index: number) => void;
    inputClassName: (value: string, index: number, fieldName: string) => string;
}

const EducationItem = ({ education, index, handleSchoolChange, handleDeleteSchool, movingAroundSchool,
    educations, errors, touchedFields, handleBlur, inputClassName }: EducationItemProps) => (
    <div className={"flex flex-col gap-2 pb-12"}>
        <div className="flex gap-2 justify-between">
            <div className="flex flex-col gap-2 w-3/5">
                <label className="text-base font-medium text-gray-700" htmlFor={`school-${index}`}>School</label>
                <input
                    onChange={(e) => handleSchoolChange(e, "schoolName", index)}
                    onBlur={() => handleBlur("schoolName", index)}
                    className={inputClassName(education.schoolName, index, "schoolName")}
                    type="text"
                    id={`school-${index}`}
                    name="school"
                    required
                    placeholder="Escp Europe"
                    value={education.schoolName}
                />
                {errors.schoolName && touchedFields.schoolName && (
                    <span className="text-red-500 text-sm">{errors.schoolName}</span>
                )}
            </div>
            <div className="flex flex-col gap-2 w-2/5">
                <div className="flex justify-between">
                    <label className="text-base font-medium text-gray-700" htmlFor={`education-date-${index}`}>Date</label>
                    <div className="flex gap-4">
                        <MoveArrows handleMovingArround={movingAroundSchool} items={educations} index={index} />
                        <button onClick={() => handleDeleteSchool(index)} aria-label="Delete school">
                            {educations.length > 1 && <TrashIcon className="size-4 text-gray-400" />}
                        </button>
                    </div>
                </div>
                <input
                    onChange={(e) => handleSchoolChange(e, "date", index)}
                    onBlur={() => handleBlur("date", index)}
                    className={inputClassName(education.date, index, "date")}
                    type="text"
                    id={`education-date-${index}`}
                    name="date"
                    required
                    placeholder="August 2020"
                    value={education.date}
                />
                {errors.date && touchedFields.date && (
                    <span className="text-red-500 text-sm">{errors.date}</span>
                )}
            </div>
        </div>
        <div className="flex gap-2 justify-between">
            <div className="flex flex-col gap-2 w-3/5">
                <label className="text-base font-medium text-gray-700" htmlFor={`degree-${index}`}>Degree</label>
                <input
                    onChange={(e) => handleSchoolChange(e, "degree", index)}
                    onBlur={() => handleBlur("degree", index)}
                    className={inputClassName(education.degree, index, "degree")}
                    type="text"
                    id={`degree-${index}`}
                    name="degree"
                    required
                    placeholder="Masters in Computer Science"
                    value={education.degree}
                />
                {errors.degree && touchedFields.degree && (
                    <span className="text-red-500 text-sm">{errors.degree}</span>
                )}
            </div>
        </div>
        <div className="flex flex-col gap-2">
            <label className="text-base font-medium text-gray-700" htmlFor={`description-${index}`}>Description</label>
            <Description onChange={handleSchoolChange} index={index} html={education.description} />
        </div>
    </div>
);

export default Education;