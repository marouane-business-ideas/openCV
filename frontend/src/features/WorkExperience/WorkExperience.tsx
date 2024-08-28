import { useContext } from "react";
import { TrashIcon } from "@heroicons/react/24/solid";

import { resumeInfoType, ResumeContext, ResumeDispatchContext } from "../../context/ResumeContext";
import Card from "../../components/Card/Card";
import Description from "../../components/Description/Description";
import { ContentEditableEvent } from "react-simple-wysiwyg";
import MoveArrows from "../../components/MoveArrows/MoveArrows";
import classNames from "classnames";

const WorkExperience = ({ edited }: { edited: boolean }) => {
    const { onGoingResume, resumeBeingEdited } = useContext(ResumeContext);
    const dispatch = useContext(ResumeDispatchContext);

    const workExperience = edited ? (resumeBeingEdited as resumeInfoType).workExperience : onGoingResume.workExperience;

    const handleAddWorkExperience = () => {
        if (dispatch)
            dispatch({ type: `ADD_WORK_EXPERIENCE${edited ? "_EDITED" : ""}` });
    };

    const handleDeletingWorkExperience = (index: number) => {
        if (dispatch)
            dispatch({ type: `DELETE_WORK_EXPERIENCE${edited ? "_EDITED" : ""}`, payload: index });
    };

    const handleWorkExperienceChange = (e: React.ChangeEvent<HTMLInputElement> |
        ContentEditableEvent, property: keyof resumeInfoType["workExperience"][0], index: number) => {
        if (dispatch)
            dispatch({ type: `SET_WORK_EXPERIENCE${edited ? "_EDITED" : ""}`, payload: { [property]: e.target.value, index } });
    };

    const movingAroundWorkExperience = (index: number, direction: "up" | "down") => {
        if (dispatch)
            dispatch({ type: `MOVE_WORK_EXPERIENCE${edited ? "_EDITED" : ""}`, payload: { index, direction } });
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
                    />
                ))}
            </>
            <div className="w-full flex justify-end">
                <button aria-label="Add job" disabled={!workExperience[workExperience.length - 1].company} onClick={handleAddWorkExperience}
                    className={classNames(
                        "text-lg font-bold text-gray-900 rounded-lg border-solid border-gray-300 border p-2",
                        { "cursor-not-allowed": !workExperience[workExperience.length - 1].company },
                        { "hover:bg-gray-400": workExperience[workExperience.length - 1].company }
                    )}>+ Add Job</button>
            </div>
        </Card >
    );
};

interface JobExperienceProps {
    job: resumeInfoType["workExperience"][0];
    index: number;
    handleWorkExperienceChange: (e: React.ChangeEvent<HTMLInputElement>
        | ContentEditableEvent, property: keyof resumeInfoType["workExperience"][0], index: number) => void;
    handleDeletingWorkExperience: (index: number) => void;
    movingAroundWorkExperience: (index: number, direction: "up" | "down") => void;
    workExperience: resumeInfoType["workExperience"];
}

const JobExperience = ({ job, index, handleWorkExperienceChange, handleDeletingWorkExperience,
    movingAroundWorkExperience, workExperience }: JobExperienceProps) => (
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
            <input onChange={(e) => handleWorkExperienceChange(e, "company", index)}
                className="border p-1 rounded-md focus:outline-none border-gray-300"
                type="text" id={`company-${index}`} name="company" required placeholder="Google" value={job.company} />
        </div>
        <div className="flex gap-2 justify-between">
            <div className="flex flex-col gap-2 w-3/5">
                <label className="text-base font-medium text-gray-700" htmlFor={`jobTitle-${index}`}>Job Title</label>
                <input onChange={(e) => handleWorkExperienceChange(e, "jobTitle", index)}
                    className="border p-1 rounded-md focus:outline-none border-gray-300" type="text"
                    id={`jobTitle-${index}`} name="jobTitle" required placeholder="Software engineer" value={job.jobTitle} />
            </div>
            <div className="flex flex-col gap-2 w-2/5">
                <label className="text-base font-medium text-gray-700" htmlFor={`workExperience-date-${index}`}>Date</label>
                <input onChange={(e) => handleWorkExperienceChange(e, "date", index)}
                    className="border p-1 rounded-md focus:outline-none border-gray-300"
                    type="text" id={`workExperience-date-${index}`} name="date" required placeholder="August 2020 - Present" value={job.date} />
            </div>
        </div>
        <div className="flex flex-col gap-2 w-2/5">
            <label className="text-base font-medium text-gray-700" htmlFor={`location-${index}`}>Location</label>
            <input onChange={(e) => handleWorkExperienceChange(e, "location", index)}
                className="border p-1 rounded-md focus:outline-none border-gray-300"
                type="text" id={`location-${index}`} name="location" required placeholder="Paris, France" value={job.location} />
        </div>
        <div className="flex flex-col gap-2">
            <label className="text-base font-medium text-gray-700">Description</label>
            <Description onChange={(e) => handleWorkExperienceChange(e, "description", index)} html={job.description} index={index} />
        </div>
    </div>
);

export default WorkExperience;