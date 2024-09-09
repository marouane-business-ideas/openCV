import { useState, useContext } from "react";
import { TrashIcon } from "@heroicons/react/24/solid";
import classNames from "classnames";
import { ContentEditableEvent } from "react-simple-wysiwyg";

import { resumeInfoType, ResumeContext, ResumeDispatchContext } from "../../context/ResumeContext";
import Card from "../../components/Card/Card";
import Description from "../../components/Description/Description";
import MoveArrows from "../../components/MoveArrows/MoveArrows";

const WorkExperience = ({ edited }: { edited: boolean }) => {
    const { onGoingResume, resumeBeingEdited } = useContext(ResumeContext);
    const dispatch = useContext(ResumeDispatchContext);

    const workExperience = edited ? (resumeBeingEdited as resumeInfoType).workExperience : onGoingResume.workExperience;

    const [errors, setErrors] = useState<{ [key: number]: { [key: string]: string } }>({});
    const [touchedFields, setTouchedFields] = useState<{ [key: number]: { [key: string]: boolean } }>({});

    const validateField = (property: string, value: string) => {
        if (property !== "description" && value.trim() === "") {
            return `${property} is required`;
        }
        return "";
    };

    const handleWorkExperienceChange = (e: React.ChangeEvent<HTMLInputElement> | ContentEditableEvent,
        property: keyof resumeInfoType["workExperience"][0], index: number) => {
        const value = e.target.value;
        if (dispatch) {
            dispatch({
                type: `SET_WORK_EXPERIENCE${edited ? "_EDITED" : ""}`,
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

        // Check validity of the current job
        const currentJob = { ...workExperience[index], [property]: value };
        const isJobValid = Object.keys(currentJob).every(key =>
            key === "id" || key === "isValid" || key === "description" || (currentJob[key as keyof typeof currentJob] as string).trim() !== ""
        );

        // Update job validity
        if (dispatch) {
            dispatch({
                type: `SET_WORK_EXPERIENCE_VALIDITY${edited ? "_EDITED" : ""}`,
                payload: { index, isValid: isJobValid }
            });
        }
    };

    const handleBlur = (property: string, index: number) => {
        setTouchedFields(prev => ({
            ...prev,
            [index]: { ...prev[index], [property]: true }
        }));
        const value = workExperience[index][property as keyof resumeInfoType["workExperience"][0]];
        const error = validateField(property, value as string);
        setErrors(prev => ({
            ...prev,
            [index]: { ...prev[index], [property]: error }
        }));

        // Check validity of the current job
        const currentJob = workExperience[index];
        const isJobValid = Object.keys(currentJob).every(key =>
            key === "id" || key === "isValid" || key === "description" || (currentJob[key as keyof typeof currentJob] as string).trim() !== ""
        );

        // Update job validity
        if (dispatch) {
            dispatch({
                type: `SET_WORK_EXPERIENCE_VALIDITY${edited ? "_EDITED" : ""}`,
                payload: { index, isValid: isJobValid }
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

    const handleAddWorkExperience = () => {
        if (dispatch)
            dispatch({ type: `ADD_WORK_EXPERIENCE${edited ? "_EDITED" : ""}` });
    };

    const handleDeletingWorkExperience = (index: number) => {
        if (dispatch)
            dispatch({ type: `DELETE_WORK_EXPERIENCE${edited ? "_EDITED" : ""}`, payload: index });

        // Clean up errors and touchedFields for the deleted job
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

    const movingAroundWorkExperience = (index: number, direction: "up" | "down") => {
        if (dispatch)
            dispatch({ type: `MOVE_WORK_EXPERIENCE${edited ? "_EDITED" : ""}`, payload: { index, direction } });

        // Swap errors and touchedFields for the moved jobs
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

    return (
        <Card>
            <h2 className="text-lg font-bold text-gray-900 mb-2">WORK EXPERIENCE</h2>
            <>
                {workExperience.map((job, index) => (
                    <JobExperience
                        key={job.id}
                        job={job}
                        index={index}
                        handleWorkExperienceChange={handleWorkExperienceChange}
                        handleDeletingWorkExperience={handleDeletingWorkExperience}
                        movingAroundWorkExperience={movingAroundWorkExperience}
                        workExperience={workExperience}
                        errors={errors[index] || {}}
                        touchedFields={touchedFields[index] || {}}
                        handleBlur={handleBlur}
                        inputClassName={inputClassName}
                    />
                ))}
            </>
            <div className="w-full flex justify-end">
                <button
                    aria-label="Add job"
                    disabled={!workExperience[workExperience.length - 1].isValid}
                    onClick={handleAddWorkExperience}
                    className={classNames(
                        "text-lg font-bold text-gray-900 rounded-lg border-solid border-gray-300 border p-2",
                        { "cursor-not-allowed": !workExperience[workExperience.length - 1].isValid },
                        { "hover:bg-gray-400": workExperience[workExperience.length - 1].isValid }
                    )}
                >
                    + Add Job
                </button>
            </div>
        </Card>
    );
};

interface JobExperienceProps {
    job: resumeInfoType["workExperience"][0];
    index: number;
    handleWorkExperienceChange: (e: React.ChangeEvent<HTMLInputElement> | ContentEditableEvent,
        property: keyof resumeInfoType["workExperience"][0], index: number) => void;
    handleDeletingWorkExperience: (index: number) => void;
    movingAroundWorkExperience: (index: number, direction: "up" | "down") => void;
    workExperience: resumeInfoType["workExperience"];
    errors: { [key: string]: string };
    touchedFields: { [key: string]: boolean };
    handleBlur: (property: string, index: number) => void;
    inputClassName: (value: string, index: number, fieldName: string) => string;
}

const JobExperience = ({ job, index, handleWorkExperienceChange, handleDeletingWorkExperience, movingAroundWorkExperience,
    workExperience, errors, touchedFields, handleBlur, inputClassName }: JobExperienceProps) => (
    <div className="flex flex-col gap-2 pb-12">
        <div className="flex flex-col gap-2">
            <div className="flex justify-between">
                <label className="text-base font-medium text-gray-700" htmlFor={`company-${index}`}>Company</label>
                <div className="flex gap-4">
                    <MoveArrows handleMovingArround={movingAroundWorkExperience} items={workExperience} index={index} />
                    <button onClick={() => handleDeletingWorkExperience(index)} aria-label="Delete job">
                        {workExperience.length > 1 && <TrashIcon className="size-4 text-gray-400" />}
                    </button>
                </div>
            </div>
            <input
                onChange={(e) => handleWorkExperienceChange(e, "company", index)}
                onBlur={() => handleBlur("company", index)}
                className={inputClassName(job.company, index, "company")}
                type="text"
                id={`company-${index}`}
                name="company"
                required
                placeholder="Google"
                value={job.company}
            />
            {touchedFields.company && errors.company && <span className="text-red-500 text-sm">{errors.company}</span>}
        </div>

        <div className="flex gap-2 justify-between">
            <div className="flex flex-col gap-2 w-3/5">
                <label className="text-base font-medium text-gray-700" htmlFor={`jobTitle-${index}`}>Job Title</label>
                <input
                    onChange={(e) => handleWorkExperienceChange(e, "jobTitle", index)}
                    onBlur={() => handleBlur("jobTitle", index)}
                    className={inputClassName(job.jobTitle, index, "jobTitle")}
                    type="text"
                    id={`jobTitle-${index}`}
                    name="jobTitle"
                    required
                    placeholder="Software engineer"
                    value={job.jobTitle}
                />
                {touchedFields.jobTitle && errors.jobTitle && <span className="text-red-500 text-sm">{errors.jobTitle}</span>}
            </div>
            <div className="flex flex-col gap-2 w-2/5">
                <label className="text-base font-medium text-gray-700" htmlFor={`workExperience-date-${index}`}>Date</label>
                <input
                    onChange={(e) => handleWorkExperienceChange(e, "date", index)}
                    onBlur={() => handleBlur("date", index)}
                    className={inputClassName(job.date, index, "date")}
                    type="text"
                    id={`workExperience-date-${index}`}
                    name="date"
                    required
                    placeholder="August 2020 - Present"
                    value={job.date}
                />
                {touchedFields.date && errors.date && <span className="text-red-500 text-sm">{errors.date}</span>}
            </div>
        </div>

        <div className="flex flex-col gap-2 w-2/5">
            <label className="text-base font-medium text-gray-700" htmlFor={`location-${index}`}>Location</label>
            <input
                onChange={(e) => handleWorkExperienceChange(e, "location", index)}
                onBlur={() => handleBlur("location", index)}
                className={inputClassName(job.location, index, "location")}
                type="text"
                id={`location-${index}`}
                name="location"
                required
                placeholder="Paris, France"
                value={job.location}
            />
            {touchedFields.location && errors.location && <span className="text-red-500 text-sm">{errors.location}</span>}
        </div>

        <div className="flex flex-col gap-2">
            <label className="text-base font-medium text-gray-700" htmlFor={`description-${index}`}>Description (Optional)</label>
            <Description
                onChange={(e) => handleWorkExperienceChange(e, "description", index)}
                html={job.description}
                index={index}
            />
            {touchedFields.description && errors.description && <span className="text-red-500 text-sm">{errors.description}</span>}
        </div>
    </div>
);

export default WorkExperience;